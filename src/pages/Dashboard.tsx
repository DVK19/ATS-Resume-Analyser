import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/analyses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentAnalyses(res.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const avgAtsScore = recentAnalyses.length 
    ? Math.round(recentAnalyses.reduce((acc, curr) => acc + curr.atsScore, 0) / recentAnalyses.length)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Hello, {user?.displayName} 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">Ready to boost your resume's performance?</p>
      </header>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
          icon={<TrendingUp className="text-blue-600" />} 
          label="Average ATS Score" 
          value={`${avgAtsScore}%`} 
          color="blue"
        />
        <StatCard 
          icon={<FileText className="text-green-600" />} 
          label="Total Analyses" 
          value={recentAnalyses.length.toString()} 
          color="green"
        />
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between">
           <div>
              <div className="font-medium opacity-80 mb-1">Ready for more?</div>
              <div className="text-2xl font-bold mb-4">Start New Analysis</div>
           </div>
           <Link 
            to="/analyze" 
            className="bg-white text-blue-600 px-4 py-3 rounded-xl font-bold text-center inline-flex items-center justify-center hover:bg-opacity-90 transition-all"
           >
             Go to Analyzer <Plus className="ml-2 w-5 h-5" />
           </Link>
        </div>
      </div>

      {/* Recent History */}
      <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-bold">Recent History</h2>
          </div>
          <Link to="/history" className="text-blue-600 text-sm font-bold flex items-center hover:underline">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : recentAnalyses.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-950/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800">
             <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
             <p className="text-gray-500 mb-6 font-medium">No analyses found yet. Start your first one today!</p>
             <Link to="/analyze" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
               Analyze Resume
             </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAnalyses.map((analysis) => (
              <Link 
                key={analysis._id} 
                to={`/results/${analysis._id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all"
              >
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                    analysis.atsScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                    analysis.atsScore >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30'
                  }`}>
                    {analysis.atsScore}
                  </div>
                  <div>
                    <h3 className="font-bold truncate max-w-[200px] md:max-w-md">Job: {analysis.jobDescription.substring(0, 60)}...</h3>
                    <p className="text-sm text-gray-500">{new Date(analysis.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  View Report <ArrowRight className="ml-2 w-4 h-4 shadow-xl" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  const colorMap: any = {
    blue: 'bg-blue-50 dark:bg-blue-900/10',
    green: 'bg-green-50 dark:bg-green-900/10',
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className={`w-12 h-12 ${colorMap[color]} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{label}</div>
      <div className="text-4xl font-black">{value}</div>
    </div>
  );
}
