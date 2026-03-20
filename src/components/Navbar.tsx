import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Search, 
  History, 
  Calendar, 
  FileText, 
  Share2, 
  Menu, 
  X,
  ChevronRight,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { Logo } from './Logo';
import { User } from '../firebase';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Início', path: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Investigação', path: '/investigation', icon: <Search className="w-4 h-4" /> },
    { name: 'Histórico', path: '/history', icon: <History className="w-4 h-4" /> },
    { name: 'Calendários', path: '/calendars', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Formulário', path: '/formulario', icon: <FileText className="w-4 h-4" /> },
    ...(user ? [{ name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }] : []),
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MeoVacinas - O Escudo da Humanidade',
          text: 'Explore a ciência por trás da imunização e o perigo da desinformação.',
          url: window.location.origin,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <Logo size={32} className="group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-serif text-xl font-bold tracking-tight hidden sm:block">
            Meo<span className="text-vax-blue italic">Vacinas</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                location.pathname === item.path
                  ? 'bg-white text-vax-blue shadow-sm'
                  : 'text-slate-600 hover:text-vax-blue hover:bg-white/50'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-vax-blue text-white rounded-full text-sm font-medium hover:bg-vax-blue/90 transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar Ciência
          </button>

          {user && (
            <button
              onClick={onLogout}
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all text-sm font-medium"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white z-50 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-6 border-bottom flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Logo size={32} />
                  <span className="font-serif text-xl font-bold">MeoVacinas</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">Navegação</p>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                      location.pathname === item.path
                        ? 'bg-vax-blue/10 text-vax-blue font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${
                        location.pathname === item.path ? 'bg-vax-blue text-white' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {item.icon}
                      </div>
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      location.pathname === item.path ? 'translate-x-1' : 'opacity-0'
                    }`} />
                  </Link>
                ))}

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-vax-blue text-white rounded-2xl font-bold shadow-lg shadow-vax-blue/20 active:scale-95 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                    Compartilhar Ciência
                  </button>
                  
                  {user && (
                    <button
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-bold active:scale-95 transition-all mt-4"
                    >
                      <LogOut className="w-5 h-5" />
                      Sair da Conta
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 bg-slate-50 text-center">
                <p className="text-xs text-slate-400 font-mono italic">
                  "A ciência é o único escudo contra o retrocesso."
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
