import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Package, CreditCard, User, LogOut, ChevronRight } from 'lucide-react'; 

export default function Perfil() {
  const fileInputRef = useRef(null);
  const [abaAtiva, setAbaAtiva] = useState('dados');
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [editandoPagamento, setEditandoPagamento] = useState(false);

  const [user, setUser] = useState({
    nome: localStorage.getItem('user-name') || "DANN CORE",
    email: localStorage.getItem('user-email') || "contato@dncore.com",
    bio: localStorage.getItem('user-bio') || "Especialista em Hardware de Alta Performance.",
    local: localStorage.getItem('user-local') || "Setor Delta-9, Rio de Janeiro",
    avatar: localStorage.getItem('user-avatar') || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Dann`,
    numCartao: localStorage.getItem('user-card-num') || "4550 1234 5678 4242",
    validade: localStorage.getItem('user-card-val') || "12/29",
    cvc: localStorage.getItem('user-card-cvc') || "824"
  });

  const historicoPedidos = [
    { 
      id: '5501', data: '10/04/2026', total: '850.00', status: 'Entregue', 
      itens: ['Teclado Mecânico Custom'],
      trajeto: [
        { hora: '08:00', loc: 'HUB Central DN', status: 'Carga Despachada' },
        { hora: '13:45', loc: 'Base Rio de Janeiro', status: 'Em triagem' },
        { hora: '17:20', loc: user.local, status: 'Entregue ao Operador' }
      ]
    },
    { 
      id: '5502', data: '11/04/2026', total: '420.00', status: 'Em Rota', 
      itens: ['Mouse Gamer Pro Wireless'],
      trajeto: [
        { hora: '09:15', loc: 'Centro de Distribuição', status: 'Processado' },
        { hora: '15:30', loc: 'Setor Primário', status: 'Em trânsito' }
      ]
    },
  ];

  const formatarMascara = (numero) => {
    if (!numero) return "**** **** **** ****";
    const ultimos = numero.replace(/\s/g, '').slice(-4);
    return `**** **** **** ${ultimos}`;
  };

  const handleSalvarTudo = () => {
    localStorage.setItem('user-name', user.nome);
    localStorage.setItem('user-email', user.email);
    localStorage.setItem('user-local', user.local);
    localStorage.setItem('user-card-num', user.numCartao);
    localStorage.setItem('user-card-val', user.validade);
    localStorage.setItem('user-card-cvc', user.cvc);
    setEditandoPagamento(false);
    alert("Protocolos de Segurança Atualizados!");
  };

  const handleLogout = () => {
    localStorage.removeItem('user-token');
    window.location.href = '/login';
  };

  const trocarFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({...user, avatar: reader.result});
        localStorage.setItem('user-avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 md:py-24 px-4 md:px-6 font-sans">
      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row gap-8">
        
        <aside className="w-full md:w-64 space-y-4">
          <div className="p-8 bg-[#0f1218] rounded-[2.5rem] border border-white/5 text-center relative overflow-hidden group">
            <div className="relative inline-block cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <div className="relative">
                <img src={user.avatar} className="w-24 h-24 mx-auto rounded-full border-2 border-purple-500/30 object-cover group-hover:brightness-50 transition-all" alt="Avatar" />
                <div className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full border-2 border-[#0f1218] shadow-lg transform translate-x-1 translate-y-1 opacity-90 group-hover:scale-110 transition-transform">
                  <Pencil size={12} className="text-white" />
                </div>
              </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={trocarFoto} accept="image/*" />
            <h2 className="font-[1000] uppercase italic tracking-tighter text-xl mt-4 leading-none">{user.nome}</h2>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-2 italic">Operador Nível 5</p>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: 'dados', label: 'Dados Pessoais', icon: <User size={14}/> },
              { id: 'pagamentos', label: 'Pagamentos', icon: <CreditCard size={14}/> },
              { id: 'historico', label: 'Histórico', icon: <Package size={14}/> }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => setAbaAtiva(item.id)} 
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${abaAtiva === item.id ? 'bg-purple-600 shadow-lg shadow-purple-500/20 text-white' : 'text-gray-500 hover:bg-white/5'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
            <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all mt-4">
              <LogOut size={14}/> Encerrar Sessão
            </button>
          </nav>
        </aside>

        <main className="flex-1 bg-[#0f1218] border border-white/5 rounded-[3.5rem] p-8 md:p-14 shadow-2xl relative">
          <AnimatePresence mode="wait">
            
            {abaAtiva === 'dados' && (
              <motion.div key="dados" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <h3 className="text-4xl font-[1000] uppercase italic tracking-tighter text-purple-500">Identidade Digital</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-600 ml-2 tracking-widest">Codename</label>
                    <input type="text" value={user.nome} onChange={e => setUser({...user, nome: e.target.value.toUpperCase()})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xs font-bold focus:border-purple-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-600 ml-2 tracking-widest">Endereço de Carga</label>
                    <input type="text" value={user.local} onChange={e => setUser({...user, local: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xs font-bold focus:border-purple-500 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-600 ml-2 tracking-widest">E-mail Operacional</label>
                    <input type="email" value={user.email} onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xs font-bold focus:border-purple-500 outline-none transition-all" />
                  </div>
                </div>
                <button onClick={handleSalvarTudo} className="bg-white text-black px-14 py-5 rounded-2xl font-[1000] uppercase tracking-widest text-[10px] hover:bg-purple-600 hover:text-white transition-all shadow-xl">Salvar Alterações</button>
              </motion.div>
            )}

            {abaAtiva === 'pagamentos' && (
              <motion.div key="pag" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <h3 className="text-4xl font-[1000] uppercase italic tracking-tighter text-purple-500">Cartão de Acesso</h3>
                
                <div className="relative w-full max-w-md h-56 bg-gradient-to-br from-gray-900 via-purple-900/40 to-black rounded-[2rem] border border-white/10 p-10 shadow-2xl overflow-hidden group">
                   <div className="w-14 h-10 bg-gradient-to-br from-yellow-400 to-yellow-700 rounded-lg mb-8 opacity-90 shadow-inner"></div>
                   <p className="text-2xl font-bold tracking-[0.3em] text-white drop-shadow-lg mb-8">
                     {formatarMascara(user.numCartao)}
                   </p>
                   <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500 mb-1">Card Holder</p>
                        <p className="text-xs font-black uppercase tracking-widest">{user.nome}</p>
                      </div>
                      <div className="flex gap-8 text-right">
                        <div>
                          <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500 mb-1">Expires</p>
                          <p className="text-xs font-black tracking-widest">{user.validade ? "**/**" : "00/00"}</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500 mb-1">CVC</p>
                          <p className="text-xs font-black tracking-widest">***</p>
                        </div>
                      </div>
                   </div>
                </div>

                {editandoPagamento ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-black/40 rounded-[2.5rem] border border-purple-500/20">
                    <div className="col-span-2 space-y-2">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Número do Cartão</label>
                      <input type="text" value={user.numCartao} onChange={e => setUser({...user, numCartao: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-purple-400 outline-none focus:border-purple-500" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Validade</label>
                      <input type="text" value={user.validade} onChange={e => setUser({...user, validade: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold outline-none text-white" placeholder="MM/AA" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">CVC</label>
                      <input type="text" value={user.cvc} onChange={e => setUser({...user, cvc: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold outline-none text-white" placeholder="***" />
                    </div>
                    <div className="col-span-full flex gap-4 mt-4">
                      <button onClick={handleSalvarTudo} className="flex-1 bg-purple-600 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">Sincronizar Dados</button>
                      <button onClick={() => setEditandoPagamento(false)} className="px-8 py-4 rounded-xl text-[10px] font-black uppercase border border-white/10 hover:bg-red-500 transition-all">Cancelar</button>
                    </div>
                  </motion.div>
                ) : (
                  <button onClick={() => {setUser({...user, numCartao: "", validade: "", cvc: ""}); setEditandoPagamento(true)}} className="bg-white/5 border border-white/10 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all shadow-lg hover:shadow-purple-500/20">
                    Reconfigurar Dados Sensíveis
                  </button>
                )}
              </motion.div>
            )}

            {abaAtiva === 'historico' && (
              <motion.div key="hist" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-4xl font-[1000] uppercase italic tracking-tighter text-purple-500">Logs de Carga</h3>
                <div className="grid gap-4">
                  {historicoPedidos.map(pedido => (
                    <div 
                      key={pedido.id} 
                      className={`p-8 bg-black/40 rounded-[2.5rem] border transition-all cursor-pointer flex justify-between items-center group ${pedidoSelecionado?.id === pedido.id ? 'border-purple-500 bg-purple-500/5' : 'border-white/5 hover:border-purple-500/30'}`} 
                      onClick={() => setPedidoSelecionado(pedido)}
                    >
                      <div>
                        <p className="text-[11px] font-[1000] uppercase tracking-widest text-white flex items-center gap-2">
                           <Package size={12} className="text-purple-500"/> Manifesto #{pedido.id}
                        </p>
                        <p className="text-[9px] text-gray-600 font-bold uppercase mt-1">{pedido.data}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`text-[10px] font-black italic uppercase ${pedido.status === 'Entregue' ? 'text-green-500' : 'text-yellow-500'}`}>{pedido.status}</span>
                        <ChevronRight size={14} className={`text-gray-700 group-hover:text-purple-500 transition-transform ${pedidoSelecionado?.id === pedido.id ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  ))}
                </div>

                <AnimatePresence>
                  {pedidoSelecionado && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="p-10 bg-black/60 border border-purple-500/20 rounded-[3rem] grid grid-cols-1 md:grid-cols-2 gap-12 relative mt-4">
                        <div>
                          <p className="text-[10px] font-black text-gray-600 uppercase mb-6 tracking-widest italic">Conteúdo Detectado</p>
                          <ul className="space-y-4">
                            {pedidoSelecionado.itens.map((item, i) => (
                              <li key={i} className="text-xs font-black uppercase text-white flex items-center gap-4">
                                <div className="w-1.5 h-1.5 bg-purple-500 rotate-45 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div> {item}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-10 pt-6 border-t border-white/5">
                            <p className="text-[9px] font-black text-gray-700 uppercase mb-1">Total Liquidado</p>
                            <p className="text-3xl font-[1000] italic text-purple-500">R$ {pedidoSelecionado.total}</p>
                          </div>
                        </div>

                        <div className="space-y-8">
                          <div>
                            <p className="text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest italic">Ponto de Entrega</p>
                            <p className="text-xs font-bold text-gray-300 uppercase leading-relaxed">{user.local}</p>
                          </div>
                          <div className="relative space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                            {pedidoSelecionado.trajeto.map((step, i) => (
                              <div key={i} className="relative pl-10">
                                <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-black transition-colors ${i === pedidoSelecionado.trajeto.length - 1 && pedidoSelecionado.status === 'Entregue' ? 'bg-green-500' : 'bg-purple-600'}`}></div>
                                <p className="text-[9px] font-black text-purple-500 mb-0.5">{step.hora}</p>
                                <p className="text-[11px] font-black uppercase text-white leading-tight">{step.loc}</p>
                                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">{step.status}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => setPedidoSelecionado(null)} className="absolute top-6 right-10 text-[9px] font-black text-red-500 uppercase tracking-widest border border-red-500/20 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all">Fechar Manifesto</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}