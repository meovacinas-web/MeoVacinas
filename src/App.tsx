import React, { useState, useEffect, Component } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useNavigate, 
  useLocation,
  Link
} from 'react-router-dom';
import Formulario from './pages/Formulario';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Microscope, 
  History, 
  Users, 
  ArrowRight, 
  ChevronDown,
  Activity,
  Zap,
  BookOpen,
  Globe,
  Search,
  Database,
  CheckCircle2,
  Dna,
  Stethoscope,
  ArrowLeft,
  Info,
  Clock,
  MapPin,
  Heart,
  Baby,
  Syringe,
  HeartPulse,
  ClipboardCheck,
  FlaskConical,
  ShieldPlus,
  BriefcaseMedical,
  ShieldAlert,
  Accessibility,
  UserRoundPlus,
  UserRound,
  Download,
  Lock,
  LogOut,
  PieChart as PieChartIcon,
  LayoutDashboard,
  Calendar,
  Instagram,
  QrCode
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Logo from './components/Logo';
import { Navbar } from './components/Navbar';
import { 
  db, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  signOut, 
  onAuthStateChanged, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  getDocs, 
  doc, 
  serverTimestamp,
  handleFirestoreError,
  OperationType,
  User
} from './firebase';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

// Error Boundary Component
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.props = props;
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Ocorreu um erro inesperado.";
      try {
        const parsedError = JSON.parse(this.state.error.message);
        if (parsedError.error) {
          errorMessage = `Erro no Firestore: ${parsedError.error} (${parsedError.operationType} em ${parsedError.path})`;
        }
      } catch (e) {
        errorMessage = this.state.error.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <div className="glass-card p-8 rounded-[32px] max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif mb-4">Ops! Algo deu errado</h2>
            <p className="text-slate-600 mb-8 text-sm">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-vax-blue text-white rounded-xl font-bold hover:bg-vax-blue/90 transition-all"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Types
// ViewState is now handled by React Router

// Mock data for historical impact
const vaccinationData = [
  { year: '1950', cases: 100, vaxRate: 5 },
  { year: '1960', cases: 85, vaxRate: 15 },
  { year: '1970', cases: 40, vaxRate: 45 },
  { year: '1980', cases: 15, vaxRate: 75 },
  { year: '1990', cases: 5, vaxRate: 90 },
  { year: '2000', cases: 1, vaxRate: 95 },
  { year: '2010', cases: 0.5, vaxRate: 98 },
  { year: '2020', cases: 2, vaxRate: 92 },
];

const diseaseEradicationData = [
  { name: 'Varíola', reduction: 100, year: 1980 },
  { name: 'Pólio', reduction: 99.9, year: 2021 },
  { name: 'Sarampo', reduction: 95, year: 2015 },
  { name: 'Rubéola', reduction: 97, year: 2018 },
  { name: 'Tétano', reduction: 92, year: 2020 },
];

const InstagramQRCode = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 bg-white p-6 rounded-[32px] shadow-2xl border border-vax-blue/20 w-64"
          >
            {/* Vaccine Theme Animations */}
            <div className="absolute -top-4 -left-4">
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-vax-blue/10 p-2 rounded-full text-vax-blue shadow-sm"
              >
                <Syringe className="w-6 h-6" />
              </motion.div>
            </div>
            <div className="absolute -bottom-4 -right-4">
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="bg-vax-green/10 p-2 rounded-full text-vax-green shadow-sm"
              >
                <ShieldCheck className="w-6 h-6" />
              </motion.div>
            </div>

            <div className="text-center mb-4">
              <h4 className="font-serif text-lg font-bold text-slate-900">Siga-nos!</h4>
              <p className="text-xs text-slate-500">Siga, compartilhe e leve saúde ao mundo!</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex justify-center border border-slate-100">
              <QRCodeSVG 
                value="https://www.instagram.com/meovacinas/" 
                size={160}
                fgColor="#0f172a"
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-vax-blue font-bold text-sm hover:scale-105 transition-transform">
              <Instagram className="w-4 h-4" /> @meovacinas
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-20 right-0 flex flex-col items-center gap-2 pointer-events-none"
          >
            <motion.span 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-[10px] font-mono font-bold text-vax-blue uppercase tracking-widest whitespace-nowrap bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-vax-blue/10 shadow-sm"
            >
              Siga-nos
            </motion.span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-vax-blue"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-vax-blue text-white rounded-full shadow-lg shadow-vax-blue/30 flex items-center justify-center relative overflow-hidden group"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          className="z-10"
        >
          {isOpen ? <ArrowLeft className="w-6 h-6" /> : <QrCode className="w-6 h-6" />}
        </motion.div>
        
        {/* Animated background pulse */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-white/20 rounded-full"
        />
      </motion.button>
    </div>
  );
};

