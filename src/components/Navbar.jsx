import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

export default function Navbar({ carrinhoCount, onOpenCart, showCart = true }) {
  const navigate = useNavigate();

  return (
    <nav className="w-full border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer group" aria-label="Ir para o catálogo">
          <span className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tighter italic text-white">DN<span className="text-purple-500 group-hover:text-white transition-colors ml-1">STORE</span></span>
        </button>
        {showCart && <button onClick={onOpenCart} className="relative bg-purple-600 hover:bg-purple-500 text-white p-2 sm:px-5 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.4)]" aria-label={`Abrir pedido, ${carrinhoCount} itens`}>
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Meu pedido</span>
          <ShoppingCart size={18} />
          <span className="hidden text-sm font-black italic sm:inline">{carrinhoCount}</span>
          {carrinhoCount > 0 && <span className="absolute -top-1 -right-1 bg-white text-purple-600 text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full sm:hidden">{carrinhoCount}</span>}
        </button>}
      </div>
    </nav>
  );
}
