import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  X,
  AlertCircle,
  Briefcase
} from 'lucide-react';

export default function Analysis() {
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
       setFile(selectedFile);
       setError(null);
    } else {
       setError("Please upload a valid PDF file");
       setFile(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/analyze', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      navigate(`/results/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-black mb-4">Analyze Your Resume</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Detailed analysis powered by GROQ AI</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Job Description */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm focus-within:ring-2 ring-blue-500/50 transition-all">
          <div className="flex items-center space-x-2 mb-4">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold">Job Description</h2>
          </div>
          <textarea
            required
            placeholder="Paste the job description or requirements here..."
            className="w-full h-48 bg-gray-50 dark:bg-gray-950 rounded-2xl p-6 text-gray-700 dark:text-gray-300 focus:outline-none resize-none border border-transparent focus:border-blue-500/30 transition-all font-sans"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {/* File Upload */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold">Resume Upload</h2>
          </div>

          <div className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
            file ? 'bg-green-50/50 border-green-500 dark:bg-green-900/10' : 'border-gray-300 dark:border-gray-800 hover:border-blue-500/50'
          }`}>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            
            {file ? (
              <div className="flex flex-col items-center">
                 <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                 <div className="font-bold mb-1">{file.name}</div>
                 <div className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                 <button 
                  type="button"
                  onClick={() => setFile(null)}
                  className="mt-4 text-sm text-red-500 hover:underline font-bold flex items-center"
                 >
                   <X className="w-4 h-4 mr-1" /> Remove
                 </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-blue-600 mb-4 opacity-50" />
                <div className="font-bold text-lg mb-2">Drop your resume here</div>
                <p className="text-gray-500 mb-4">or click to browse from your computer</p>
                <div className="px-4 py-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 rounded-lg text-sm font-bold">
                  PDF format only (Max 5MB)
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 rounded-xl flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium text-sm">{error}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading || !file || !jobDescription}
          className={`w-full py-5 rounded-2xl font-bold text-xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-3 ${
            loading || !file || !jobDescription 
              ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Analyzing Resume...</span>
            </>
          ) : (
            <>
              <FileSearch className="w-6 h-6" />
              <span>Analyze Resume Now</span>
            </>
          )}
        </button>
      </form>
      
      <div className="mt-12 mb-8 bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/20 border-l-4 border-l-blue-600">
         <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
           💡 <b>Tip:</b> For best results, include the full job description including technical requirements and soft skills.
         </p>
      </div>
    </div>
  );
}

function FileSearch({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/>
    </svg>
  );
}
