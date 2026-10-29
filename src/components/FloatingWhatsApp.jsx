import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsApp({ numero }) {
  const [avisoAberto, setAvisoAberto] = useState(false);
  const contato = (numero || '').replace(/\D/g, '');
  const mensagem = encodeURIComponent('Olá! Vim pelo site da DN Store e gostaria de tirar uma dúvida.');
  const linkWhatsApp = contato ? `https://wa.me/${contato}?text=${mensagem}` : '';

  return (
    <div className="fixed inset-x-0 bottom-4 z-[80] flex flex-col items-end pr-0 sm:bottom-7">
      <div className="mb-1.5 mr-3 w-fit max-w-[calc(100vw-2rem)] rounded-2xl sm:mb-2 sm:mr-5 border border-white/10 bg-[#111016]/75 px-3 py-2 text-right text-[8px] sm:text-[9px] font-medium leading-relaxed text-white/65 shadow-lg backdrop-blur-xl"><span className="block">Projeto demonstrativo</span><span className="block">Produtos e preços fictícios</span></div>
      {avisoAberto && !contato && <div role="status" className="mb-2 sm:mb-3 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#111016]/90 p-3 sm:p-4 text-white shadow-2xl backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold">WhatsApp da DN Store</p><p className="mt-1 text-xs leading-5 text-gray-400">Esta demonstração ainda não está conectada a um número de atendimento.</p></div><button onClick={() => setAvisoAberto(false)} aria-label="Fechar aviso" className="rounded-lg p-1 text-gray-500 transition hover:text-white"><X size={16} /></button></div>
      </div>}

      {contato ? <a href={linkWhatsApp} target="_blank" rel="noreferrer" aria-label="Falar com a DN Store pelo WhatsApp" className="group mr-0 flex h-12 w-12 items-center justify-center gap-0 rounded-full border border-white/25 bg-[#128c7e]/75 p-0 text-white shadow-[0_10px_40px_rgba(18,140,126,0.3)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[#128c7e]/90 sm:h-auto sm:w-auto sm:gap-3 sm:justify-start sm:px-4 sm:py-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15"><MessageCircle size={21} /></span><span className="hidden pr-1 sm:block"><span className="block text-[9px] font-semibold uppercase tracking-wider text-white/70">Atendimento</span><span className="block text-sm font-bold">Fale pelo WhatsApp</span></span>
      </a> : <button onClick={() => setAvisoAberto(aberto => !aberto)} aria-expanded={avisoAberto} aria-label="Abrir contato da DN Store pelo WhatsApp" className="group relative mr-0 flex h-12 w-12 items-center justify-center gap-0 rounded-full border border-white/25 bg-[#128c7e]/75 p-0 text-white shadow-[0_10px_40px_rgba(18,140,126,0.3)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[#128c7e]/90 sm:h-auto sm:w-auto sm:gap-3 sm:justify-start sm:px-4 sm:py-3">
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25d366]/20 [animation-duration:2.8s]" />
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15"><MessageCircle size={21} /></span><span className="hidden pr-1 sm:block"><span className="block text-[9px] font-semibold uppercase tracking-wider text-white/70">Atendimento</span><span className="block text-sm font-bold">Fale pelo WhatsApp</span></span>
      </button>}
    </div>
  );
}
