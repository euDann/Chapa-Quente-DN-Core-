import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatarPreco } from '../config/loja';

export default function CartModal({ isOpen, onClose, carrinho, onAlterarQuantidade }) {
  const navigate = useNavigate();
  const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 z-[60]" />
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-[#0a0a0a] border-l border-white/5 z-[70] p-4 sm:p-6 flex flex-col shadow-2xl">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-black italic uppercase tracking-tighter">Seu pedido</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest">Fechar [X]</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4">
            {carrinho.length === 0 ? <div className="h-full flex items-center justify-center opacity-40"><p className="text-xs font-black uppercase tracking-widest">Seu carrinho está vazio</p></div> : carrinho.map(item => (
              <div key={`${item.id}-${JSON.stringify(item.configuracao || {})}`} className="bg-white/[0.02] border border-white/5 p-3 sm:p-4 rounded-2xl flex gap-3 sm:gap-4">
                <img src={item.imagem} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover" alt={item.nome} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-black uppercase text-white">{item.nome}</h4>
                  <p className="text-[10px] text-purple-400 font-bold">{formatarPreco(item.preco)} cada</p>
                  {Object.entries(item.configuracao || {}).map(([nome, valor]) => <p key={nome} className="text-[9px] text-gray-500">{nome}: {valor}</p>)}
                  <div className="flex items-center gap-3 mt-2">
                    <button aria-label={`Diminuir quantidade de ${item.nome}`} onClick={() => onAlterarQuantidade(item.id, item.configuracao, item.quantidade - 1)} className="w-7 h-7 rounded-lg bg-white/10">−</button>
                    <span className="text-xs font-bold">{item.quantidade}</span>
                    <button aria-label={`Aumentar quantidade de ${item.nome}`} onClick={() => onAlterarQuantidade(item.id, item.configuracao, item.quantidade + 1)} className="w-7 h-7 rounded-lg bg-white/10">+</button>
                    <span className="ml-auto text-xs font-bold">{formatarPreco(item.preco * item.quantidade)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-4 sm:pt-6 border-t border-white/5">
            <div className="flex justify-between items-end mb-4 sm:mb-6"><span className="text-[9px] text-gray-500 font-black uppercase">Subtotal</span><span className="text-xl sm:text-2xl font-black">{formatarPreco(total)}</span></div>
            <button onClick={handleCheckout} disabled={carrinho.length === 0} className="w-full bg-white text-black py-4 sm:py-5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-purple-600 hover:text-white transition-all disabled:opacity-30">Pedir pelo WhatsApp</button>
          </div>
        </motion.div>
      </>}
    </AnimatePresence>
  );
}
