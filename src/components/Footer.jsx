import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#07070a] px-4 pb-4 pt-8 sm:px-6 sm:pb-6 sm:pt-16">
      <div className="mx-auto grid max-w-[1320px] gap-6 sm:gap-10 border-b border-white/[0.08] pb-7 sm:pb-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link to="/" className="text-xl font-black uppercase tracking-tight text-white">DN<span className="text-purple-400"> STORE</span></Link>
          <p className="mt-2 sm:mt-4 text-xs sm:text-sm leading-5 sm:leading-6 text-gray-500">Tecnologia e acessórios para montar um espaço que é a sua cara.</p>
        </div>
        <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Navegue</p><div className="mt-3 sm:mt-4 flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500"><a href="#catalogo" className="transition hover:text-white">Catálogo</a><a href="#como-funciona" className="transition hover:text-white">Como funciona</a><Link to="/painel" className="transition hover:text-white">Painel demonstrativo</Link></div></div>
        <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Pedidos</p><p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-5 sm:leading-6 text-gray-500">Escolha os produtos, revise seu pedido e converse com a loja pelo WhatsApp.</p><a href="#catalogo" className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs font-bold text-purple-300 transition hover:text-white">Ver produtos <ArrowUpRight size={14} /></a></div>
      </div>
      <div className="mx-auto flex max-w-[1320px] flex-col gap-1.5 sm:gap-2 pt-4 sm:pt-5 text-[9px] sm:text-[10px] font-medium text-gray-600 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 DN Store</span><span>Catálogo online · Brasil</span></div>
    </footer>
  );
}
