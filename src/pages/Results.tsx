import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Layout, 
  BarChart3, 
  CheckSquare,
  ArrowLeft,
  Share2
} from 'lucide-react';

export default function Results() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/analyses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
       <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 font-medium tracking-tight">Generating detailed report...</p>
       </div>
    </div>
  );

  if (!data) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">Report not found</h2>
      <Link to="/dashboard" className="text-blue-600 mt-4 block">Return to Dashboard</Link>
    </div>
  );

  const { analysis } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      <div className="flex items-center justify-between mb-8">
        <Link to="/dashboard" className="flex items-center text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">
           <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <div className="flex gap-2">
           <button onClick={() => window.print()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
              <Download className="w-4 h-4 mr-2" /> PDF Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Score Column */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 border border-gray-200 dark:border-gray-800 text-center shadow-sm">
              <div className="mx-auto mb-8 relative w-44 h-44">
                 <svg className="w-44 h-44 transform -rotate-90">
                    <circle 
                      cx="88" cy="88" r="78" 
                      fill="none" stroke="currentColor" 
                      strokeWidth="10" 
                      className="text-gray-100 dark:text-gray-800"
                    />
                    <circle 
                      cx="88" cy="88" r="78" 
                      fill="none" stroke="currentColor" 
                      strokeWidth="12" 
                      strokeDasharray={490}
                      strokeDashoffset={490 - (490 * analysis.atsScore / 100)}
                      strokeLinecap="round"
                      className={`${
                        analysis.atsScore >= 80 ? 'text-green-500' :
                        analysis.atsScore >= 60 ? 'text-yellow-500' :
                        'text-red-500'
                      } transition-all duration-1000 ease-out`}
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black">{analysis.atsScore}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">ATS Score</span>
                 </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-0">{analysis.summary}</p>
           </div>

           <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="text-base font-bold mb-4 flex items-center">
                 <Layout className="w-4 h-4 mr-2 text-blue-500" /> Layout Rating
              </h3>
              <div className="flex items-center justify-between mb-2">
                 <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mr-4 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.formattingScore * 10}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-blue-600 h-full rounded-full" 
                    />
                 </div>
                 <span className="font-bold whitespace-nowrap">{analysis.formattingScore}/10</span>
              </div>
           </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-8 space-y-8">
            {/* Keywords Section */}
            {analysis.keywordmatch?.length > 0 &&
            analysis.missingKeywords?.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 border border-gray-200 dark:border-gray-800 shadow-sm">
               <h3 className="text-xl font-bold mb-8 flex items-center">
                  <CheckSquare className="w-6 h-6 mr-3 text-indigo-600" />
                  Critical Keywords
               </h3>

               <div className="mb-10">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Found in Resume
                  </h4>

                  <div className="flex flex-wrap gap-2.5">
                  {analysis.keywordmatch.map((kw: string) => (
                     <span
                        key={kw}
                        className="px-4 py-2 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50 rounded-xl text-sm font-semibold flex items-center"
                     >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                        {kw}
                     </span>
                  ))}
                  </div>
               </div>

               <div>
                  <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">
                  Missing (Add these)
                  </h4>

                  <div className="flex flex-wrap gap-2.5">
                  {analysis.missingKeywords.map((kw: string) => (
                     <span
                        key={kw}
                        className="px-4 py-2 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-xl text-sm font-semibold flex items-center"
                     >
                        <XCircle className="w-3.5 h-3.5 mr-2" />
                        {kw}
                     </span>
                  ))}
                  </div>
               </div>
            </div>
            )}

           {/* Strengths & Improvements */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                 <h3 className="text-lg font-bold mb-6 flex items-center text-green-600">
                    <CheckCircle2 className="w-5 h-5 mr-3" /> Resume Strengths
                 </h3>
                 <ul className="space-y-4">
                    {analysis.strengths.map((s: string, idx: number) => (
                       <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start leading-relaxed">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-1.5 flex-shrink-0" /> {s}
                       </li>
                    ))}
                 </ul>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                 <h3 className="text-lg font-bold mb-6 flex items-center text-yellow-500">
                    <AlertTriangle className="w-5 h-5 mr-3" /> Growth Areas
                 </h3>
                 <ul className="space-y-4">
                    {analysis.improvements.map((i: string, idx: number) => (
                       <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start leading-relaxed">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-1.5 flex-shrink-0" /> {i}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>

           {/* AI Recommendations */}
           <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-3xl p-10 border border-indigo-100 dark:border-indigo-900/30">
              <h3 className="text-2xl font-black mb-8 flex items-center leading-none">
                 <BarChart3 className="w-7 h-7 mr-3 text-indigo-600" /> Optimization Guide
              </h3>

              <div className="space-y-6">
                 {analysis.resumeBulletSuggestions.map((item: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-gray-950/50 rounded-2xl p-6 border border-white dark:border-gray-800 shadow-sm">
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded">Original</span>
                       </div>
                       <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">"{item.original}"</p>
                       
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-blue-600 text-white rounded">Recommended</span>
                       </div>
                       <p className="text-sm font-bold text-blue-900 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                          {item.improved}
                       </p>
                    </div>
                 ))}
              </div>

              <div className="mt-10">
                 <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-4">Highlighted Skills (New)</h4>
                 <div className="flex flex-wrap gap-2">
                    {analysis.skillsToHighlight.map((skill: string) => (
                       <span key={skill} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-600/20">
                          {skill}
                       </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
