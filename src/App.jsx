import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Check, ChefHat, Flame, MessageCircle, Minus, Moon, Plus, Search, ShoppingBag, SlidersHorizontal, Sun, X } from 'lucide-react'
import { whatsappLoja } from './config/loja'
import './index.css'

const cardapio = [
  { id: 1, nome: 'Chapa Clássico', categoria: 'Hambúrgueres', preco: 32.9, descricao: 'Burger artesanal 160g, cheddar, alface, tomate e molho da casa.', selo: 'O mais pedido', imagem: 'photo-1568901346375-23c9450c58cd' },
  { id: 2, nome: 'Duplo Cheddar', categoria: 'Hambúrgueres', preco: 39.9, descricao: 'Dois burgers na chapa, cheddar cremoso e cebola caramelizada.', selo: 'Fome de verdade', imagem: 'photo-1639031663212-27507c18ee84' },
  { id: 3, nome: 'Bacon na Brasa', categoria: 'Hambúrgueres', preco: 36.9, descricao: 'Bacon crocante, queijo prato e maionese defumada.', selo: 'Defumado', imagem: 'photo-1550547660-d9450f859349' },
  { id: 4, nome: 'Picante da Casa', categoria: 'Hambúrgueres', preco: 35.9, descricao: 'Pepper jack, jalapeño e molho picante feito aqui.', selo: 'Tem personalidade', imagem: 'photo-1571091718767-18b5b1457add' },
  { id: 5, nome: 'Veggie na Chapa', categoria: 'Hambúrgueres', preco: 31.9, descricao: 'Burger de grão-de-bico, rúcula e molho de ervas no brioche.', selo: 'Sem carne', imagem: 'photo-1520072959219-c595dc870360' },
  { id: 6, nome: 'Batata da Casa', categoria: 'Acompanhamentos', preco: 18.9, descricao: 'Batata dourada com páprica e maionese especial.', selo: 'Crocante', imagem: 'photo-1573080496219-bb080dd4f877' },
  { id: 7, nome: 'Onion Rings', categoria: 'Acompanhamentos', preco: 19.9, descricao: 'Anéis de cebola sequinhos com molho para mergulhar.', selo: 'Pra dividir', imagem: 'photo-1639024471283-03518883512d' },
  { id: 8, nome: 'Milkshake de Chocolate', categoria: 'Bebidas', preco: 17.9, descricao: 'Cremoso, gelado e finalizado com calda de chocolate.', selo: 'Geladinho', imagem: 'photo-1572490122747-3968b75cc699' },
  { id: 9, nome: 'Refri Lata', categoria: 'Bebidas', preco: 7.5, descricao: 'Lata 350 ml bem gelada. Consulte os sabores.', selo: '350 ml', imagem: 'photo-1629203851122-3726ecdf080e' },
  { id: 10, nome: 'Combo Chapa Quente', categoria: 'Combos', preco: 49.9, descricao: 'Chapa Clássico, batata da casa e refrigerante lata.', selo: 'Combo completo', imagem: 'photo-1639031663212-27507c18ee84' },
  { id: 11, nome: 'Brownie da Casa', categoria: 'Sobremesas', preco: 14.9, descricao: 'Brownie macio de chocolate para fechar bonito.', selo: 'Doce final', imagem: 'photo-1606313564200-e75d5e30476c' },
]

const adicionais = [
  { nome: 'Bacon extra', preco: 5 },
  { nome: 'Queijo extra', preco: 3 },
  { nome: 'Jalapeño', preco: 2.5 },
]

