import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  FileText, 
  CheckCircle2, 
  Compass,
  ArrowRight
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50 dark:from-blue-950/20 to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Revolutionizing hiring with AI
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Beat the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ATS Algorithms.</span>
              <br /> Get Hired Faster.
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
              Analyze your resume against job descriptions using state-of-the-art GROQ AI technology. 
              Optimize keywords, improve bullet points, and get actionable feedback.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl shadow-blue-500/20 flex items-center justify-center"
              >
                Start Free Analysis <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center"
              >
                View Sample Report
              </Link>
            </div>
          </motion.div>

          {/* Feature Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative px-4"
          >
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-white dark:bg-gray-900 p-2">
               <div className="aspect-[16/9] bg-gray-50 dark:bg-gray-950 rounded-xl flex items-center justify-center text-gray-400 font-mono text-sm overflow-hidden">
                 <div className="p-8 w-full h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                       <div className="space-y-2">
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                       </div>
                       <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center text-blue-500 font-bold text-xl">
                          85%
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="h-8 w-full bg-blue-100 dark:bg-blue-900/30 rounded" />
                       <div className="h-8 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
                       <div className="h-24 w-full bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded p-4 flex gap-4">
                           <div className="w-1/3 bg-blue-50 dark:bg-blue-950/20 rounded" />
                           <div className="w-1/3 bg-green-50 dark:bg-green-950/20 rounded" />
                           <div className="w-1/3 bg-red-50 dark:bg-red-950/20 rounded" />
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why choose AI Resume Analyzer?</h2>
            <p className="text-gray-600 dark:text-gray-400">Everything you need to land your dream job offer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-blue-600" />}
              title="ATS Simulation"
              description="See how your resume looks to the robots filtering candidate pools."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-yellow-600" />}
              title="Instant Feedback"
              description="Get detailed analysis and a comprehensive score in less than 30 seconds."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-purple-600" />}
              title="Keyword Matching"
              description="Identify essential keywords missing from your profile compared to the job description."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all group">
      <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
