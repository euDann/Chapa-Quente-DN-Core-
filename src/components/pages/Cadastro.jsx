import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Cadastro() {
  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();
    // Simulação: Cria conta e já loga o usuário
    localStorage.setItem('user-token', 'dn-core-active-session');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-12 selection:bg-purple-500/40">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] bg-[#0f1218] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full"></div>

        <div className="text-center mb-10 relative z-10">
          <h1 className="text-3xl font-[1000] italic uppercase tracking-tighter mb-2">
            Criar <span className="text-purple-500">Conta</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">
            Preencha os campos para se cadastrar
          </p>
        </div>

        <form onSubmit={handleCadastro} className="space-y-5 relative z-10">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-purple-500 ml-2 mb-2 block">
                Nome Completo
              </label>
              <input 
                type="text" 
                required 
                name="name"
                className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs font-bold focus:border-purple-500 outline-none transition-all placeholder:text-gray-800" 
                placeholder="SEU NOME AQUI" 
              />
            </div>

            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-purple-500 ml-2 mb-2 block">
                E-mail
              </label>
              <input 
                type="email" 
                required 
                name="email"
                className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs font-bold focus:border-purple-500 outline-none transition-all placeholder:text-gray-800" 
                placeholder="EMAIL@EXEMPLO.COM" 
              />
            </div>

            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-purple-500 ml-2 mb-2 block">
                Senha
              </label>
              <input 
                type="password" 
                required 
                name="password"
                minLength={8}
                className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs font-bold focus:border-purple-500 outline-none transition-all placeholder:text-gray-800" 
                placeholder="MÍNIMO 8 CARACTERES" 
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-purple-600 text-white py-5 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-black transition-all active:scale-95 shadow-xl mt-4 cursor-pointer"
          >
            Confirmar Registro
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-bold text-gray-600 uppercase tracking-widest relative z-10">
          Já tem uma conta? 
          <Link to="/login" className="text-white hover:text-purple-500 ml-1 transition-colors">
            Fazer Login →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}