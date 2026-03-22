import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [interest, setInterest] = useState<boolean | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || interest === null) {
      setErrorMessage('Por favor, preencha todos os campos.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      await addDoc(collection(db, 'responses'), {
        name,
        age: parseInt(age, 10),
        interest_campaign_2026: interest,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setName('');
      setAge('');
      setInterest(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Ocorreu um erro ao enviar sua resposta. Tente novamente mais tarde.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <img 
              src="https://meovacinas.com.br/wp-content/uploads/2023/05/logo-meo-vacinas.png" 
              alt="Meo Vacinas" 
              className="w-10 h-10 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Pesquisa de Vacinação</h1>
          <p className="text-slate-500 mt-2">Sua opinião é muito importante para nós.</p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900">Obrigado!</h2>
              <p className="text-slate-600 mt-2">Sua resposta foi enviada com sucesso.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-6 btn-primary"
              >
                Enviar outra resposta
              </button>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Nome Completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">
                  Idade
                </label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input-field"
                  placeholder="Sua idade"
                  min="0"
                  max="120"
                  required
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">
                  Você tem interesse em participar da campanha de vacinação nos dias 14 e 15 de abril de 2026?
                </p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setInterest(true)}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      interest === true 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-200'
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterest(false)}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      interest === false 
                        ? 'bg-rose-50 border-rose-500 text-rose-700 font-semibold' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-rose-200'
                    }`}
                  >
                    Não
                  </button>
                </div>
              </div>

              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 rounded-lg text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{errorMessage}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Resposta'
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default App;