const calendarsData = [
  {
    id: 'crianca',
    title: 'Calendário da Criança',
    age: '0 a 9 anos',
    description: 'A base da proteção para toda a vida. Cobre desde o nascimento até os 9 anos, incluindo vacinas essenciais como BCG, Penta, Pólio e Sarampo.',
    icon: Baby,
    color: 'bg-sky-50 text-sky-500',
    pdfUrl: 'https://www.gov.br/saude/pt-br/composicao/svsa/pni/calendario-tecnico/calendario-tecnico-nacional-de-vacinacao-crianca/view'
  },
  {
    id: 'adolescente',
    title: 'Adolescente e Jovem',
    age: '10 a 24 anos',
    description: 'Fase crucial para reforços e proteção contra o HPV e Meningites, garantindo uma transição saudável para a vida adulta.',
    icon: Syringe,
    color: 'bg-sky-50 text-sky-500',
    pdfUrl: 'https://www.gov.br/saude/pt-br/composicao/svsa/pni/calendario-tecnico/calendario-tecnico-nacional-de-vacinacao-adolescentes-jovens/view'
  },
  {
    id: 'adulto',
    title: 'Calendário do Adulto',
    age: '25 a 59 anos',
    description: 'Manutenção da imunidade contra Tétano, Hepatite B e Febre Amarela. Essencial para a saúde do trabalhador e proteção coletiva.',
    icon: UserRound,
    color: 'bg-sky-50 text-sky-500',
    pdfUrl: 'https://www.gov.br/saude/pt-br/composicao/svsa/pni/calendario-tecnico/calendario-tecnico-nacional-de-vacinacao-adulto/view'
  },
  {
    id: 'idoso',
    title: 'Calendário do Idoso',
    age: '60 anos ou mais',
    description: 'Foco na prevenção de complicações respiratórias e reforço da imunidade, promovendo um envelhecimento ativo e saudável.',
    icon: Accessibility,
    color: 'bg-sky-50 text-sky-500',
    pdfUrl: 'https://www.gov.br/saude/pt-br/composicao/svsa/pni/calendario-tecnico/calendario-tecnico-nacional-de-vacinacao-idoso/view'
  },
  {
    id: 'gestante',
    title: 'Calendário da Gestante',
    age: 'Pré-natal',
    description: 'Proteção em dobro: garante a saúde da mãe e transfere anticorpos vitais para o bebê ainda no útero.',
    icon: UserRoundPlus,
    color: 'bg-sky-50 text-sky-500',
    pdfUrl: 'https://www.gov.br/saude/pt-br/composicao/svsa/pni/calendario-tecnico/calendario-tecnico-nacional-de-vacinacao-gestante/view'
  }
];

const CountdownTimer = () => {
  const targetDate = new Date('2026-04-14T19:30:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center justify-center p-4 md:p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-vax-blue/10 w-[90px] h-[90px] md:w-[110px] md:h-[110px] shadow-sm transition-transform hover:scale-105 duration-300">
      <span className="text-3xl md:text-4xl font-serif font-bold text-vax-blue leading-none">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-slate-500 mt-2">
        {label}
      </span>
    </div>
  );

  return (
    <section className="py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto glass-card p-8 md:p-12 rounded-[40px] border-vax-blue/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Clock className="w-48 h-48 text-vax-blue" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="text-center lg:text-left max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-vax-blue/10 text-vax-blue rounded-full text-xs font-mono font-bold mb-4">
              <Zap className="w-3 h-3" /> PRÓXIMA CAMPANHA
            </div>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Inscrições Abertas</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Prepare-se para a campanha de vacinação no <span className="font-bold text-slate-900">Centro Educacional da Fundação de Barretos (Unifeb)</span>.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-slate-500 justify-center lg:justify-start">
                <MapPin className="w-4 h-4 text-vax-blue" />
                <span>Unifeb, Barretos - SP</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 justify-center lg:justify-start">
                <Calendar className="w-4 h-4 text-vax-blue" />
                <span>14 e 15 de Abril, 2026</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            <TimeUnit value={timeLeft.days} label="Dias" />
            <TimeUnit value={timeLeft.hours} label="Horas" />
            <TimeUnit value={timeLeft.minutes} label="Minutos" />
            <TimeUnit value={timeLeft.seconds} label="Segundos" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const FloatingVaccine = ({ delay = 0, size = 30, opacity = 0.1, duration = 30 }: { delay?: number, size?: number, opacity?: number, duration?: number }) => {
  const [startPos] = useState(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100
  }));

  return (
    <motion.div
      initial={{ 
        left: `${startPos.x}%`, 
        top: `${startPos.y}%`,
        rotate: 0,
        opacity: 0
      }}
      animate={{ 
        left: [`${startPos.x}%`, `${(startPos.x + 15) % 100}%`, `${(startPos.x - 15 + 100) % 100}%`, `${startPos.x}%`],
        top: [`${startPos.y}%`, `${(startPos.y - 15 + 100) % 100}%`, `${(startPos.y + 15) % 100}%`, `${startPos.y}%`],
        rotate: [0, 90, 180, 270, 360],
        opacity: [0, opacity, opacity, 0]
      }}
      transition={{ 
        duration: duration, 
        repeat: Infinity, 
        delay: delay,
        ease: "easeInOut"
      }}
      className="absolute pointer-events-none z-0"
      style={{ width: size, height: size }}
    >
      <Syringe className="w-full h-full text-vax-blue/40" />
    </motion.div>
  );
};

