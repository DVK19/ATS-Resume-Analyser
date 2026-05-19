# AI Resume Analyzer & ATS Optimization Platform

A full-stack application that leverages Groq-powered Llama 3 AI to analyze resumes against job descriptions, identify keyword gaps, and provide actionable ATS optimization suggestions.

## 🚀 Features
- **AI-Powered Resume Analysis**: Uses Groq + Llama 3 for intelligent resume auditing.
- **ATS Scoring System**: Generates realistic ATS compatibility scores.
- **Keyword Optimization**: Detects missing and matched keywords from job descriptions.
- **Google Authentication**: Secure Firebase-based login system.
- **Modern Dashboard**: Track resume analysis history and improvements.
- **Admin Console**: Manage users and platform analytics.
- **PDF Resume Parsing**: Extracts and analyzes resume content automatically.

---

# 🛠 Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion

## Backend
- Node.js
- Express.js

## Database
- MongoDB Atlas
- Mongoose

## Authentication
- Firebase Authentication

## AI
- Groq API
- Llama 3 70B

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
GROQ_API_KEY
MONGODB_URI
JWT_SECRET
APP_URL = 