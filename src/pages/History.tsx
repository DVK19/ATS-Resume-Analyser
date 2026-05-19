import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  ChevronRight,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export default function History() {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('${import.meta.env.VITE_API_URL}/api/analyses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnalyses = analyses.filter(a => 
    a.jobDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
           <h1 className="text-4xl font-black mb-2">Analysis History</h1>
           <p className="text-gray-500 font-medium">Tracking your optimization journey</p>
        </div>
        <div className="relative w-full md:w-96">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
           <input 
            type="text" 
            placeholder="Search by job description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 ring-blue-500/20 text-sm font-medium transition-all"
           />
        </div>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className="h-24 bg-gray-50 dark:bg-gray-900 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 dark:bg-gray-950/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800">
           <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-gray-400" />
           </div>
           <h2 className="text-xl font-bold mb-2">No history found</h2>
           <p className="text-gray-500 mb-8 max-w-sm mx-auto">Either you haven't performed any analysis yet or your search query matches nothing.</p>
           <Link to="/analyze" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              Start New Analysis
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
           {filteredAnalyses.map((item) => (
             <Link 
              key={item._id} 
              to={`/results/${item._id}`}
              className="group bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:border-blue-500/30 transition-all flex flex-col md:flex-row items-center gap-6"
             >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl shadow-inner ${
                  item.atsScore >= 80 ? 'bg-green-50 text-green-600 dark:bg-green-950/30' :
                  item.atsScore >= 60 ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30' :
                  'bg-red-50 text-red-600 dark:bg-red-950/30'
                }`}>
                   {item.atsScore}
                </div>
                <div className="flex-1 min-w-0 text-center md:text-left">
                   <h3 className="font-bold text-lg mb-1 truncate">Job: {item.jobDescription}</h3>
                   <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5" /> {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="flex items-center"><TrendingUp className="w-3.5 h-3.5 mr-1.5" /> Improved bullets: {item.analysis.resumeBulletSuggestions.length}</span>
                   </div>
                </div>
                <div className="shrink-0 flex items-center text-blue-600 font-bold text-sm bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                   Full Report <ArrowRight className="ml-2 w-4 h-4" />
                </div>
             </Link>
           ))}
        </div>
      )}
    </div>
  );
}
