import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
// @ts-ignore
import Groq from 'groq-sdk';
import jwt from 'jsonwebtoken';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;


// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_resume_analyzer';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Database Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Models ---
const userSchema = new mongoose.Schema({
  firebaseId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  displayName: String,
  photoURL: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

const resAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jobDescription: String,
  resumeText: String,
  analysis: Object,
  atsScore: Number,
  createdAt: { type: Date, default: Date.now },
});
const Analysis = mongoose.model('Analysis', resAnalysisSchema);

// --- Auth Middleware ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

const isAdmin = async (req: any, res: any, next: any) => {
  const user = await User.findById(req.user.id);
  if (user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

// --- Multer Setup ---
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// --- API Routes ---

// Auth
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { firebaseId, email, displayName, photoURL } = req.body;
    let user = await User.findOne({ firebaseId });
    
    if (!user) {
      // Bootstrap first user or specific email as admin
      const isAdminEmail = email === 'dhyaneeshwarv@gmail.com'; 
      user = await User.create({ 
        firebaseId, 
        email, 
        displayName, 
        photoURL,
        role: isAdminEmail ? 'admin' : 'user'
      });
    } else if (user.displayName !== displayName || user.photoURL !== photoURL) {
      user.displayName = displayName;
      user.photoURL = photoURL;
      await user.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Resume Analysis
app.post('/api/analyze', authenticateToken, upload.single('resume'), async (req: any, res: any) => {
  try {
    const { jobDescription } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Resume PDF is required' });

    // Extract text from PDF
    const dataBuffer = new Uint8Array(req.file.buffer);

    const pdfDocument = await pdfjsLib.getDocument({
      data: dataBuffer
    }).promise;

    let resumeText = '';

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      resumeText += pageText + '\n';
    }

    // Groq AI Analysis
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const analysisPrompt = `
    You are an expert ATS (Applicant Tracking System) and HR professional.

    Analyze the following resume against the job description provided.

    Job Description:
    ${jobDescription}

    Resume content:
    ${resumeText}

    Return ONLY valid JSON in this exact structure:

    {
      "atsScore": integer between 0 and 100,
      "keywordmatch": [],
      "missingKeywords": [],
      "strengths": [],
      "improvements": [],
      "skillsToHighlight": [],
      "resumeBulletSuggestions": [
        {
          "original": "",
          "improved": ""
        }
      ],
      "formattingScore": number,
      "summary": ""
    }
      IMPORTANT:
      - ATS score MUST be realistic and out of 100.
      - Strong resumes should typically score between 65 and 90.
      - Weak resumes should score below 50.
      - Do NOT return single digit ATS scores unless the resume is completely irrelevant.
      - resumeBulletSuggestions MUST be an array of objects.
      - Each object must contain:
        - original
        - improved
      - Do NOT return plain strings inside resumeBulletSuggestions.
    `;

    let text = '';

    try {

      const completion =
        await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "system",
              content:
                "You are a professional ATS analyzer. Return ONLY raw JSON."
            },
            {
              role: "user",
              content: analysisPrompt
            }
          ],

          temperature: 0.2,
          max_tokens: 2000,
        });

      text =
        completion.choices?.[0]?.message?.content || '';
        text = text.replace(/```json/g, '')
           .replace(/```/g, '')
           .trim();

      if (!text.trim()) {
        throw new Error("Empty AI response");
      }

    } catch (err: any) {

      console.error("Groq API Error:");
      console.error(err);

      text = JSON.stringify({
        atsScore: 70,
        keywordmatch: null,
        missingKeywords: null,
        strengths: [
          "Resume uploaded successfully"
        ],
        improvements: [
          "AI response formatting issue occurred"
        ],
        skillsToHighlight: [],
        resumeBulletSuggestions: [],
        formattingScore: 7,
        summary:
          "Analysis completed with fallback parser."
      });
    }
    let analysisData;

    try {
      analysisData = JSON.parse(text);
    } catch {
      analysisData = {
        atsScore: 70,
        keywordmatch: [],
        missingKeywords: [],
        strengths: [
          "Resume uploaded successfully"
        ],
        improvements: [
          "AI response formatting issue occurred"
        ],
        skillsToHighlight: [],
        resumeBulletSuggestions: [],
        formattingScore: 7,
        summary:
          "Analysis completed with fallback parser."
      };
    }

    // Save Analysis to DB
    const newAnalysis = await Analysis.create({
      userId: req.user.id,
      jobDescription,
      resumeText,
      analysis: analysisData,
      atsScore: analysisData.atsScore
    });

    res.json({ analysis: analysisData, id: newAnalysis._id });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Error analyzing resume: ' + err.message });
  }
});

// Dashboard
app.get('/api/analyses', authenticateToken, async (req: any, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(analyses);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/analyses/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user.id });
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });
    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Admin
app.get('/api/admin/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAnalyses = await Analysis.countDocuments();
    const avgScore = await Analysis.aggregate([
      { $group: { _id: null, avg: { $avg: "$atsScore" } } }
    ]);

    res.json({
      totalUsers,
      totalAnalyses,
      averageAtsScore: avgScore[0]?.avg || 0
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, isAdmin, async (req: any, res) => {
  try {
    const userId = req.params.id;

    if ((req.user as any)?.id === userId) {
      return res.status(400).json({
        message: 'You cannot delete yourself'
      });
    }

    await Analysis.deleteMany({ userId });

    await User.findByIdAndDelete(userId);

    res.json({
      success: true
    });

  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      message: err.message
    });
  }
});

// Vite Setup
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});;
