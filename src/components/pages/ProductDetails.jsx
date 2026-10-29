import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Adicionado AnimatePresence
import { useState, useCallback } from 'react';
import { formatarPreco } from '../../config/loja';

export default function ProductDetails({ produtos, onAdicionar }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const produto = produtos.find(p => p.id === Number(id) && p.ativo !== false);
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

    // Mantém o cliente na página para revisar as opções antes de continuar.
    setTimeout(() => setShowToast(false), 1800);
  };

  const configuracaoCompleta = produto.options 
    ? Object.keys(produto.options).every(cat => escolhas[cat])
    : true;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen bg-[#050505] text-white py-8 sm:py-12 px-4 sm:px-6 flex flex-col items-center relative"
    >
      {/* MENSAGEM DE SUCESSO (TOAST) */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-4 sm:bottom-10 z-[100] bg-purple-600 text-white px-5 py-3 sm:px-8 sm:py-4 rounded-2xl font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[9px] sm:text-[10px] shadow-[0_0_30px_rgba(168,85,247,0.5)] border border-white/20"
          >
            ✓ Adicionado ao seu pedido
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[1200px]">
        <button onClick={() => navigate('/')} className="text-purple-300 font-bold text-xs mb-5 sm:mb-8 hover:text-white transition-colors cursor-pointer">
           ← Voltar ao catálogo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-12 items-start">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#211833] via-[#13111a] to-[#0b0a0e] border border-white/10 rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 shadow-2xl">
            <img src={produto.imagem} alt={produto.nome} loading="eager" className="w-full aspect-square object-cover rounded-[1.4rem]" onError={evento => { evento.currentTarget.style.display = 'none'; }} />
          </div>

          <div className="flex flex-col">
            <p className="text-purple-300 font-black tracking-[0.2em] uppercase text-[9px] sm:text-[10px] mb-2 sm:mb-3">{produto.categoria}</p>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3 sm:mb-4">{produto.nome}</h1>
            <p className="text-sm sm:text-base text-gray-400 leading-6 sm:leading-7 mb-5 sm:mb-7">{produto.descricao}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
              {produto.options && Object.entries(produto.options).map(([categoria, opcoes]) => (
                <div key={categoria} className="flex flex-col">
                  <h3 className="text-white font-bold text-sm mb-3">Escolha {categoria.toLowerCase()}</h3>
                  <div className="flex flex-col gap-2">
                    {opcoes.map(opcao => (
                      <button
                        key={opcao}
                        onClick={() => handleSelecao(categoria, opcao)}
                        className={`px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
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

            <div className="p-4 sm:p-6 glass-panel rounded-2xl sm:rounded-[2rem] flex justify-between items-center gap-3">
              <div>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.15em]">Preço</p>
                <p className="text-2xl sm:text-3xl font-black">{formatarPreco(produto.preco)}</p>
              </div>
              <button 
                onClick={handleAdicionar}
                disabled={!configuracaoCompleta || showToast} // Desabilita se já clicou
                className={`px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest cursor-pointer transition-all ${
                  configuracaoCompleta ? "bg-white text-black hover:bg-purple-600 hover:text-white" : "bg-gray-900 text-gray-700"
                }`}
              >
                {showToast ? "Adicionado ao pedido ✓" : "Adicionar ao pedido"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
