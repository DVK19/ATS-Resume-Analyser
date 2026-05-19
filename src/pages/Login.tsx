import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Chrome, FileSearch } from 'lucide-react';

export default function Login() {
  const { user, login, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8 text-center"
      >
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/40">
          <FileSearch className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold mb-2">Welcome Back</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-10">Sign in to start optimizing your career path</p>

        <button
          onClick={login}
          className="w-full flex items-center justify-center space-x-3 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750 transition-all active:scale-95"
        >
          <Chrome className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>

        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500">
          By signing in, you agree to our <span className="text-blue-600 cursor-pointer">Terms of Service</span> and <span className="text-blue-600 cursor-pointer">Privacy Policy</span>.
        </div>
      </motion.div>
    </div>
  );
}
