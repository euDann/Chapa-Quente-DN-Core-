import { MessageCircle, PackageCheck, SlidersHorizontal } from 'lucide-react';

const passos = [
  { numero: '01', titulo: 'Escolha seus produtos', descricao: 'Explore o catálogo e encontre os itens que combinam com o seu setup.', Icone: PackageCheck },
  { numero: '02', titulo: 'Monte seu pedido', descricao: 'Revise quantidades e selecione as opções disponíveis em cada produto.', Icone: SlidersHorizontal },
  { numero: '03', titulo: 'Combine com a loja', descricao: 'Envie o resumo pelo WhatsApp para confirmar disponibilidade e entrega.', Icone: MessageCircle }
];

export default function Features() {
  return (
    <section id="como-funciona" className="w-full border-y border-white/[0.07] bg-[#0a090e] px-4 py-10 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-6 sm:mb-9 max-w-2xl"><p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-400">Compra descomplicada</p><h2 className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-black tracking-tight">Do catálogo à conversa.</h2><p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-gray-400">Você monta o pedido no site e finaliza os detalhes diretamente com a DN Store.</p></div>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
          {passos.map(({ numero, titulo, descricao, Icone }) => <article key={numero} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-6 transition hover:border-purple-400/25">
            <div className="flex items-center justify-between"><span className="text-xs font-black tracking-[0.2em] text-purple-300">{numero}</span><Icone size={20} className="text-gray-500" /></div>
            <h3 className="mt-4 sm:mt-7 text-base sm:text-lg font-bold">{titulo}</h3><p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-gray-500">{descricao}</p>
          </article>)}
        </div>
      </div>
    </section>
  );
}