const VaccineWalker = ({ color = "text-vax-blue", delay = 0, speed = 25, top = "40%" }: { color?: string, delay?: number, speed?: number, top?: string }) => (
  <motion.div
    initial={{ left: "-15%", top: top, rotate: 0, opacity: 0 }}
    animate={{ 
      left: ["-15%", "115%"],
      top: [top, "45%", "35%", "50%", top],
      rotate: [0, 10, -10, 10, 0],
      opacity: [0, 0.15, 0.15, 0]
    }}
    transition={{ 
      duration: speed, 
      repeat: Infinity, 
      delay: delay,
      ease: "linear"
    }}
    className="absolute z-0 pointer-events-none"
  >
    <motion.div 
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="relative"
    >
      <Syringe className={`w-12 h-12 ${color} opacity-40`} />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 ${color.replace('text-', 'bg-')} rounded-full blur-sm`}
      />
    </motion.div>
  </motion.div>
);

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
  <div className="mb-12">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4 text-slate-900"
    >
      {children}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="font-mono text-sm uppercase tracking-widest text-slate-500"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

// SurveyForm is now in src/pages/Formulario.jsx
const LoginPage = ({ onLogin, onBack }: { onLogin: () => void, onBack: () => void, key?: string }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        onLogin();
      }
    });
    return () => unsubscribe();
  }, [onLogin]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err: any) {
      console.error('Erro no login:', err);
      if (err.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        setError(`Domínio "${currentDomain}" não autorizado. Vá ao Console do Firebase > Autenticação > Configurações > Domínios Autorizados e adicione: "${currentDomain}" e "meovacinas-web.github.io".`);
      } else {
        setError('Erro ao entrar com Google. Verifique se os popups estão permitidos ou se o domínio está autorizado no Firebase.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="pt-32 pb-24 px-6 max-w-md mx-auto"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-vax-blue font-bold mb-8 hover:gap-3 transition-all"
      >
        <ArrowLeft className="w-5 h-5" /> Voltar
      </button>

      <div className="glass-card p-8 rounded-[32px] shadow-2xl border border-white/20">
        <div className="w-16 h-16 bg-vax-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-vax-blue" />
        </div>
        <h2 className="text-2xl font-serif text-center mb-2">Acesso Restrito</h2>
        <p className="text-slate-500 text-center text-sm mb-8">Área exclusiva para alunos do projeto</p>

        <div className="space-y-6">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-6 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-3 text-lg"
          >
            <Globe className="w-6 h-6 text-vax-blue" />
            {isLoading ? 'Conectando...' : 'Entrar no Painel Admin'}
          </button>

          {error && <p className="text-xs text-red-500 text-center mt-4">{error}</p>}
          
          <p className="text-[10px] text-slate-400 text-center mt-6 leading-relaxed">
            Nota: Este é um acesso seguro via Firebase. 
            O seu e-mail do Google deve estar autorizado no console do projeto para visualizar os dados.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const DashboardPage = ({ onLogout, user }: { onLogout: () => void, user: User | null, key?: string }) => {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Iniciando monitoramento em tempo real...');
    
    // Check if user is authenticated via Firebase
    if (!user) {
      console.warn('Usuário não autenticado no Firebase. O monitoramento não será iniciado.');
      setIsLoading(false);
      setPermissionError('Você não está autenticado no Firebase. Por favor, saia e entre usando o botão "Entrar com Google" para ver os dados reais.');
      return;
    }

    const q = query(collection(db, 'surveys'), orderBy('created_at', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`${data.length} pesquisas carregadas em tempo real.`);
      setSurveys(data);
      setIsConnected(true);
      setIsLoading(false);
      setPermissionError(null);
    }, (error) => {
      console.error('Erro no monitoramento em tempo real:', error);
      setIsConnected(false);
      setIsLoading(false);
      
      if (error.code === 'permission-denied') {
        setPermissionError('Acesso negado. Sua conta não tem permissão de administrador para visualizar estes dados. Certifique-se de estar usando um e-mail autorizado (como meovacinas@gmail.com ou admin@meovacinas.com.br).');
      } else {
        handleFirestoreError(error, OperationType.LIST, 'surveys');
      }
    });

    return () => unsubscribe();
  }, [user]);

  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);

  const handleReset = async () => {
    if (resetPassword === '021601') {
      setIsResetting(true);
      setResetError(null);
      try {
        const snapshot = await getDocs(collection(db, 'surveys'));
        const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'surveys', d.id)));
        await Promise.all(deletePromises);
        setShowResetModal(false);
        setResetPassword('');
      } catch (err) {
        console.error(err);
        handleFirestoreError(err, OperationType.DELETE, 'surveys');
        setResetError('Erro ao resetar dados.');
      } finally {
        setIsResetting(false);
      }
    } else {
      setResetError('Senha incorreta.');
    }
  };

  const getChartDataForField = (field: string) => {
    const counts = surveys.reduce((acc: any, curr) => {
      const val = curr[field] || 'Não informado';
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({
      name: String(name),
      value: Number(value)
    }));
  };

  const getTopValues = (field: string, limit = 5) => {
    const counts = surveys.reduce((acc: any, curr) => {
      const val = curr[field];
      if (val && val.trim() !== '' && val !== 'null' && val !== 'undefined') {
        acc[val] = (acc[val] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, value]) => ({ name: String(name), value: Number(value) }))
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, limit);
  };

  const additionalFields = [
    { key: 'importance', label: 'Importância das Vacinas', icon: <Activity className="w-5 h-5 text-vax-blue" />, type: 'bar' },
    { key: 'updated', label: 'Carteira Atualizada', icon: <ClipboardCheck className="w-5 h-5 text-vax-green" />, type: 'pie' },
    { key: 'covid', label: 'Vacinou COVID-19', icon: <Syringe className="w-5 h-5 text-vax-blue" />, type: 'pie' },
    { key: 'doses', label: 'Doses COVID-19', icon: <Zap className="w-5 h-5 text-amber-500" />, type: 'bar' },
    { key: 'last_5_years', label: 'Vacinas (5 anos)', icon: <History className="w-5 h-5 text-indigo-500" />, type: 'bar' },
    { key: 'trust', label: 'Confiança', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, type: 'pie' },
    { key: 'influence', label: 'Influência Redes Sociais', icon: <Globe className="w-5 h-5 text-blue-500" />, type: 'bar' },
    { key: 'skipped', label: 'Deixou de tomar', icon: <AlertTriangle className="w-5 h-5 text-red-500" />, type: 'pie' },
    { key: 'campaigns', label: 'Eficácia Campanhas', icon: <Users className="w-5 h-5 text-purple-500" />, type: 'pie' },
    { key: 'interest_campaign_2026', label: 'Interesse Campanha 2026', icon: <Calendar className="w-5 h-5 text-pink-500" />, type: 'pie' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const resetData = async () => {
    const password = prompt('Digite a senha de administrador para resetar os dados:');
    
    if (password === '021601') {
      if (confirm('Tem certeza que deseja apagar todas as respostas? Esta ação não pode ser desfeita.')) {
        setIsResetting(true);
        try {
          const snapshot = await getDocs(collection(db, 'surveys'));
          const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'surveys', d.id)));
          await Promise.all(deletePromises);
          
          alert('Dados resetados com sucesso!');
        } catch (err) {
          console.error(err);
          handleFirestoreError(err, OperationType.DELETE, 'surveys');
          alert('Erro ao resetar dados.');
        } finally {
          setIsResetting(false);
        }
      }
    } else if (password !== null) {
      alert('Senha incorreta. Ação cancelada.');
    }
  };

  const downloadData = () => {
    const headers = "ID,Idade,Opinião Vacina,Importancia,Carteira,COVID,Doses,Ultimos 5 Anos,Confiança,Influencia,Deixou de Tomar,Motivo,Opiniao,Campanhas,Interesse 2026\n";
    const csvContent = surveys.map(r => 
      `${r.id},"${r.age}","${r.vaccineOpinion}","${r.importance}","${r.updated}","${r.covid}","${r.doses}","${r.last_5_years}","${r.trust}","${r.influence}","${r.skipped}","${r.skipped_reason || ''}","${r.why_not_vax || ''}","${r.campaigns}","${r.interest_campaign_2026 || ''}"`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "resultados_pesquisa_vacinacao.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate chart data
  const favorCounts = surveys.reduce((acc: any, curr) => {
    const val = curr.vaccineOpinion || 'Não informado';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  const favorChartData = [
    { name: 'Sim', value: favorCounts['Sim'] || 0, color: '#10b981' },
    { name: 'Não', value: favorCounts['Não'] || 0, color: '#ef4444' },
    { name: 'Em parte', value: favorCounts['Em parte'] || 0, color: '#f59e0b' },
  ];

  const ageGroups = [
    { name: 'Menos de 18', key: 'Menos de 18 anos' },
    { name: '18-25', key: '18 a 25 anos' },
    { name: '26-35', key: '26 a 35 anos' },
    { name: '36-45', key: '36 a 45 anos' },
    { name: '46-60', key: '46 a 60 anos' },
    { name: '60+', key: 'Mais de 60 anos' },
  ];

  const ageChartData = ageGroups.map(group => ({
    name: group.name,
    value: surveys.filter(s => s.age === group.key).length
  }));

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 px-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-vax-blue/20 border-t-vax-blue rounded-full animate-spin mb-6"></div>
        <p className="text-slate-500 font-mono text-sm animate-pulse">Conectando ao banco de dados em tempo real...</p>
      </div>
    );
  }

  if (permissionError) {
    return (
      <div className="pt-32 pb-24 px-6 flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-8">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-serif mb-4">Acesso Restrito</h2>
        <p className="text-slate-600 mb-10 leading-relaxed">
          {permissionError}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button 
            onClick={onLogout}
            className="px-8 py-4 bg-vax-blue text-white rounded-2xl font-bold hover:bg-vax-blue/90 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" /> Sair e Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-24 px-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-6 h-6 text-vax-blue" />
            <h1 className="text-3xl font-serif">Painel do Projeto</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-vax-green animate-pulse' : 'bg-red-500'}`} />
            <p className="text-slate-500 text-sm">{isConnected ? 'Monitoramento em tempo real ativo' : 'Desconectado do servidor'}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setShowResetModal(true)}
            disabled={isResetting}
            className={`flex items-center gap-2 px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold transition-all shadow-sm ${isResetting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 hover:scale-[1.02] active:scale-[0.95]'}`}
          >
            <ShieldAlert className={`w-5 h-5 ${isResetting ? 'animate-spin' : ''}`} /> 
            Resetar Dados
          </button>
          <button 
            onClick={downloadData}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.95] transition-all shadow-sm"
          >
            <Download className="w-5 h-5" /> Baixar Dados (CSV)
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 hover:scale-[1.02] active:scale-[0.95] transition-all"
          >
            <LogOut className="w-5 h-5" /> Sair
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 glass-card p-8 rounded-[32px] shadow-xl min-w-0">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <Activity className="w-5 h-5 text-vax-blue" /> Distribuição de Idade
          </h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
              <BarChart data={ageChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[32px] shadow-xl min-w-0">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-vax-green" /> Opinião sobre Vacinas
          </h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
              <PieChart>
                <Pie
                  data={favorChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {favorChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-serif mb-8">Análise Detalhada</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {additionalFields.map((field) => {
            const data = getChartDataForField(field.key);
            return (
              <div key={field.key} className="glass-card p-6 rounded-[24px] shadow-lg border border-white/10">
                <h4 className="text-sm font-bold mb-6 flex items-center gap-2 text-slate-700">
                  {field.icon} {field.label}
                </h4>
                <div className="h-[200px] relative">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                    {field.type === 'bar' ? (
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} />
                        <YAxis axisLine={false} tickLine={false} fontSize={10} />
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', fontSize: '12px'}} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', fontSize: '12px'}} />
                        <Legend iconSize={8} wrapperStyle={{fontSize: '10px'}} />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
          
          {/* Top Reasons / Opinions */}
          <div className="glass-card p-6 rounded-[24px] shadow-lg border border-white/10">
            <h4 className="text-sm font-bold mb-6 flex items-center gap-2 text-slate-700">
              <BookOpen className="w-5 h-5 text-orange-500" /> Motivos de Recusa (Top 5)
            </h4>
            <div className="space-y-3">
              {getTopValues('skipped_reason').map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 truncate mr-2" title={item.name}>{item.name}</span>
                  <span className="font-bold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{item.value}</span>
                </div>
              ))}
              {getTopValues('skipped_reason').length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-4">Nenhum dado registrado</p>
              )}
            </div>
          </div>

          <div className="glass-card p-6 rounded-[24px] shadow-lg border border-white/10">
            <h4 className="text-sm font-bold mb-6 flex items-center gap-2 text-slate-700">
              <Info className="w-5 h-5 text-blue-500" /> Por que não vacinar? (Top 5)
            </h4>
            <div className="space-y-3">
              {getTopValues('why_not_vax').map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 truncate mr-2" title={item.name}>{item.name}</span>
                  <span className="font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{item.value}</span>
                </div>
              ))}
              {getTopValues('why_not_vax').length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-4">Nenhum dado registrado</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-8 rounded-[32px] shadow-2xl max-w-md w-full"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif mb-2">Resetar Banco de Dados</h3>
              <p className="text-slate-500 text-sm mb-6">Esta ação apagará permanentemente todas as respostas da pesquisa. Digite a senha de administrador para confirmar.</p>
              
              <div className="space-y-4">
                <input 
                  type="password" 
                  placeholder="Senha de Administrador"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                />
                
                {resetError && (
                  <p className="text-red-500 text-xs font-bold">{resetError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setShowResetModal(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleReset}
                    disabled={isResetting || !resetPassword}
                    className="flex-1 py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                  >
                    {isResetting ? 'Resetando...' : 'Confirmar'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="glass-card rounded-[32px] shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold">Respostas Recentes</h3>
          <span className="px-3 py-1 bg-vax-blue/10 text-vax-blue text-xs font-bold rounded-full">
            {surveys.length} Respostas
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-8 py-4 font-bold">ID</th>
                <th className="px-8 py-4 font-bold">Idade</th>
                <th className="px-8 py-4 font-bold">A Favor?</th>
                <th className="px-8 py-4 font-bold">COVID-19</th>
                <th className="px-8 py-4 font-bold">Doses</th>
                <th className="px-8 py-4 font-bold">Confiança</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {surveys.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4 text-sm font-mono text-slate-400">#{row.id}</td>
                  <td className="px-8 py-4 text-sm font-medium">{row.age || '-'}</td>
                  <td className="px-8 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      row.vaccineOpinion === 'Sim' ? 'bg-green-100 text-green-700' : 
                      row.vaccineOpinion === 'Não' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {row.vaccineOpinion || 'N/A'}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm">{row.covid || '-'}</td>
                  <td className="px-8 py-4 text-sm text-slate-500">{row.doses || '-'}</td>
                  <td className="px-8 py-4 text-sm font-medium">{row.trust || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const CalendarsPage = ({ onBack }: { onBack: () => void, key?: string }) => {
  const handleDownload = (title: string, url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
    console.log(`Iniciando download do ${title}...`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="min-h-screen pt-24 pb-24 px-6 max-w-7xl mx-auto"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-vax-blue font-mono mb-12 hover:translate-x-1 transition-transform">
        <ArrowLeft className="w-4 h-4" /> VOLTAR AO LABORATÓRIO
      </button>

      <SectionTitle subtitle="Ciclos de Vida">Calendários Nacionais de Vacinação</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {calendarsData.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 md:p-8 rounded-[32px] flex flex-col h-full hover:border-vax-blue/30 transition-all group"
          >
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <item.icon className="w-7 h-7" />
            </div>
            <div className="mb-4">
              <span className="text-xs font-mono font-bold text-vax-blue uppercase tracking-wider">{item.age}</span>
              <h3 className="text-2xl font-serif mt-1">{item.title}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
              {item.description}
            </p>
            <button 
              onClick={() => handleDownload(item.title, item.pdfUrl)}
              className="w-full py-4 bg-vax-blue text-white rounded-2xl font-medium hover:bg-vax-blue/90 transition-all flex items-center justify-center gap-2"
            >
              <Database className="w-4 h-4" /> Baixar PDF Oficial
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 p-8 md:p-12 rounded-[40px] bg-vax-blue/5 border border-vax-blue/10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1">
          <h3 className="text-3xl font-serif mb-4">Compromisso com a Vida</h3>
          <p className="text-slate-600 leading-relaxed">
            Os calendários são atualizados anualmente pelo Ministério da Saúde para garantir que a população brasileira tenha acesso às tecnologias mais recentes em imunização. Manter sua caderneta em dia é um ato de respeito por si mesmo e por toda a comunidade.
          </p>
        </div>
        <div className="w-full md:w-auto">
          <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-vax-green/10 rounded-full flex items-center justify-center text-vax-green">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold">Dados Atualizados</p>
              <p className="text-xs text-slate-500">Ciclo de Vida 2026</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- SUB-PAGES ---

const InvestigationPage = ({ onBack }: { onBack: () => void, key?: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    className="min-h-screen pt-24 pb-24 px-6 max-w-7xl mx-auto"
  >
    <button onClick={onBack} className="flex items-center gap-2 text-vax-blue font-mono mb-12 hover:translate-x-1 transition-transform">
      <ArrowLeft className="w-4 h-4" /> VOLTAR AO LABORATÓRIO
    </button>

    <SectionTitle subtitle="Dossiê Científico">O Rigor da Biomedicina</SectionTitle>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
      <div className="space-y-8">
        <h3 className="text-3xl font-serif">O Ciclo de Desenvolvimento</h3>
        <p className="text-slate-600 leading-relaxed">
          Diferente do que a desinformação prega, nenhuma vacina é aprovada sem testes exaustivos. O processo biomédico é um dos mais rigorosos da ciência moderna.
        </p>
        
        <div className="space-y-6">
          {[
            { phase: "Fase Pré-Clínica", desc: "Testes in vitro e em modelos animais para avaliar segurança e resposta imunológica inicial.", icon: Microscope },
            { phase: "Fase 1: Segurança", desc: "Pequeno grupo de voluntários saudáveis (20-80) para testar dosagem e segurança básica.", icon: HeartPulse },
            { phase: "Fase 2: Imunogenicidade", desc: "Centenas de voluntários para avaliar a capacidade de gerar anticorpos e efeitos colaterais comuns.", icon: FlaskConical },
            { phase: "Fase 3: Eficácia", desc: "Milhares de voluntários em diversos países para comprovar a proteção real contra a doença.", icon: ClipboardCheck },
            { phase: "Fase 4: Farmacovigilância", desc: "Monitoramento contínuo após a aprovação para detectar eventos raríssimos em milhões de pessoas.", icon: Stethoscope }
          ].map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-vax-blue/10 flex items-center justify-center text-vax-blue shrink-0">
                <step.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{step.phase}</h4>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="sticky top-32 glass-card p-6 md:p-8 rounded-[40px] border-vax-blue/20">
          <div className="flex items-center gap-3 mb-6">
            <Dna className="w-8 h-8 text-vax-blue" />
            <h3 className="text-2xl font-serif">Tecnologia de Ponta</h3>
          </div>
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-vax-blue/5 border border-vax-blue/10">
              <h4 className="font-bold mb-2">Vacinas de RNA Mensageiro (mRNA)</h4>
              <p className="text-sm text-slate-600">Não alteram seu DNA. Elas fornecem apenas a "receita" para que suas células produzam uma proteína do vírus, ensinando o corpo a se defender.</p>
            </div>
            <div className="p-6 rounded-2xl bg-vax-green/5 border border-vax-green/10">
              <h4 className="font-bold mb-2">Vetor Viral</h4>
              <p className="text-sm text-slate-600">Utiliza um vírus inofensivo (como um adenovírus) para levar a informação genética do patógeno alvo ao sistema imune.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold mb-2">Vírus Inativado</h4>
              <p className="text-sm text-slate-600">Tecnologia clássica que utiliza o vírus "morto" por meios químicos ou físicos, incapaz de causar doença.</p>
            </div>
          </div>
          <div className="mt-8 p-4 bg-vax-red/5 border border-vax-red/10 rounded-xl flex gap-3">
            <Info className="w-5 h-5 text-vax-red shrink-0" />
            <p className="text-xs text-vax-red italic">
              Importante: Nenhuma vacina aprovada pela ANVISA contém microchips, metais pesados tóxicos ou altera a genética humana.
            </p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const HistoryPage = ({ onBack }: { onBack: () => void, key?: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    className="min-h-screen pt-24 pb-24 px-6 max-w-7xl mx-auto"
  >
    <button onClick={onBack} className="flex items-center gap-2 text-vax-blue font-mono mb-12 hover:translate-x-1 transition-transform">
      <ArrowLeft className="w-4 h-4" /> VOLTAR AO LABORATÓRIO
    </button>

    <SectionTitle subtitle="Arquivo Histórico">O Impacto em Números</SectionTitle>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
      <div className="h-[400px] md:h-[500px] glass-card p-6 md:p-8 rounded-[40px] relative">
        <h3 className="text-2xl font-serif mb-8 flex items-center gap-3">
          <Database className="w-6 h-6 text-vax-blue" /> Redução de Doenças (%)
        </h3>
        <ResponsiveContainer width="100%" height="80%" minWidth={0} debounce={100}>
          <BarChart data={diseaseEradicationData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
            <Tooltip 
              cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="reduction" radius={[0, 4, 4, 0]}>
              {diseaseEradicationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#0ea5e9' : '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs font-mono text-slate-400 mt-6">
          * Dados comparativos entre o pico histórico e a era pós-vacinação.
        </p>
      </div>

      <div className="space-y-12">
        <div className="relative pl-8 border-l-2 border-slate-200 space-y-12">
          {[
            { year: "1796", event: "Edward Jenner", desc: "Criação da primeira vacina (Varíola) usando o vírus da varíola bovina." },
            { year: "1885", event: "Louis Pasteur", desc: "Desenvolvimento da vacina contra a Raiva, marcando o início da vacinologia moderna." },
            { year: "1955", event: "Jonas Salk", desc: "Aprovação da vacina contra a Pólio, salvando milhões da paralisia infantil." },
            { year: "1980", event: "Erradicação Global", desc: "A OMS declara a Varíola oficialmente erradicada do planeta Terra." },
            { year: "2020", event: "Aceleração Genômica", desc: "Desenvolvimento recorde de vacinas de mRNA contra a COVID-19." }
          ].map((milestone, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-vax-blue border-4 border-vax-paper" />
              <span className="text-vax-blue font-mono font-bold">{milestone.year}</span>
              <h4 className="text-xl font-serif mt-1">{milestone.event}</h4>
              <p className="text-slate-500 text-sm mt-2">{milestone.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-vax-blue/5 border border-vax-blue/10 text-slate-900 p-8 md:p-12 rounded-[40px] text-center">
      <h3 className="text-3xl font-serif mb-6">A Ciência não para</h3>
      <p className="text-slate-600 max-w-2xl mx-auto mb-8">
        Hoje, a biomedicina trabalha em vacinas contra o Câncer, HIV e Malária, utilizando o conhecimento acumulado por séculos de pesquisa e dedicação.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <div className="px-6 py-3 bg-vax-blue/10 text-vax-blue rounded-full text-sm font-mono">20+ Doenças Evitáveis</div>
        <div className="px-6 py-3 bg-vax-blue/10 text-vax-blue rounded-full text-sm font-mono">3 Bilhões de Vidas Salvas</div>
      </div>
    </div>
  </motion.div>
);

// --- MAIN APP ---

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthChecking(false);
      // If user is logged in and on login page, move to dashboard
      if (u && location.pathname === '/login') {
        navigate('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen academic-grid overflow-x-hidden">
        {/* Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-vax-blue z-50 origin-left"
          style={{ scaleX }}
        />

        <InstagramQRCode />
        <Navbar user={user} onLogout={handleLogout} />

        <AnimatePresence mode="wait">
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location}>
              <Route path="/" element={
                <div>
                  {/* Hero Section */}
                  <section className="relative min-h-screen flex flex-col items-center justify-center py-20 px-6 text-center overflow-hidden">
                    {/* Background Vaccines */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                      <VaccineWalker color="text-vax-blue" delay={0} speed={30} top="25%" />
                      <VaccineWalker color="text-vax-green" delay={5} speed={35} top="55%" />
                      <VaccineWalker color="text-vax-red" delay={10} speed={40} top="40%" />
                      
                      <FloatingVaccine delay={0} size={60} opacity={0.15} duration={40} />
                      <FloatingVaccine delay={7} size={40} opacity={0.1} duration={45} />
                      <FloatingVaccine delay={15} size={80} opacity={0.08} duration={50} />
                    </div>

                    {/* Blur Blobs */}
                    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/4 -left-20 w-96 h-96 bg-vax-blue rounded-full blur-3xl"
                      />
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, -5, 0]
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-vax-green rounded-full blur-3xl"
                      />
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="z-20 max-w-4xl flex flex-col items-center"
                    >
                      <Logo size={48} className="mb-8 drop-shadow-xl" />
                      <span className="inline-block px-4 py-1 mb-6 text-xs font-mono font-bold tracking-widest uppercase bg-vax-blue/10 text-vax-blue border border-vax-blue/20 rounded-full">
                        No combate a desinformação
                      </span>
                      <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl mb-8 leading-tight text-balance">
                        O Escudo da <span className="italic text-vax-blue">Humanidade</span>
                      </h1>
                      <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Explorando a ciência por trás da imunização e o perigo iminente do retrocesso informacional.
                      </p>
                      <div className="flex flex-wrap justify-center gap-6">
                        <button 
                          onClick={() => navigate('/investigation')}
                          className="px-8 py-4 bg-vax-blue text-white rounded-full font-medium hover:bg-vax-blue/90 transition-all shadow-lg shadow-vax-blue/20 flex items-center gap-2 group"
                        >
                          Começar Investigação <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                          onClick={() => navigate('/history')}
                          className="px-8 py-4 border border-slate-200 rounded-full font-medium hover:bg-white transition-all"
                        >
                          Ver Dados Históricos
                        </button>
                      </div>
                    </motion.div>

                    <motion.div 
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400"
                    >
                      <ChevronDown className="w-8 h-8" />
                    </motion.div>
                  </section>

                  {/* Countdown Section */}
                  <CountdownTimer />

                  {/* The Science Section */}
                  <section className="py-24 px-6 max-w-7xl mx-auto">
                    <SectionTitle subtitle="Módulo 01: Imunologia Básica">Como as Vacinas Funcionam</SectionTitle>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        {
                          icon: Microscope,
                          title: "O Reconhecimento",
                          desc: "A vacina apresenta ao corpo uma versão inofensiva do patógeno, permitindo que o sistema imunológico aprenda a identificá-lo sem o risco da doença.",
                          color: "bg-sky-50 text-sky-500"
                        },
                        {
                          icon: Dna,
                          title: "A Resposta",
                          desc: "O corpo produz anticorpos e células de memória. É como um treinamento militar para suas defesas naturais.",
                          color: "bg-sky-50 text-sky-500"
                        },
                        {
                          icon: ShieldPlus,
                          title: "A Proteção",
                          desc: "Se o vírus real tentar invadir, seu corpo já sabe exatamente como lutar, neutralizando a ameaça antes que ela cause danos.",
                          color: "bg-sky-50 text-sky-500"
                        }
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.2 }}
                          className="glass-card p-6 md:p-8 rounded-3xl hover:shadow-2xl transition-all group"
                        >
                          <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <item.icon className="w-8 h-8" />
                          </div>
                          <h3 className="text-2xl font-serif mb-4">{item.title}</h3>
                          <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* Impact Chart Section */}
                  <section className="py-24 bg-white text-slate-900 overflow-hidden relative">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                      <SectionTitle subtitle="Módulo 02: Epidemiologia">O Triunfo da Ciência</SectionTitle>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                            Ao longo do século XX, as vacinas erradicaram a varíola e quase eliminaram a poliomielite. O gráfico ao lado demonstra a correlação direta entre o aumento da taxa de vacinação e a queda drástica de casos.
                          </p>
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-vax-blue/10 flex items-center justify-center text-vax-blue">
                                <History className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-bold">Varíola: Erradicada</h4>
                                <p className="text-slate-500 text-sm">A primeira doença humana a ser eliminada globalmente.</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-vax-green/10 flex items-center justify-center text-vax-green">
                                <Activity className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-bold">Poliomielite: -99%</h4>
                                <p className="text-slate-500 text-sm">Redução massiva de paralisia infantil em todo o mundo.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-[400px] bg-slate-50 p-6 rounded-3xl border border-slate-200 relative">
                          <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                            <AreaChart data={vaccinationData}>
                              <defs>
                                <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorVax" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis dataKey="year" stroke="#64748b" />
                              <YAxis stroke="#64748b" />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                                itemStyle={{ color: '#0f172a' }}
                              />
                              <Area type="monotone" dataKey="cases" stroke="#ef4444" fillOpacity={1} fill="url(#colorCases)" name="Casos (Relativo)" />
                              <Area type="monotone" dataKey="vaxRate" stroke="#10b981" fillOpacity={1} fill="url(#colorVax)" name="Taxa de Vacinação %" />
                            </AreaChart>
                          </ResponsiveContainer>
                          <p className="text-center text-xs font-mono text-slate-400 mt-4">
                            Fonte: Organização Mundial da Saúde (Dados Ilustrativos)
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* The Anti-Vax Regress Section */}
                  <section className="py-24 px-6 max-w-7xl mx-auto">
                    <SectionTitle subtitle="Módulo 03: Sociologia da Saúde">O Perigo do Retrocesso</SectionTitle>
                    
                    <div className="bg-vax-red/5 border border-vax-red/20 rounded-[40px] p-8 md:p-16 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShieldAlert className="w-64 h-64 text-vax-red" />
                      </div>
                      
                      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                          <h3 className="text-4xl font-serif mb-6 text-slate-900">A Desinformação como Patógeno</h3>
                          <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                            O movimento anti-vacina não é apenas uma escolha pessoal; é um ataque à <span className="font-bold">Imunidade de Rebanho</span>. Quando a cobertura vacinal cai abaixo de certos níveis (geralmente 95%), doenças que estavam controladas voltam a surgir.
                          </p>
                          
                          <div className="space-y-4">
                            {[
                              "Retorno do Sarampo em países desenvolvidos.",
                              "Aumento da mortalidade infantil evitável.",
                              "Sobrecarga desnecessária dos sistemas públicos de saúde.",
                              "Ameaça direta a pessoas imunocomprometidas."
                            ].map((text, i) => (
                              <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 text-slate-800"
                              >
                                <div className="w-2 h-2 rounded-full bg-vax-red" />
                                <span>{text}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <span className="text-4xl font-serif text-vax-red block mb-2">95%</span>
                            <span className="text-xs font-mono uppercase tracking-tighter text-slate-500">Mínimo para Imunidade de Rebanho</span>
                          </div>
                          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <span className="text-4xl font-serif text-vax-red block mb-2">2019</span>
                            <span className="text-xs font-mono uppercase tracking-tighter text-slate-500">OMS declara anti-vax como ameaça global</span>
                          </div>
                          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sm:col-span-2">
                            <p className="text-sm italic text-slate-600">
                              "A hesitação vacinal ameaça reverter o progresso feito no combate a doenças evitáveis por vacinação."
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Call to Action */}
                  <section className="py-24 px-6 text-center bg-vax-blue/5">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="max-w-3xl mx-auto"
                    >
                      <Users className="w-16 h-16 text-vax-blue mx-auto mb-8" />
                      <h2 className="font-serif text-5xl mb-6">Proteja o Futuro</h2>
                      <p className="text-xl text-slate-600 mb-12">
                        A vacinação é um pacto social. Ao se vacinar, você protege não apenas a si mesmo, mas também aqueles que não podem ser vacinados por motivos médicos.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button 
                          onClick={() => navigate('/calendars')}
                          className="px-10 py-4 bg-vax-blue text-white rounded-full font-bold hover:bg-vax-blue/90 transition-all shadow-lg shadow-vax-blue/20"
                        >
                          Calendários de Vacinação
                        </button>
                        <button 
                          onClick={() => navigate('/pesquisa')}
                          className="px-10 py-4 bg-white border border-vax-blue text-vax-blue rounded-full font-bold hover:bg-vax-blue/5 transition-all shadow-lg shadow-vax-blue/5"
                        >
                          Responder Formulário
                        </button>
                        <button 
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: 'Vacina & Saúde Pública',
                                text: 'Confira este projeto sobre a importância da vacinação!',
                                url: window.location.href,
                              });
                            } else {
                              alert('Link copiado para a área de transferência!');
                              navigator.clipboard.writeText(window.location.href);
                            }
                          }}
                          className="px-10 py-4 bg-white border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-all"
                        >
                          Compartilhar Ciência
                        </button>
                      </div>
                    </motion.div>
                  </section>
                </div>
              } />
              <Route path="/pesquisa" element={<Formulario />} />
              <Route path="/formulario" element={<Formulario />} />
              <Route path="/investigation" element={<InvestigationPage onBack={() => navigate('/')} />} />
              <Route path="/history" element={<HistoryPage onBack={() => navigate('/')} />} />
              <Route path="/calendars" element={<CalendarsPage onBack={() => navigate('/')} />} />
              <Route path="/login" element={<LoginPage onLogin={() => navigate('/dashboard')} onBack={() => navigate('/')} />} />
              <Route path="/dashboard" element={<DashboardPage onLogout={handleLogout} user={user} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="pt-20 pb-10 px-6 border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                <Logo size={32} className="mb-6" />
                <p className="text-slate-500 max-w-sm leading-relaxed">
                  Uma iniciativa dedicada a combater a desinformação através da ciência, 
                  promovendo a saúde pública e a conscientização sobre a importância vital da vacinação.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-900 mb-6 font-mono text-xs uppercase tracking-widest">Navegação</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><button onClick={() => navigate('/')} className="hover:text-vax-blue transition-colors">Início</button></li>
                  <li><button onClick={() => navigate('/investigation')} className="hover:text-vax-blue transition-colors">Investigação Científica</button></li>
                  <li><button onClick={() => navigate('/history')} className="hover:text-vax-blue transition-colors">Dados Históricos</button></li>
                  <li><button onClick={() => navigate('/calendars')} className="hover:text-vax-blue transition-colors">Calendários Oficiais</button></li>
                  <li><button onClick={() => navigate('/pesquisa')} className="hover:text-vax-blue transition-colors">Pesquisa de Opinião</button></li>
                  <li><button onClick={() => navigate('/login')} className="px-4 py-2 bg-vax-blue text-white rounded-lg text-xs font-bold hover:bg-vax-blue/90 transition-all mt-4">Acesso Alunos</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-6 font-mono text-xs uppercase tracking-widest">Recursos</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><a href="https://www.gov.br/saude/pt-br" target="_blank" rel="noopener noreferrer" className="hover:text-vax-blue transition-colors">Ministério da Saúde</a></li>
                  <li><a href="https://www.who.int" target="_blank" rel="noopener noreferrer" className="hover:text-vax-blue transition-colors">OMS</a></li>
                  <li><a href="https://www.paho.org/pt/brasil" target="_blank" rel="noopener noreferrer" className="hover:text-vax-blue transition-colors">OPAS</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-vax-green animate-pulse" />
                @2026 Feito por pessoas que amam a ciência
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
