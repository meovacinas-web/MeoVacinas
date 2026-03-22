import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Users, CheckCircle, XCircle, Download, LayoutDashboard, 
  LogOut, LogIn, Loader2, FileText 
} from 'lucide-react';

interface ResponseData {
  id: string;
  name: string;
  age: number;
  interest_campaign_2026: boolean;
  createdAt: any;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'responses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ResponseData[];
      setResponses(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching responses:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => auth.signOut();

  const exportToCSV = () => {
    const headers = ['ID', 'Nome', 'Idade', 'Interesse Campanha 2026', 'Data'];
    const rows = responses.map(r => [
      r.id,
      r.name,
      r.age,
      r.interest_campaign_2026 ? 'Sim' : 'Não',
      r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `respostas_pesquisa_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const total = responses.length;
  const simCount = responses.filter(r => r.interest_campaign_2026).length;
  const naoCount = total - simCount;

  const chartData = [
    { name: 'Sim', value: simCount, color: '#10b981' },
    { name: 'Não', value: naoCount, color: '#f43f5e' }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-slate-100"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Painel Administrativo</h1>
          <p className="text-slate-500 mb-8">Acesse para visualizar os resultados da pesquisa de vacinação.</p>
          <button 
            onClick={handleLogin}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
          >
            <LogIn className="w-5 h-5" />
            Entrar com Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://meovacinas.com.br/wp-content/uploads/2023/05/logo-meo-vacinas.png" 
              alt="Meo Vacinas" 
              className="h-8 object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            <h1 className="text-lg font-semibold text-slate-900 hidden sm:block">Dashboard Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user.displayName}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card flex items-center gap-4"
          >
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total de Respostas</p>
              <p className="text-2xl font-bold text-slate-900">{total}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card flex items-center gap-4"
          >
            <div className="p-3 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Interessados (Sim)</p>
              <p className="text-2xl font-bold text-emerald-600">{simCount}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card flex items-center gap-4"
          >
            <div className="p-3 bg-rose-100 rounded-lg">
              <XCircle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Não Interessados</p>
              <p className="text-2xl font-bold text-rose-600">{naoCount}</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chart Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Distribuição de Interesse</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-slate-500">Sim</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="text-xs text-slate-500">Não</span>
                </div>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Export & Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card flex flex-col justify-center items-center text-center"
          >
            <FileText className="w-12 h-12 text-slate-300 mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Exportar Dados</h2>
            <p className="text-slate-500 mb-6 max-w-xs">
              Baixe todas as respostas coletadas em formato CSV para análise externa.
            </p>
            <button 
              onClick={exportToCSV}
              disabled={total === 0}
              className="btn-primary flex items-center gap-2 px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              Exportar CSV
            </button>
          </motion.div>
        </div>

        {/* Recent Responses Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Respostas Recentes</h2>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Idade</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Interesse</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {responses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                      Nenhuma resposta encontrada.
                    </td>
                  </tr>
                ) : (
                  responses.slice(0, 10).map((response) => (
                    <tr key={response.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{response.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{response.age}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          response.interest_campaign_2026 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {response.interest_campaign_2026 ? 'Sim' : 'Não'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {response.createdAt?.toDate ? response.createdAt.toDate().toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default App;
