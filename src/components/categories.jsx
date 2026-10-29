import { motion } from 'framer-motion';

export default function Categories({ categorias, categoriaAtiva, setCategoriaAtiva }) {
  return (
    <div className="mb-7 flex gap-2 overflow-x-auto border-b border-white/10 pb-3 no-scrollbar">
      {categorias.map(categoria => <button key={categoria} onClick={() => setCategoriaAtiva(categoria)} className={`relative flex-none px-4 py-3 text-xs font-bold transition-colors ${categoriaAtiva === categoria ? 'text-white' : 'text-gray-500 hover:text-gray-200'}`}>
        {categoriaAtiva === categoria && <motion.span layoutId="activeCategory" className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-purple-400" transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }} />}
        {categoria}
      </button>)}
    </div>
  );
}
