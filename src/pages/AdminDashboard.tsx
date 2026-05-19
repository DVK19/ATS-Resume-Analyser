import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Users,
  BarChart3,
  FileText,
  TrendingUp,
  ShieldAlert,
  User as UserIcon,
  Search,
  Trash2,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, usersRes] = await Promise.all([
        axios.get('${import.meta.env.VITE_API_URL}/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('${import.meta.env.VITE_API_URL}/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user: any) => {
    const confirmed = window.confirm(`Delete ${user.displayName}?`);
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  if (loading) return <AdminLoader />;

  return (
    <div className="max-w-6xl mx-auto px-4">
      <header className="mb-12">
        <div className="flex items-center space-x-3 mb-2">
          <ShieldAlert className="w-6 h-6 text-red-500" />
          <span className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
            System Administrator
          </span>
        </div>
        <h1 className="text-4xl font-black">Platform Analytics</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <AdminStatCard
          icon={<Users className="w-5 h-5 text-blue-500" />}
          label="Active Users"
          value={stats?.totalUsers || 0}
          trend="+12% this month"
        />
        <AdminStatCard
          icon={<FileText className="w-5 h-5 text-green-500" />}
          label="Total Analyses"
          value={stats?.totalAnalyses || 0}
          trend="+45% this month"
        />
        <AdminStatCard
          icon={<BarChart3 className="w-5 h-5 text-purple-500" />}
          label="Avg. Platform Score"
          value={`${Math.round(stats?.averageAtsScore || 0)}%`}
          trend="Baseline established"
        />
      </div>

      <section className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold flex items-center">
            <UserIcon className="w-5 h-5 mr-2" /> Registered Users
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-transparent focus:border-blue-500/30 rounded-xl text-sm focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50/50 dark:bg-gray-950/50">
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4">Joined</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="text-sm hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.photoURL}
                        className="w-8 h-8 rounded-full"
                        alt=""
                      />
                      <div>
                        <div className="font-bold">{user.displayName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-gray-500 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function AdminStatCard({ icon, label, value, trend }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-gray-400">
          {label}
        </span>
      </div>
      <div className="text-4xl font-black mb-2">{value}</div>
      <div className="text-[10px] font-bold text-green-500 flex items-center">
        <TrendingUp className="w-3 h-3 mr-1" /> {trend}
      </div>
    </div>
  );
}

function AdminLoader() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
        Initializing Secure Console...
      </p>
    </div>
  );
}