const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
const foto = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export default function App() {
  const [produtos, setProdutos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('chapa-quente-produtos') || 'null') || cardapio } catch { return cardapio }
  })
  const [categoria, setCategoria] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [escuro, setEscuro] = useState(() => localStorage.getItem('chapa-quente-tema') === 'escuro')
  const [carrinho, setCarrinho] = useState(() => {
    try { return JSON.parse(localStorage.getItem('chapa-quente-carrinho') || '[]') } catch { return [] }
  })
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [produtoAtivo, setProdutoAtivo] = useState(null)
  const [extrasSelecionados, setExtrasSelecionados] = useState([])
  const [painelAberto, setPainelAberto] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState(null)
  const cliquesLogo = useRef(0)
  const temporizadorLogo = useRef(null)

  useEffect(() => { localStorage.setItem('chapa-quente-produtos', JSON.stringify(produtos)) }, [produtos])
  useEffect(() => { localStorage.setItem('chapa-quente-carrinho', JSON.stringify(carrinho)) }, [carrinho])
  useEffect(() => { localStorage.setItem('chapa-quente-tema', escuro ? 'escuro' : 'claro') }, [escuro])
  useEffect(() => {
    const fecharNoEscape = evento => {
      if (evento.key === 'Escape') { setProdutoAtivo(null); setCarrinhoAberto(false) }
    }
    window.addEventListener('keydown', fecharNoEscape)
    return () => window.removeEventListener('keydown', fecharNoEscape)
  }, [])

  const categorias = ['Todos', ...new Set(produtos.map(item => item.categoria))]
  const itensVisiveis = produtos.filter(item => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR')
    return (categoria === 'Todos' || item.categoria === categoria) && (!termo || `${item.nome} ${item.categoria} ${item.descricao}`.toLocaleLowerCase('pt-BR').includes(termo))
  })
  const quantidade = carrinho.reduce((total, item) => total + item.qtd, 0)
  const total = carrinho.reduce((soma, item) => soma + item.preco * item.qtd, 0)
  const mensagem = useMemo(() => `Oi, Chapa Quente! Quero fazer este pedido:\n\n${carrinho.map(item => `• ${item.qtd}x ${item.nome}${item.extras?.length ? ` (+ ${item.extras.map(extra => extra.nome).join(', ')})` : ''} — ${money(item.preco * item.qtd)}`).join('\n')}\n\nTotal dos itens: ${money(total)}\n\nMe confirma a disponibilidade, por favor?`, [carrinho, total])
  const numeroWhatsApp = whatsappLoja.replace(/\D/g, '')
  const linkWhatsApp = numeroWhatsApp ? `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}` : ''

  const adicionar = (produto, extras = []) => setCarrinho(atual => {
    const extrasKey = extras.map(extra => extra.nome).sort().join('|')
    const existente = atual.find(item => item.id === produto.id && (item.extrasKey || '') === extrasKey)
    const preco = produto.preco + extras.reduce((soma, extra) => soma + extra.preco, 0)
    return existente
      ? atual.map(item => item === existente ? { ...item, qtd: item.qtd + 1 } : item)
      : [...atual, { ...produto, preco, extras, extrasKey, qtd: 1 }]
  })

  const mudarQuantidade = (id, extrasKey, delta) => setCarrinho(atual => atual
    .map(item => item.id === id && (item.extrasKey || '') === extrasKey ? { ...item, qtd: item.qtd + delta } : item)
    .filter(item => item.qtd > 0))

  const abrirPersonalizacao = produto => {
    setProdutoAtivo(produto)
    setExtrasSelecionados([])
  }

  const confirmarPersonalizacao = () => {
    adicionar(produtoAtivo, extrasSelecionados)
    setProdutoAtivo(null)
    setCarrinhoAberto(true)
  }

  return (
    <div data-theme={escuro ? 'dark' : 'light'} className="min-h-screen overflow-hidden bg-[#fff9ed] text-[#281913]">
      <div role="status" className="fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#f1d16f]/40 bg-[#211a16]/95 px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-[.12em] text-[#fff2dc] shadow-xl backdrop-blur sm:bottom-5 sm:px-5 sm:text-xs">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#f1d16f]" aria-hidden="true" />
        <span>Site de demonstração · Não é uma loja real</span>
      </div>
      <div className="bg-[#a92820] px-4 py-2 text-center font-display text-[11px] uppercase tracking-[.16em] text-[#fff3d4] sm:text-xs">
        <Flame size={13} className="mr-1 inline" /> Fogo aceso. Chapa quente. Pedido caprichado.
      </div>

      <header className="sticky top-0 z-40 border-b border-[#321a12]/10 bg-[#fff9ed]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 lg:px-8">
          <a href="#inicio" className="flex items-center gap-2" aria-label="Chapa Quente — início">
            <span role="button" tabIndex={0} onClick={evento => { evento.preventDefault(); evento.stopPropagation(); cliquesLogo.current += 1; window.clearTimeout(temporizadorLogo.current); if (cliquesLogo.current >= 3) { setPainelAberto(true); cliquesLogo.current = 0 } else { temporizadorLogo.current = window.setTimeout(() => { cliquesLogo.current = 0 }, 900) } }} onKeyDown={evento => { if (evento.key === 'Enter' || evento.key === ' ') { evento.preventDefault(); cliquesLogo.current += 1; if (cliquesLogo.current >= 3) { setPainelAberto(true); cliquesLogo.current = 0; window.clearTimeout(temporizadorLogo.current) } else { window.clearTimeout(temporizadorLogo.current); temporizadorLogo.current = window.setTimeout(() => { cliquesLogo.current = 0 }, 900) } } }} className="grid h-10 w-10 place-items-center rounded-full bg-[#e6532d] text-[#fff5dc]" aria-label="Foguinho da marca"><Flame size={22} fill="currentColor" /></span>
            <span className="font-display text-xl uppercase leading-[.88] tracking-tight">Chapa <span className="text-[#bd3324]">Quente</span><small className="mt-1 block font-sans text-[8px] font-bold tracking-[.3em] text-[#80634c]">SMASH & BURGER</small></span>
          </a>
          <div className="hidden items-center gap-8 font-display text-xs uppercase tracking-[.12em] text-[#684633] md:flex">
            <a href="#cardapio" className="transition hover:text-[#bd3324]">Cardápio</a>
            <a href="#casa" className="transition hover:text-[#bd3324]">Nossa casa</a>
            <a href="#pedir" className="transition hover:text-[#bd3324]">Como pedir</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEscuro(value => !value)} className="grid h-10 w-10 place-items-center rounded-full border border-[#6a432a]/20 text-[#684633] transition hover:border-[#bd3324] hover:text-[#bd3324]" aria-label={escuro ? 'Ativar modo claro' : 'Ativar modo escuro'} title={escuro ? 'Modo claro' : 'Modo escuro'}>
              {escuro ? <Sun size={17}/> : <Moon size={17}/>}
            </button>
            <button onClick={() => setCarrinhoAberto(true)} className="inline-flex items-center gap-2 rounded-full bg-[#bd3324] px-4 py-2.5 font-display text-[11px] uppercase tracking-wide text-white transition hover:bg-[#97251e]" aria-label={`Abrir pedido, ${quantidade} itens`}>
              <ShoppingBag size={15}/><span className="hidden sm:inline">Meu pedido</span><span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#f9d76b] px-1 text-[10px] font-black text-[#361a13]">{quantidade}</span>
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section id="inicio" className="mx-auto grid max-w-[1600px] items-center gap-8 px-5 pb-14 pt-8 sm:pb-20 sm:pt-12 lg:grid-cols-[.88fr_1.12fr] lg:px-12 lg:py-14 xl:px-16">
          <div className="relative z-10 max-w-xl py-5">
            <p className="font-display text-xs uppercase tracking-[.24em] text-[#a92820]">Hambúrguer de verdade, sem frescura</p>
            <h1 className="mt-5 font-display text-[3.8rem] uppercase leading-[.88] tracking-[-.04em] text-[#2d1a12] sm:text-7xl lg:text-[5.7rem]">Bateu<br />a fome?<br /><span className="text-[#bd3324]">Resolveu.</span></h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#795a43] sm:text-base">Carne selada na chapa, queijo derretendo e molho da casa. A gente prepara na hora — você escolhe o resto.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#cardapio" className="inline-flex items-center gap-3 rounded-full bg-[#e6532d] px-6 py-4 font-display text-xs uppercase tracking-[.1em] text-white shadow-[0_8px_0_#b93424] transition hover:translate-y-0.5 hover:shadow-[0_6px_0_#b93424]">Ver o cardápio <ArrowDown size={15}/></a>
              <span className="flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-wider text-[#82654c]"><ChefHat size={16} className="text-[#bd3324]"/> Feito na chapa</span>
            </div>
            <div className="mt-10 flex items-center gap-3 border-t border-[#6a432a]/15 pt-4 text-[10px] font-bold uppercase tracking-[.14em] text-[#80634c]"><span className="h-2 w-2 rounded-full bg-[#e6532d]"/> Monte seu pedido e finalize no WhatsApp</div>
          </div>

          <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] border-[7px] border-white shadow-[0_18px_55px_rgba(84,44,20,.18)] sm:min-h-[520px]">
            <img src={foto('photo-1550547660-d9450f859349', 1600)} alt="Hambúrguer artesanal com queijo e ingredientes frescos" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25150e]/70 via-transparent to-transparent" />
            <div className="absolute left-5 top-5 rotate-[-5deg] rounded-full bg-[#f5d56c] px-4 py-3 text-center shadow-lg sm:left-8 sm:top-8"><span className="block font-display text-[9px] uppercase tracking-[.2em] text-[#624127]">Desde</span><strong className="font-display text-xl text-[#a92820]">R$ 32,90</strong></div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white sm:bottom-8 sm:left-8 sm:right-8"><div><span className="font-display text-[10px] uppercase tracking-[.22em] text-[#f5d56c]">O clássico da casa</span><p className="mt-1 font-display text-2xl uppercase sm:text-3xl">Chapa Clássico</p></div><span className="grid h-11 w-11 place-items-center rounded-full bg-[#e6532d]"><ArrowRight size={20}/></span></div>
          </div>
        </section>

        <div className="overflow-hidden border-y-[3px] border-[#f5d56c] bg-[#bd3324] py-3 text-center font-display text-[11px] uppercase tracking-[.2em] text-[#fff4dc] sm:text-sm">Hambúrguer • Batata crocante • Molho da casa • Milkshake • Hambúrguer • Batata crocante • Molho da casa •</div>

        <section id="cardapio" className="mx-auto max-w-[1600px] px-5 py-16 sm:py-24 lg:px-12 xl:px-16">
          <div className="mb-8 flex flex-col gap-6 border-b-2 border-[#321a12] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div><p className="font-display text-xs uppercase tracking-[.25em] text-[#bd3324]">Da chapa direto pro prato</p><h2 className="mt-2 font-display text-5xl uppercase leading-none tracking-tight sm:text-6xl">Pede o seu.</h2><p className="mt-3 text-sm text-[#795a43]">Escolha, personalize e monte seu pedido.</p></div>
            <div className="flex flex-col gap-3 lg:items-end">
              <div className="flex max-w-full flex-wrap gap-2">
                {categorias.map(item => <button key={item} onClick={() => setCategoria(item)} className={`rounded-full border px-3.5 py-2 font-display text-[10px] uppercase tracking-[.08em] transition ${categoria === item ? 'border-[#bd3324] bg-[#bd3324] text-white' : 'border-[#6a432a]/25 bg-transparent text-[#684633] hover:border-[#bd3324] hover:text-[#a92820]'}`}>{item}</button>)}
              </div>
              <label className="flex w-full items-center gap-2 border-b border-[#6a432a]/35 py-2 text-[#80634c] lg:max-w-xs"><Search size={15}/><input value={busca} onChange={evento => setBusca(evento.target.value)} placeholder="Buscar no cardápio" className="w-full bg-transparent text-xs text-[#281913] outline-none placeholder:text-[#a18a74]"/>{busca && <button type="button" onClick={() => setBusca('')} className="font-display text-[9px] uppercase text-[#bd3324]">Limpar</button>}</label>
            </div>
          </div>

          {itensVisiveis.length > 0 ? <div className="grid items-start gap-8 lg:grid-cols-[.9fr_1.1fr]">
            <article className="overflow-hidden rounded-[1.7rem] bg-[#f3e5c8] shadow-[0_10px_30px_rgba(91,57,31,.08)]">
              <div className="relative aspect-[1.45] overflow-hidden"><img src={foto(itensVisiveis[0].imagem, 1000)} alt={itensVisiveis[0].nome} loading="lazy" className="h-full w-full object-cover"/><span className="absolute left-4 top-4 bg-[#f5d56c] px-3 py-1.5 font-display text-[9px] uppercase tracking-[.16em] text-[#4e2b18]">{itensVisiveis[0].selo}</span></div>
              <div className="p-5 sm:p-7"><div className="flex items-start justify-between gap-3"><div><p className="font-display text-[10px] uppercase tracking-[.18em] text-[#bd3324]">{itensVisiveis[0].categoria}</p><h3 className="mt-1 font-display text-3xl uppercase leading-none">{itensVisiveis[0].nome}</h3></div><strong className="whitespace-nowrap font-display text-xl text-[#a92820]">{money(itensVisiveis[0].preco)}</strong></div><p className="mt-3 max-w-md text-xs leading-5 text-[#795a43]">{itensVisiveis[0].descricao}</p><button onClick={() => itensVisiveis[0].categoria === 'Hambúrgueres' ? abrirPersonalizacao(itensVisiveis[0]) : adicionar(itensVisiveis[0])} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#e6532d] px-5 py-3 font-display text-[10px] uppercase tracking-[.12em] text-white transition hover:bg-[#a92820]"><Plus size={14}/> {itensVisiveis[0].categoria === 'Hambúrgueres' ? 'Personalizar e pedir' : 'Adicionar ao pedido'}</button></div>
            </article>

            <div className="divide-y divide-[#6a432a]/20 border-y border-[#6a432a]/20">
              {itensVisiveis.slice(1).map(item => <article key={item.id} className="group flex gap-3 py-4 sm:gap-5 sm:py-5">
                <img src={foto(item.imagem, 260)} alt={item.nome} loading="lazy" className="h-[82px] w-[82px] shrink-0 rounded-2xl object-cover sm:h-24 sm:w-24"/>
                <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><p className="font-display text-[9px] uppercase tracking-[.14em] text-[#a36f4e]">{item.categoria}</p><h3 className="mt-1 font-display text-lg uppercase leading-tight sm:text-xl">{item.nome}</h3></div><strong className="whitespace-nowrap font-display text-base text-[#a92820]">{money(item.preco)}</strong></div><p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#795a43]">{item.descricao}</p><button onClick={() => item.categoria === 'Hambúrgueres' ? abrirPersonalizacao(item) : adicionar(item)} className="mt-2 inline-flex items-center gap-1 font-display text-[9px] uppercase tracking-[.12em] text-[#bd3324] transition group-hover:text-[#77211b]"><Plus size={12}/>{item.categoria === 'Hambúrgueres' ? 'Personalizar' : 'Adicionar'}</button></div>
              </article>)}
            </div>
          </div> : <div className="py-16 text-center"><Search size={25} className="mx-auto text-[#bd3324]"/><p className="mt-3 font-display text-xl uppercase">Não achamos esse pedido.</p><p className="mt-1 text-xs text-[#795a43]">Tente outro nome ou escolha uma categoria.</p></div>}
        </section>

        <section id="casa" className="bg-[#f1d16f] px-5 py-14 sm:py-20">
          <div className="mx-auto grid max-w-[1600px] gap-8 md:grid-cols-[.7fr_1.3fr] md:items-center lg:px-12 xl:px-16">
            <div className="relative mx-auto w-full max-w-sm rotate-[-2deg] border-[8px] border-[#fff9ed] shadow-[0_16px_35px_rgba(78,44,20,.18)]"><img src={foto('photo-1552566626-52f8b828add9', 800)} alt="Interior aconchegante de uma hamburgueria" loading="lazy" className="aspect-[1.25] w-full object-cover"/><span className="absolute -bottom-4 -right-3 rotate-[4deg] bg-[#bd3324] px-4 py-2 font-display text-[10px] uppercase tracking-[.15em] text-white">Feito com capricho</span></div>
            <div className="max-w-2xl md:pl-6"><p className="font-display text-xs uppercase tracking-[.22em] text-[#7b291f]">Nossa chapa, nossas regras</p><h2 className="mt-3 font-display text-5xl uppercase leading-[.9] tracking-tight sm:text-6xl">Sem atalho.<br/>Só sabor.</h2><p className="mt-5 max-w-lg text-sm leading-7 text-[#563720]">A gente acredita no básico bem feito: carne selada na hora, pão macio, ingredientes frescos e molho da casa. O resto é conversa de quem ainda não mordeu.</p><p className="mt-6 inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-[.12em] text-[#7b291f]"><Check size={15}/> Preparado quando você pede</p></div>
          </div>
        </section>

        <section id="pedir" className="mx-auto max-w-[1600px] px-5 py-16 sm:py-20 lg:px-12 xl:px-16">
          <div className="grid gap-8 rounded-[1.8rem] bg-[#2f1b13] p-6 text-[#fff8e9] sm:p-10 md:grid-cols-[.8fr_1.2fr] md:items-center">
            <div><p className="font-display text-xs uppercase tracking-[.22em] text-[#f1d16f]">Rápido e sem cadastro</p><h2 className="mt-3 font-display text-4xl uppercase leading-[.92] sm:text-5xl">Da sua escolha<br/>pro WhatsApp.</h2><p className="mt-4 text-xs leading-5 text-[#dfcdb2]">A loja confirma o pedido e combina os detalhes por mensagem.</p><a href="#cardapio" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#e6532d] px-5 py-3 font-display text-[10px] uppercase tracking-[.12em] text-white">Montar meu pedido <ArrowRight size={14}/></a></div>
            <div className="grid gap-3 sm:grid-cols-3">{[{n:'01',t:'Escolha',d:'Passe pelo cardápio.'},{n:'02',t:'Personalize',d:'Adicione bacon, queijo ou jalapeño.'},{n:'03',t:'Envie',d:'Revise e chame a loja no WhatsApp.'}].map(etapa => <article key={etapa.n} className="border-l-2 border-[#f1d16f] bg-white/[.05] p-4"><span className="font-display text-[10px] tracking-[.2em] text-[#f1d16f]">{etapa.n}</span><h3 className="mt-3 font-display text-base uppercase">{etapa.t}</h3><p className="mt-1 text-[10px] leading-4 text-[#dfcdb2]">{etapa.d}</p></article>)}</div>
          </div>
        </section>
      </main>

      <footer className="border-t-[5px] border-[#e6532d] bg-[#2f1b13] px-5 py-7 text-[#fff8e9]"><div className="mx-auto flex max-w-[1600px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:px-12 xl:px-16"><a href="#inicio" className="font-display text-lg uppercase">Chapa <span className="text-[#f1d16f]">Quente</span></a><p className="text-[10px] text-[#c4a88b]">© 2026 Chapa Quente · Feito na hora</p><a href="#cardapio" className="font-display text-[10px] uppercase tracking-[.12em] text-[#f1d16f]">Voltar ao cardápio ↑</a></div></footer>

      {produtoAtivo && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#2f1b13]/65 p-0 backdrop-blur-sm sm:items-center sm:p-5"><section role="dialog" aria-modal="true" aria-labelledby="personalizar-titulo" className="w-full max-w-lg rounded-t-[1.7rem] bg-[#fff9ed] p-6 text-[#281913] shadow-2xl sm:rounded-[1.7rem]"><div className="flex items-start justify-between"><div><p className="font-display text-[10px] uppercase tracking-[.2em] text-[#bd3324]">Do seu jeito</p><h2 id="personalizar-titulo" className="mt-1 font-display text-3xl uppercase">{produtoAtivo.nome}</h2><p className="mt-1 text-xs text-[#795a43]">Escolha seus adicionais (opcional)</p></div><button onClick={() => setProdutoAtivo(null)} aria-label="Fechar personalização" className="rounded-full border border-[#6a432a]/20 p-2"><X size={17}/></button></div><div className="mt-4 divide-y divide-[#6a432a]/15">{adicionais.map(extra => { const marcado = extrasSelecionados.some(item => item.nome === extra.nome); return <label key={extra.nome} className="flex cursor-pointer items-center justify-between py-4"><span className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={marcado} onChange={() => setExtrasSelecionados(atual => marcado ? atual.filter(item => item.nome !== extra.nome) : [...atual, extra])} className="h-4 w-4 accent-[#bd3324]"/>{extra.nome}</span><span className="font-display text-sm text-[#a92820]">+ {money(extra.preco)}</span></label> })}</div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#6a432a]/20 pt-5"><p className="text-xs text-[#795a43]">Total <strong className="ml-1 font-display text-base text-[#281913]">{money(produtoAtivo.preco + extrasSelecionados.reduce((soma, extra) => soma + extra.preco, 0))}</strong></p><button onClick={confirmarPersonalizacao} className="inline-flex items-center gap-2 rounded-full bg-[#e6532d] px-5 py-3 font-display text-[10px] uppercase tracking-[.1em] text-white"><Plus size={14}/> Adicionar</button></div></section></div>}

      {painelAberto && <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#2f1b13]/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"><section role="dialog" aria-modal="true" aria-labelledby="painel-titulo" className="painel-admin flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.7rem] bg-[#fff9ed] text-[#281913] shadow-2xl sm:rounded-[1.7rem]"><header className="flex items-center justify-between border-b border-[#6a432a]/20 p-5 sm:p-7"><div><p className="font-display text-[10px] uppercase tracking-[.2em] text-[#bd3324]">Gerencie o cardápio</p><h2 id="painel-titulo" className="mt-1 font-display text-3xl uppercase">Painel de produtos</h2><p className="mt-1 text-xs text-[#795a43]">Alterações salvas neste navegador.</p></div><button onClick={() => { setPainelAberto(false); setProdutoEditando(null) }} aria-label="Fechar painel" className="rounded-full border border-[#6a432a]/20 p-2"><X size={18}/></button></header><div className="overflow-y-auto p-5 sm:p-7"><form className="grid gap-3 rounded-2xl border border-[#6a432a]/15 bg-[#f3e5c8] p-4 sm:grid-cols-2" onSubmit={evento => { evento.preventDefault(); const dados = new FormData(evento.currentTarget); const produto = { id: produtoEditando?.id ?? Date.now(), nome: String(dados.get('nome')).trim(), categoria: String(dados.get('categoria')).trim(), preco: Number(dados.get('preco')), descricao: String(dados.get('descricao')).trim(), selo: String(dados.get('selo')).trim() || 'Da casa', imagem: String(dados.get('imagem')).trim() || 'photo-1568901346375-23c9450c58cd' }; if (!produto.nome || !produto.categoria || !Number.isFinite(produto.preco) || produto.preco < 0) return; setProdutos(lista => produtoEditando ? lista.map(item => item.id === produto.id ? produto : item) : [...lista, produto]); setProdutoEditando(null); evento.currentTarget.reset() }}><h3 className="font-display text-lg uppercase sm:col-span-2">{produtoEditando ? 'Editar produto' : 'Novo produto'}</h3><input name="nome" required defaultValue={produtoEditando?.nome || ''} placeholder="Nome do produto" className="rounded-lg border border-[#6a432a]/20 bg-white px-3 py-3 text-sm text-[#281913] placeholder:text-[#80634c]"/><input name="categoria" required list="categorias-painel" defaultValue={produtoEditando?.categoria || ''} placeholder="Categoria (ex.: Hambúrgueres)" className="rounded-lg border border-[#6a432a]/20 bg-white px-3 py-3 text-sm text-[#281913] placeholder:text-[#80634c]"/><datalist id="categorias-painel">{categorias.filter(item => item !== 'Todos').map(item => <option key={item} value={item}/>)}</datalist><input name="preco" required type="number" min="0" step="0.01" defaultValue={produtoEditando?.preco ?? ''} placeholder="Preço em R$" className="rounded-lg border border-[#6a432a]/20 bg-white px-3 py-3 text-sm text-[#281913] placeholder:text-[#80634c]"/><input name="selo" defaultValue={produtoEditando?.selo || ''} placeholder="Etiqueta (ex.: Mais pedido)" className="rounded-lg border border-[#6a432a]/20 bg-white px-3 py-3 text-sm text-[#281913] placeholder:text-[#80634c]"/><textarea name="descricao" defaultValue={produtoEditando?.descricao || ''} placeholder="Descrição" rows="2" className="rounded-lg border border-[#6a432a]/20 bg-white px-3 py-3 text-sm text-[#281913] placeholder:text-[#80634c] sm:col-span-2"/><input name="imagem" defaultValue={produtoEditando?.imagem || ''} placeholder="ID da foto Unsplash (opcional)" className="rounded-lg border border-[#6a432a]/20 bg-white px-3 py-3 text-sm text-[#281913] placeholder:text-[#80634c] sm:col-span-2"/><div className="flex gap-2 sm:col-span-2"><button className="rounded-full bg-[#bd3324] px-5 py-3 font-display text-[10px] uppercase tracking-wide text-white">{produtoEditando ? 'Salvar alterações' : 'Adicionar produto'}</button>{produtoEditando && <button type="button" onClick={() => setProdutoEditando(null)} className="rounded-full border border-[#6a432a]/25 px-5 py-3 font-display text-[10px] uppercase">Cancelar</button>}</div></form><div className="mt-6 divide-y divide-[#6a432a]/15">{produtos.map(item => <article key={item.id} className="flex items-center gap-3 py-4"><img src={foto(item.imagem, 180)} alt="" className="h-14 w-14 rounded-xl object-cover"/><div className="min-w-0 flex-1"><p className="truncate font-display text-sm uppercase">{item.nome}</p><p className="text-xs text-[#795a43]">{item.categoria} · {money(item.preco)}</p></div><button onClick={() => { setProdutoEditando(item); document.querySelector('.painel-admin form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} className="rounded-full border border-[#6a432a]/20 px-3 py-2 font-display text-[9px] uppercase text-[#684633]">Editar</button><button onClick={() => setProdutos(lista => lista.filter(produto => produto.id !== item.id))} aria-label={`Remover ${item.nome}`} className="rounded-full border border-[#bd3324]/25 px-3 py-2 font-display text-[9px] uppercase text-[#bd3324]">Remover</button></article>)}</div></div></section></div>}

      {carrinhoAberto && <div className="fixed inset-0 z-50"><button aria-label="Fechar carrinho" onClick={() => setCarrinhoAberto(false)} className="absolute inset-0 bg-[#2f1b13]/55 backdrop-blur-sm"/><aside role="dialog" aria-modal="true" aria-labelledby="carrinho-titulo" className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[#6a432a]/15 bg-[#fff9ed] p-5 text-[#281913] shadow-2xl sm:p-7"><div className="flex items-center justify-between border-b border-[#6a432a]/20 pb-5"><div><p className="font-display text-[10px] uppercase tracking-[.2em] text-[#bd3324]">Chapa Quente</p><h2 id="carrinho-titulo" className="mt-1 font-display text-2xl uppercase">Seu pedido ({quantidade})</h2></div><button onClick={() => setCarrinhoAberto(false)} aria-label="Fechar carrinho" className="rounded-full border border-[#6a432a]/20 p-2"><X size={18}/></button></div><div className="flex-1 overflow-y-auto py-3">{!carrinho.length ? <div className="flex h-full flex-col items-center justify-center text-center"><ShoppingBag size={28} className="text-[#bd3324]"/><p className="mt-3 font-display text-lg uppercase">Seu pedido tá vazio</p><p className="mt-1 text-xs text-[#795a43]">Escolha alguma coisa gostosa no cardápio.</p><button onClick={() => setCarrinhoAberto(false)} className="mt-5 rounded-full bg-[#e6532d] px-5 py-3 font-display text-[10px] uppercase text-white">Ver cardápio</button></div> : carrinho.map(item => <article key={`${item.id}-${item.extrasKey || ''}`} className="flex gap-3 border-b border-[#6a432a]/15 py-4"><img src={foto(item.imagem, 220)} alt="" className="h-16 w-16 rounded-xl object-cover"/><div className="min-w-0 flex-1"><p className="font-display text-sm uppercase">{item.nome}</p>{item.extras?.map(extra => <p key={extra.nome} className="mt-0.5 text-[10px] text-[#80634c]">+ {extra.nome}</p>)}<p className="mt-1 font-display text-sm text-[#a92820]">{money(item.preco * item.qtd)}</p><div className="mt-2 flex items-center gap-3"><button onClick={() => mudarQuantidade(item.id, item.extrasKey || '', -1)} aria-label={`Diminuir quantidade de ${item.nome}`} className="grid h-6 w-6 place-items-center rounded-full border border-[#6a432a]/25"><Minus size={12}/></button><span className="text-xs font-bold">{item.qtd}</span><button onClick={() => mudarQuantidade(item.id, item.extrasKey || '', 1)} aria-label={`Aumentar quantidade de ${item.nome}`} className="grid h-6 w-6 place-items-center rounded-full border border-[#6a432a]/25"><Plus size={12}/></button></div></div></article>)}</div><div className="border-t border-[#6a432a]/20 pt-5"><div className="mb-4 flex justify-between font-display text-sm uppercase"><span>Total dos itens</span><span className="text-[#a92820]">{money(total)}</span></div>{linkWhatsApp ? <a href={linkWhatsApp} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2b874a] py-4 font-display text-xs uppercase tracking-wide text-white hover:bg-[#216d3b]"><MessageCircle size={17}/> Finalizar pelo WhatsApp</a> : <div className="border border-[#a92820]/20 bg-[#f4e9d3] p-4 text-xs leading-5 text-[#684633]">Configure o número da loja em <code>src/config/loja.js</code> para ativar o envio do pedido pelo WhatsApp.</div>}<p className="mt-3 text-center text-[9px] leading-4 text-[#80634c]">A loja confirma o pedido e combina os detalhes pelo WhatsApp.</p></div></aside></div>}
    </div>
  )
}
