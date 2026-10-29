import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Adicionado AnimatePresence
import { useState, useCallback } from 'react';

export default function ProductDetails({ produtos, onAdicionar }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const produto = produtos.find(p => p.id === Number(id));
  const [escolhas, setEscolhas] = useState({});
  const [showToast, setShowToast] = useState(false); // Estado para a mensagem

  if (!produto) return <div className="text-white p-20 text-center font-black uppercase">Equipamento não encontrado</div>;

  const handleSelecao = useCallback((categoria, opcao) => {
    setEscolhas(prev => ({ ...prev, [categoria]: opcao }));
  }, []);

  const handleAdicionar = () => {
    onAdicionar({ ...produto, configuracao: escolhas });
    
    // Mostra o feedback visual
    setShowToast(true);

    // Espera 1.5 segundos para o usuário ver a mensagem e então redireciona
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const configuracaoCompleta = produto.options 
    ? Object.keys(produto.options).every(cat => escolhas[cat])
    : true;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen bg-[#050505] text-white py-12 px-6 flex flex-col items-center relative"
    >
      {/* MENSAGEM DE SUCESSO (TOAST) */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-10 z-[100] bg-purple-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_0_30px_rgba(168,85,247,0.5)] border border-white/20"
          >
            ✓ Equipamento Adicionado ao Arsenal
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[1200px]">
        <button onClick={() => navigate('/')} className="text-purple-500 font-black text-[10px] uppercase tracking-[0.4em] mb-8 hover:text-white transition-colors cursor-pointer">
           ← BACK TO VITRINE
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="bg-[#0f1218] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl">
            <img src={produto.imagem} alt={produto.nome} loading="eager" className="w-full h-auto rounded-3xl" />
          </div>

          <div className="flex flex-col">
            <p className="text-purple-500 font-black tracking-[0.5em] uppercase text-[9px] mb-2 italic">Build Your Spec</p>
            <h1 className="text-5xl font-[1000] uppercase tracking-tighter italic leading-tight mb-4">{produto.nome}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {produto.options && Object.entries(produto.options).map(([categoria, opcoes]) => (
                <div key={categoria} className="flex flex-col">
                  <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-3">{categoria}</h3>
                  <div className="flex flex-col gap-2">
                    {opcoes.map(opcao => (
                      <button
                        key={opcao}
                        onClick={() => handleSelecao(categoria, opcao)}
                        className={`px-4 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                          escolhas[categoria] === opcao ? "bg-white text-black border-white" : "bg-white/5 text-gray-500 border-white/5 hover:border-purple-500/30"
                        }`}
                      >
                        {opcao}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 glass-panel rounded-[2rem] flex justify-between items-center">
              <div>
                <p className="text-[8px] text-purple-500 font-black uppercase tracking-[0.2em]">Total</p>
                <p className="text-3xl font-[1000] italic">R$ {produto.preco.toFixed(2)}</p>
              </div>
              <button 
                onClick={handleAdicionar}
                disabled={!configuracaoCompleta || showToast} // Desabilita se já clicou
                className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all ${
                  configuracaoCompleta ? "bg-white text-black hover:bg-purple-600 hover:text-white" : "bg-gray-900 text-gray-700"
                }`}
              >
                {showToast ? "PROCESSANDO..." : "ADICIONAR"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}