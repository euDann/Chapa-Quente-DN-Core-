import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus } from 'lucide-react';
import { formatarPreco } from '../config/loja';

export default function ProductCard({ produto, onAdicionar }) {
  const temOpcoes = Boolean(produto.options && Object.keys(produto.options).length);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0c12] transition duration-300 hover:-translate-y-1 hover:border-purple-400/30 hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
      <Link to={`/produto/${produto.id}`} className="relative block aspect-[1.9] sm:aspect-[1.35] overflow-hidden bg-gradient-to-br from-[#211833] via-[#13111a] to-[#0b0a0e]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(168,85,247,0.2),transparent_48%)]" />
        <img src={produto.imagem} alt={produto.nome} loading="lazy" className="relative h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" onError={evento => { evento.currentTarget.style.display = 'none'; }} />
        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">{produto.selo || produto.categoria}</span>
        <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/50 text-white opacity-0 backdrop-blur transition group-hover:opacity-100"><ArrowUpRight size={17} /></span>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-purple-300">{produto.categoria}</p>
        <Link to={`/produto/${produto.id}`} className="mt-1.5 sm:mt-2 text-sm sm:text-base font-bold leading-snug text-white transition hover:text-purple-200">{produto.nome}</Link>
        <p className="mt-1.5 sm:mt-2 min-h-8 sm:min-h-10 text-xs leading-4 sm:leading-5 text-gray-500">{produto.descricao}</p>
        <div className="mt-3 sm:mt-5 flex items-end justify-between gap-3">
          <div><p className="text-[9px] font-bold uppercase tracking-wider text-gray-600">Preço</p><p className="mt-1 text-lg sm:text-xl font-black tracking-tight text-white">{formatarPreco(produto.preco)}</p></div>
          {temOpcoes ? <Link to={`/produto/${produto.id}`} className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition hover:border-purple-400/40 hover:bg-purple-500/15" aria-label={`Escolher opções de ${produto.nome}`}><ArrowUpRight size={17} /></Link> : <button onClick={() => onAdicionar(produto)} className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-purple-600 text-white transition hover:bg-purple-500" aria-label={`Adicionar ${produto.nome} ao pedido`}><Plus size={18} /></button>}
        </div>
        <div className="mt-3 sm:mt-4 border-t border-white/[0.07] pt-2.5 sm:pt-3">
          {temOpcoes ? <Link to={`/produto/${produto.id}`} className="text-[10px] font-black uppercase tracking-wider text-gray-400 transition hover:text-white">Ver detalhes e escolher opções <span aria-hidden="true">→</span></Link> : <button onClick={() => onAdicionar(produto)} className="text-[10px] font-black uppercase tracking-wider text-gray-400 transition hover:text-white">Adicionar ao pedido <span aria-hidden="true">→</span></button>}
        </div>
      </div>
    </article>
  );
}
