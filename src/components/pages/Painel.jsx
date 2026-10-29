import { useMemo, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, ImagePlus, Pencil, Plus, RotateCcw, Search, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatarPreco } from '../../config/loja';
import { produtosFixos } from '../../data/produtos';

const novoFormulario = (produto) => ({
  nome: produto?.nome || '',
  categoria: produto?.categoria || '',
  preco: produto?.preco ?? '',
  descricao: produto?.descricao || '',
  selo: produto?.selo || '',
  imagem: produto?.imagem || '',
  opcoes: Object.entries(produto?.options || {}).map(([chave, valores]) => `${chave}: ${valores.join(', ')}`).join('\n')
});

function prepararImagem(file) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error('Não foi possível abrir essa imagem.'));
    leitor.onload = () => {
      const imagem = new Image();
      imagem.onerror = () => reject(new Error('Esse arquivo não parece ser uma imagem válida.'));
      imagem.onload = () => {
        const escala = Math.min(1, 1200 / Math.max(imagem.naturalWidth, imagem.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(imagem.naturalWidth * escala);
        canvas.height = Math.round(imagem.naturalHeight * escala);
        const contexto = canvas.getContext('2d');
        contexto.fillStyle = '#ffffff';
        contexto.fillRect(0, 0, canvas.width, canvas.height);
        contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/webp', 0.78));
      };
      imagem.src = leitor.result;
    };
    leitor.readAsDataURL(file);
  });
}

function lerOpcoes(texto) {
  return texto.split('\n').reduce((resultado, linha) => {
    const separador = linha.indexOf(':');
    if (separador < 1) return resultado;
    const nome = linha.slice(0, separador).trim();
    const valores = linha.slice(separador + 1).split(',').map(valor => valor.trim()).filter(Boolean);
    if (nome && valores.length) resultado[nome] = valores;
    return resultado;
  }, {});
}

