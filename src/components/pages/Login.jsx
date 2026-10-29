import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('user-token', 'dn-core-active-session');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 selection:bg-purple-500/40">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-[#0f1218] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full"></div>

        <div className="text-center mb-10 relative z-10">
          <h1 className="text-3xl font-[1000] italic uppercase tracking-tighter mb-2">
            Acessar <span className="text-purple-500">Conta</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">
            Entre com seus dados para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-purple-500 ml-2 mb-2 block">
              E-mail
            </label>
            <input 
              type="email" 
              required
              name="email"
              className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs font-bold focus:border-purple-500 outline-none transition-all placeholder:text-gray-800"
              placeholder="seu@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 px-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-purple-500 block">
                Senha
              </label>
              
              {/* BOTÃO ESQUECI A SENHA */}
              <Link 
                to="/recuperar-senha" 
                className="text-[9px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                Esqueci a senha
              </Link>
            </div>
            
            <input 
              type="password" 
              required
              name="password"
              className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs font-bold focus:border-purple-500 outline-none transition-all placeholder:text-gray-800"
              placeholder="••••••••"
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black py-5 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[11px] hover:bg-purple-600 hover:text-white transition-all active:scale-95 shadow-xl mt-4 cursor-pointer"
          >
            Iniciar Sessão
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-bold text-gray-600 uppercase tracking-widest relative z-10">
          Ainda não tem uma conta? 
          <Link to="/cadastro" className="text-white hover:text-purple-500 ml-1 transition-colors">
            Criar Perfil →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}