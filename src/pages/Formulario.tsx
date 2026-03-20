import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { 
  db, 
  collection, 
  addDoc, 
  serverTimestamp,
  handleFirestoreError,
  OperationType
} from '../firebase';

const SectionTitle = ({ children, subtitle, dark = false }: { children: React.ReactNode, subtitle?: string, dark?: boolean }) => (
  <div className="mb-12">
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`font-mono text-xs uppercase tracking-[0.3em] mb-4 ${dark ? 'text-vax-blue/60' : 'text-vax-blue'}`}
      >
        {subtitle}
      </motion.p>
    )}
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}
    >
      {children}
    </motion.h2>
  </div>
);

const SurveyForm = ({ onComplete }: { onComplete: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({
    age: '',
    vaccineOpinion: '',
    importance: '',
    updated: '',
    covid: '',
    covid_doses: '',
    last_5_years: '',
    trust: '',
    influence: '',
    influence_other: '',
    skipped: '',
    skipped_reason: '',
    why_not_vax: '',
    campaigns: '',
    interest_campaign_2026: ''
  });

  const [covidVax, setCovidVax] = useState<string>('');
  const [skippedVax, setSkippedVax] = useState<string>('');
  const [influence, setInfluence] = useState<string>('');

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Basic validation
      const requiredFields = ['age', 'vaccineOpinion', 'importance', 'updated', 'covid', 'last_5_years', 'trust', 'influence', 'skipped', 'campaigns', 'interest_campaign_2026'];
      const missingFields = requiredFields.filter(f => !formData[f]);
      
      if (missingFields.length > 0) {
        setError('Por favor, responda todas as perguntas obrigatórias antes de enviar.');
        setIsSubmitting(false);
        return;
      }

      const surveyData = {
        age: formData.age,
        vaccineOpinion: formData.vaccineOpinion,
        importance: formData.importance,
        updated: formData.updated,
        covid: formData.covid,
        doses: formData.covid === 'Sim' ? formData.covid_doses : '-',
        last_5_years: formData.last_5_years,
        trust: formData.trust,
        influence: formData.influence === 'Outros' ? formData.influence_other : formData.influence,
        skipped: formData.skipped,
        skipped_reason: formData.skipped_reason || '',
        why_not_vax: formData.why_not_vax || '',
        campaigns: formData.campaigns,
        interest_campaign_2026: formData.interest_campaign_2026,
        created_at: serverTimestamp()
      };

      // Clean up undefined values
      const cleanData = Object.fromEntries(
        Object.entries(surveyData).filter(([_, v]) => v !== undefined)
      );

      console.log('Enviando dados da pesquisa:', cleanData);
      await addDoc(collection(db, 'surveys'), cleanData);
      
      setSubmitted(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch (err) {
      console.error('Erro ao enviar pesquisa:', err);
      handleFirestoreError(err, OperationType.CREATE, 'surveys');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 bg-vax-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-vax-green" />
        </div>
        <h3 className="text-3xl font-serif mb-4">Obrigado!</h3>
        <p className="text-slate-600">Suas respostas anônimas foram enviadas com sucesso e ajudarão em nossa pesquisa científica.</p>
        <p className="text-slate-400 text-sm mt-8 italic">Redirecionando para o início...</p>
      </motion.div>
    );
  }

  const RadioGroup = ({ name, options, label, onChange }: { name: string, options: string[], label: string, onChange?: (val: string) => void }) => (
    <div className="space-y-3">
      <label className="text-base font-bold text-slate-800 block">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => (
          <label key={option} className="cursor-pointer group block">
            <input 
              type="radio" 
              name={name} 
              value={option}
              checked={formData[name] === option}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((prev: any) => ({ ...prev, [name]: val }));
                onChange?.(val);
              }}
              className="sr-only peer" 
            />
            <div className="px-4 py-3 rounded-xl border border-slate-200 text-center peer-checked:bg-vax-blue peer-checked:text-white peer-checked:border-vax-blue peer-checked:shadow-lg peer-checked:scale-[1.02] group-hover:bg-slate-50 group-hover:border-vax-blue/30 active:scale-[0.95] transition-all text-sm font-bold select-none shadow-sm">
              {option}
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <form className="space-y-10" onSubmit={handleSubmit}>
      {/* 1. Idade */}
      <RadioGroup 
        name="age" 
        label="1. Idade" 
        options={['Menos de 18 anos', '18 a 25 anos', '26 a 35 anos', '36 a 45 anos', '46 a 60 anos', 'Mais de 60 anos']} 
      />

      {/* 2. Favor da vacinação */}
      <RadioGroup 
        name="vaccineOpinion" 
        label="2. Você é a favor da vacinação?" 
        options={['Sim', 'Não', 'Em parte']} 
      />

      {/* 3. Importância */}
      <RadioGroup 
        name="importance" 
        label="3. Você acredita que as vacinas são importantes para prevenir doenças?" 
        options={['Sim', 'Não', 'Não tenho certeza']} 
      />

      {/* 4. Carteira atualizada */}
      <RadioGroup 
        name="updated" 
        label="4. Sua carteira de vacinação está atualizada?" 
        options={['Sim', 'Não', 'Não sei']} 
      />

      {/* 5. COVID-19 */}
      <div className="space-y-6">
        <RadioGroup 
          name="covid" 
          label="5. Você já tomou a vacina contra COVID-19?" 
          options={['Sim', 'Não']} 
          onChange={setCovidVax}
        />
        {covidVax === 'Sim' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            className="pl-6 border-l-4 border-vax-blue/20 space-y-4"
          >
            <RadioGroup 
              name="covid_doses" 
              label="Se sim, quantas doses?" 
              options={['1 dose', '2 doses', '3 doses', '4 ou mais doses']} 
            />
          </motion.div>
        )}
      </div>

      {/* 6. Últimos 5 anos */}
      <RadioGroup 
        name="last_5_years" 
        label="6. Nos últimos 5 anos, aproximadamente quantas vacinas você tomou?" 
        options={['Nenhuma', '1 a 2 vacinas', '3 a 4 vacinas', '5 ou mais vacinas', 'Não lembro']} 
      />

      {/* 7. Confiança */}
      <RadioGroup 
        name="trust" 
        label="7. Você confia na eficácia das vacinas?" 
        options={['Sim', 'Não', 'Parcialmente']} 
      />

      {/* 8. Influência */}
      <div className="space-y-4">
        <RadioGroup 
          name="influence" 
          label="8. O que mais influencia sua decisão de tomar uma vacina?" 
          options={['Recomendação médica', 'Informações da internet', 'Família ou amigos', 'Televisão / notícias', 'Outros']} 
          onChange={setInfluence}
        />
        {influence === 'Outros' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="pl-6"
          >
            <input 
              type="text" 
              placeholder="Especifique o que influencia sua decisão"
              onChange={(e) => setFormData((prev: any) => ({ ...prev, influence_other: e.target.value }))}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-vax-blue focus:ring-2 focus:ring-vax-blue/20 outline-none transition-all"
            />
          </motion.div>
        )}
      </div>

      {/* 9. Deixou de tomar */}
      <div className="space-y-6">
        <RadioGroup 
          name="skipped" 
          label="9. Você já deixou de tomar alguma vacina recomendada?" 
          options={['Sim', 'Não']} 
          onChange={setSkippedVax}
        />
        {skippedVax === 'Sim' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            className="pl-6 border-l-4 border-vax-blue/20 space-y-2"
          >
            <label className="text-sm font-bold text-slate-700 block">Se sim, por qual motivo?</label>
            <textarea 
              rows={3}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, skipped_reason: e.target.value }))}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-vax-blue focus:ring-2 focus:ring-vax-blue/20 outline-none transition-all resize-none"
            ></textarea>
          </motion.div>
        )}
      </div>

      {/* 10. Opinião sobre outros */}
      <div className="space-y-2">
        <label className="text-base font-bold text-slate-800 block">10. Na sua opinião, por que algumas pessoas não querem se vacinar?</label>
        <textarea 
          rows={4}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, why_not_vax: e.target.value }))}
          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-vax-blue focus:ring-2 focus:ring-vax-blue/20 outline-none transition-all resize-none"
        ></textarea>
      </div>

      {/* 11. Campanhas */}
      <RadioGroup 
        name="campaigns" 
        label="11. Você acha que campanhas de vacinação são importantes?" 
        options={['Sim', 'Não', 'Talvez']} 
      />

      {/* 12. Interesse Campanha 2026 */}
      <RadioGroup 
        name="interest_campaign_2026" 
        label="12. Você tem interesse em participar da campanha de vacinação no dia 14 e 15 de Abril de 2026?" 
        options={['Sim', 'Não', 'Talvez']} 
      />

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <AlertTriangle className="w-5 h-5" /> {error}
        </motion.div>
      )}

      <button 
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-5 bg-vax-blue text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-vax-blue/20 flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-vax-blue/90 hover:scale-[1.01] active:scale-[0.98]'}`}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Respostas Anônimas'} <CheckCircle2 className="w-6 h-6" />
      </button>
    </form>
  );
};

const Formulario = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo size={32} />
          <button 
            onClick={() => navigate('/')}
            className="text-slate-600 hover:text-vax-blue font-bold transition-colors"
          >
            Início
          </button>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="pt-32 pb-24 px-6 max-w-4xl mx-auto"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-vax-blue font-bold mb-12 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Voltar para o Início
        </button>

        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100">
          <SectionTitle subtitle="Pesquisa de Opinião Anônima">Formulário de Conscientização</SectionTitle>
          <p className="text-slate-600 mb-12">
            Sua participação é anônima e fundamental para entendermos a percepção pública sobre a vacinação.
          </p>

          <SurveyForm onComplete={() => navigate('/')} />
        </div>
      </motion.div>
    </div>
  );
};

export default Formulario;
