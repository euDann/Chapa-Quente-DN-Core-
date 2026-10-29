import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { formatarPreco } from '../../config/loja';

export default function Checkout({ itens, whatsapp }) {
  const subtotal = useMemo(() => itens.reduce((total, item) => total + item.preco * item.quantidade, 0), [itens]);
  const numero = (whatsapp || '').replace(/\D/g, '');
  const mensagem = useMemo(() => {
    const linhas = itens.map(item => {
      const opcoes = Object.entries(item.configuracao || {}).map(([nome, valor]) => `   • ${nome}: ${valor}`).join('\n');
      return `• ${item.nome} — ${item.quantidade}x ${formatarPreco(item.preco)} = ${formatarPreco(item.preco * item.quantidade)}${opcoes ? `\n${opcoes}` : ''}`;
    });
    return `Olá! Gostaria de fazer um pedido na DN Store.\n\n${linhas.join('\n')}\n\nSubtotal dos produtos: ${formatarPreco(subtotal)}\n\nPode confirmar a disponibilidade e me ajudar a combinar a entrega e o pagamento?`;
  }, [itens, subtotal]);
  const linkWhatsApp = numero ? `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}` : '';

  if (!itens.length) return (
    <main className="min-h-[70vh] px-4 py-16 sm:px-6 sm:py-24 max-w-3xl mx-auto text-center flex flex-col items-center justify-center">
      <ShoppingBag size={34} className="text-purple-500 mb-4" />
      <h1 className="text-xl sm:text-2xl font-black uppercase">Seu carrinho está vazio</h1>
      <p className="text-sm text-gray-400 mt-2">Escolha alguns produtos para montar seu pedido.</p>
      <Link to="/" className="mt-6 sm:mt-8 bg-white text-black px-5 sm:px-6 py-3 rounded-xl text-xs font-black uppercase">Ver catálogo</Link>
    </main>
  );

  return (
    <main className="min-h-screen pt-10 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold uppercase"><ArrowLeft size={16} /> Voltar ao catálogo</Link>
      <header className="mt-6 sm:mt-8 mb-6 sm:mb-8">
        <p className="text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Quase pronto</p>
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">Revise seu pedido</h1>
        <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-gray-400 mt-2 sm:mt-3">Você vai confirmar disponibilidade, entrega e forma de pagamento diretamente com a loja.</p>
      </header>

      <section className="bg-white/[0.04] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8">
        <div className="space-y-3 sm:space-y-5">
          {itens.map(item => <div key={`${item.id}-${JSON.stringify(item.configuracao || {})}`} className="flex gap-3 sm:gap-4 items-center border-b border-white/10 pb-4 sm:pb-5">
            <img src={item.imagem} alt={item.nome} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover bg-white/5" />
            <div className="flex-1 min-w-0">
              <h2 className="font-black text-xs sm:text-sm uppercase">{item.nome}</h2>
              <p className="text-xs text-gray-400 mt-1">Quantidade: {item.quantidade}</p>
              {Object.entries(item.configuracao || {}).map(([nome, valor]) => <p key={nome} className="text-xs text-gray-500">{nome}: {valor}</p>)}
            </div>
            <strong className="text-xs sm:text-sm whitespace-nowrap">{formatarPreco(item.preco * item.quantidade)}</strong>
          </div>)}
        </div>

        <div className="flex justify-between items-center py-4 sm:py-6 text-base sm:text-lg font-black uppercase"><span>Subtotal</span><span className="text-purple-400">{formatarPreco(subtotal)}</span></div>

        {numero ? <a href={linkWhatsApp} target="_blank" rel="noreferrer" className="w-full bg-green-600 hover:bg-green-500 text-white min-h-14 px-5 py-4 rounded-2xl font-black uppercase tracking-wide text-sm flex justify-center items-center gap-3 transition-colors"><MessageCircle size={20} /> Enviar pedido pelo WhatsApp</a> : (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5">
            <h2 className="font-black text-sm uppercase text-yellow-300">Falta configurar o WhatsApp da loja</h2>
            <p className="text-sm text-gray-300 mt-2">Adicione o número comercial com código do país e DDD em <code>src/config/loja.js</code> para ativar o envio do pedido.</p>
          </div>
        )}
        <p className="text-center text-[10px] sm:text-[11px] leading-4 text-gray-500 mt-3 sm:mt-4">O pedido só será confirmado depois que a loja responder no WhatsApp.</p>
      </section>
    </main>
  );
}