export default function Painel({ produtos, onSalvarProdutos }) {
  const [busca, setBusca] = useState('');
  const [formAberto, setFormAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [form, setForm] = useState(novoFormulario(null));
  const [feedback, setFeedback] = useState('');
  const [erro, setErro] = useState('');
  const [carregandoImagem, setCarregandoImagem] = useState(false);

  const produtosVisiveis = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR');
    return produtos.filter(produto => `${produto.nome} ${produto.categoria}`.toLocaleLowerCase('pt-BR').includes(termo));
  }, [produtos, busca]);

  const abrirFormulario = (produto = null) => {
    setProdutoEditando(produto);
    setForm(novoFormulario(produto));
    setErro('');
    setFeedback('');
    setFormAberto(true);
  };

  const fecharFormulario = () => {
    setFormAberto(false);
    setProdutoEditando(null);
    setCarregandoImagem(false);
  };

  const alterarCampo = evento => setForm(atual => ({ ...atual, [evento.target.name]: evento.target.value }));

  const selecionarImagem = async evento => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    if (!arquivo.type.startsWith('image/')) {
      setErro('Escolha um arquivo de imagem.');
      return;
    }
    setCarregandoImagem(true);
    setErro('');
    try {
      const imagem = await prepararImagem(arquivo);
      setForm(atual => ({ ...atual, imagem }));
    } catch (falha) {
      setErro(falha.message || 'Não foi possível preparar essa imagem.');
    } finally {
      setCarregandoImagem(false);
      evento.target.value = '';
    }
  };

  const salvarProduto = evento => {
    evento.preventDefault();
    setErro('');
    const preco = Number(String(form.preco).replace(',', '.'));
    if (!form.nome.trim() || !form.categoria.trim() || !Number.isFinite(preco) || preco < 0) {
      setErro('Preencha o nome, a categoria e um preço válido.');
      return;
    }
    if (!form.imagem.trim()) {
      setErro('Adicione uma foto ou um endereço de imagem para o produto.');
      return;
    }

    const produto = {
      id: produtoEditando?.id ?? Date.now(),
      nome: form.nome.trim(),
      categoria: form.categoria.trim(),
      preco,
      descricao: form.descricao.trim(),
      selo: form.selo.trim(),
      imagem: form.imagem.trim(),
      ativo: produtoEditando?.ativo !== false,
      options: lerOpcoes(form.opcoes)
    };
    const atualizados = produtoEditando
      ? produtos.map(item => item.id === produto.id ? produto : item)
      : [produto, ...produtos];

    try {
      localStorage.setItem('dn-store-products', JSON.stringify(atualizados));
      onSalvarProdutos(atualizados);
      fecharFormulario();
      setFeedback(produtoEditando ? 'Produto atualizado.' : 'Produto adicionado.');
    } catch {
      setErro('O navegador ficou sem espaço para salvar. Tente uma imagem menor ou remova alguma foto enviada.');
    }
  };

  const excluirProduto = produto => {
    if (!window.confirm(`Remover “${produto.nome}” do catálogo deste navegador?`)) return;
    const atualizados = produtos.filter(item => item.id !== produto.id);
    try {
      localStorage.setItem('dn-store-products', JSON.stringify(atualizados));
      onSalvarProdutos(atualizados);
      setFeedback('Produto removido do catálogo deste navegador.');
    } catch {
      setErro('Não foi possível salvar essa alteração no navegador.');
    }
  };

  const alternarPublicacao = produto => {
    const atualizados = produtos.map(item => item.id === produto.id ? { ...item, ativo: item.ativo === false } : item);
    try {
      localStorage.setItem('dn-store-products', JSON.stringify(atualizados));
      onSalvarProdutos(atualizados);
      setFeedback(produto.ativo === false ? 'Produto publicado na vitrine deste navegador.' : 'Produto ocultado da vitrine deste navegador.');
      setErro('');
    } catch {
      setErro('Não foi possível salvar essa alteração no navegador.');
    }
  };

  const restaurarCatalogo = () => {
    if (!window.confirm('Restaurar os produtos fictícios originais? Suas alterações locais serão substituídas.')) return;
    try {
      localStorage.setItem('dn-store-products', JSON.stringify(produtosFixos));
      onSalvarProdutos(produtosFixos);
      setFeedback('Catálogo de exemplo restaurado.');
      setErro('');
    } catch {
      setErro('Não foi possível restaurar o catálogo.');
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-7 text-white sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-gray-500 transition hover:text-white"><ArrowLeft size={15} /> Voltar à vitrine</Link>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-400">DN Store</p>
            <h1 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight">Painel de produtos</h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-400">Cadastre itens, atualize fotos e organize a vitrine.</p>
          </div>
          <button onClick={() => abrirFormulario()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 sm:px-5 py-3 sm:py-3.5 text-xs font-black uppercase tracking-wider transition hover:bg-purple-500"><Plus size={16} /> Adicionar produto</button>
        </div>

        <div className="mb-5 sm:mb-7 flex flex-col gap-3 sm:gap-4 rounded-2xl border border-purple-400/20 bg-purple-400/[0.06] p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div><p className="text-sm font-bold">Painel de demonstração</p><p className="mt-1 text-xs leading-5 text-gray-400">As alterações e fotos ficam salvas somente neste navegador e atualizam a vitrine local.</p></div>
          <button onClick={restaurarCatalogo} className="inline-flex items-center gap-2 self-start text-xs font-bold text-gray-400 transition hover:text-white sm:self-center"><RotateCcw size={14} /> Restaurar exemplos</button>
        </div>

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-400"><strong className="text-white">{produtos.length}</strong> {produtos.length === 1 ? 'produto no catálogo' : 'produtos no catálogo'}</p>
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:w-80"><Search size={17} className="text-gray-500" /><input value={busca} onChange={evento => setBusca(evento.target.value)} placeholder="Buscar produtos" className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600" /></label>
        </div>

        {feedback && <p role="status" className="mb-4 rounded-xl border border-green-500/20 bg-green-500/[0.06] px-4 py-3 text-sm text-green-300">{feedback}</p>}
        {erro && !formAberto && <p role="alert" className="mb-4 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">{erro}</p>}

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0b10]">
          <div className="hidden grid-cols-[minmax(0,1.8fr)_1fr_1fr_auto] gap-4 border-b border-white/[0.08] px-5 py-3 text-[9px] font-black uppercase tracking-[0.18em] text-gray-600 sm:grid"><span>Produto</span><span>Categoria</span><span>Preço</span><span>Ações</span></div>
          {produtosVisiveis.map(produto => <article key={produto.id} className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/[0.06] p-4 last:border-0 sm:grid-cols-[minmax(0,1.8fr)_1fr_1fr_auto] sm:gap-4 sm:px-5">
            <img src={produto.imagem} alt="" className="h-14 w-14 rounded-xl bg-white/5 object-cover sm:hidden" onError={evento => { evento.currentTarget.style.visibility = 'hidden'; }} />
            <div className="flex min-w-0 items-center gap-3"><img src={produto.imagem} alt="" className="hidden h-12 w-12 rounded-lg bg-white/5 object-cover sm:block" onError={evento => { evento.currentTarget.style.visibility = 'hidden'; }} /><div className="min-w-0"><p className="truncate text-sm font-bold">{produto.nome}</p><p className="mt-1 truncate text-xs text-gray-500 sm:hidden">{produto.categoria} · {formatarPreco(produto.preco)}</p><span className={`mt-1 inline-block text-[9px] font-bold uppercase tracking-wider ${produto.ativo === false ? 'text-gray-600' : 'text-green-400'}`}>{produto.ativo === false ? 'Oculto' : 'Publicado'}</span></div></div>
            <span className="hidden text-sm text-gray-400 sm:block">{produto.categoria}</span>
            <span className="hidden text-sm font-semibold sm:block">{formatarPreco(produto.preco)}</span>
            <div className="flex items-center gap-2"><button onClick={() => alternarPublicacao(produto)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-gray-400 transition hover:border-purple-400/30 hover:text-white" aria-label={`${produto.ativo === false ? 'Publicar' : 'Ocultar'} ${produto.nome}`}>{produto.ativo === false ? <Eye size={15} /> : <EyeOff size={15} />}</button><button onClick={() => abrirFormulario(produto)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-gray-400 transition hover:border-purple-400/30 hover:text-white" aria-label={`Editar ${produto.nome}`}><Pencil size={15} /></button><button onClick={() => excluirProduto(produto)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-gray-500 transition hover:border-red-400/30 hover:text-red-300" aria-label={`Remover ${produto.nome}`}><Trash2 size={15} /></button></div>
          </article>)}
          {!produtosVisiveis.length && <p className="px-5 py-12 text-center text-sm text-gray-500">Nenhum produto encontrado.</p>}
        </div>
      </div>

      {formAberto && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={evento => { if (evento.target === evento.currentTarget) fecharFormulario(); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="form-produto-titulo" className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#111016] p-5 shadow-2xl sm:rounded-3xl sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[0.22em] text-purple-400">Catálogo</p><h2 id="form-produto-titulo" className="mt-2 text-2xl font-black">{produtoEditando ? 'Editar produto' : 'Novo produto'}</h2></div><button onClick={fecharFormulario} className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-gray-400 hover:text-white" aria-label="Fechar formulário"><X size={18} /></button></div>
          <form onSubmit={salvarProduto} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-xs font-bold text-gray-300 sm:col-span-2">Nome do produto<input name="nome" value={form.nome} onChange={alterarCampo} required maxLength={90} className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-purple-400/50" /></label>
              <label className="space-y-2 text-xs font-bold text-gray-300">Categoria<input name="categoria" value={form.categoria} onChange={alterarCampo} required maxLength={40} placeholder="Ex.: Teclados" className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-purple-400/50" /></label>
              <label className="space-y-2 text-xs font-bold text-gray-300">Preço<input name="preco" type="number" min="0" step="0.01" value={form.preco} onChange={alterarCampo} required className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-purple-400/50" /></label>
            </div>
            <label className="block space-y-2 text-xs font-bold text-gray-300">Descrição<textarea name="descricao" value={form.descricao} onChange={alterarCampo} rows={3} maxLength={240} className="w-full resize-y rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-purple-400/50" /></label>
            <label className="block space-y-2 text-xs font-bold text-gray-300">Etiqueta curta <span className="font-normal text-gray-600">(opcional)</span><input name="selo" value={form.selo} onChange={alterarCampo} maxLength={28} placeholder="Ex.: Personalizável" className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-purple-400/50" /></label>
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-300">Foto do produto</p>
              <div className="flex flex-col gap-4 sm:flex-row">
                {form.imagem && <img src={form.imagem} alt="Prévia da foto do produto" className="h-32 w-32 rounded-xl border border-white/10 bg-white/5 object-cover" />}
                <div className="flex flex-1 flex-col gap-3">
                  <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold text-white transition hover:border-purple-400/30"><ImagePlus size={16} /> {carregandoImagem ? 'Preparando foto…' : 'Escolher foto do computador'}<input type="file" accept="image/*" onChange={selecionarImagem} disabled={carregandoImagem} className="sr-only" /></label>
                  <input aria-label="Endereço da imagem" type="url" value={form.imagem.startsWith('data:') ? '' : form.imagem} onChange={evento => setForm(atual => ({ ...atual, imagem: evento.target.value }))} placeholder="Ou cole o link da imagem" className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs text-white outline-none focus:border-purple-400/50" />
                  <p className="text-[10px] leading-5 text-gray-600">A foto enviada é reduzida para caber no armazenamento local deste navegador.</p>
                </div>
              </div>
            </div>
            <label className="block space-y-2 text-xs font-bold text-gray-300">Opções configuráveis <span className="font-normal text-gray-600">(opcional)</span><textarea name="opcoes" value={form.opcoes} onChange={alterarCampo} rows={3} placeholder={'Switches: Blue, Red\nCor: Preto, Branco'} className="w-full resize-y rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-purple-400/50" /><span className="block text-[10px] font-normal leading-5 text-gray-600">Uma opção por linha; separe as escolhas por vírgula.</span></label>
            {erro && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-xs text-red-300">{erro}</p>}
            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={fecharFormulario} className="rounded-xl border border-white/10 px-5 py-3 text-xs font-bold text-gray-300 transition hover:bg-white/5">Cancelar</button><button type="submit" disabled={carregandoImagem} className="rounded-xl bg-purple-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-purple-500 disabled:cursor-wait disabled:opacity-60">{produtoEditando ? 'Salvar alterações' : 'Adicionar ao catálogo'}</button></div>
          </form>
        </section>
      </div>}
    </main>
  );
}
