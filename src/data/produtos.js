const imagem = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`;

// Cardápio de demonstração da Chapa Quente.
export const produtosFixos = [
  { id: 1, nome: 'Chapa Quente Clássico', preco: 32.9, categoria: 'Hambúrgueres', descricao: 'Burger artesanal 160g, queijo cheddar, alface, tomate e molho da casa.', imagem: imagem('photo-1568901346375-23c9450c58cd'), selo: 'Mais pedido', options: { 'Ponto da carne': ['Ao ponto', 'Bem passado'], Adicionais: ['Sem adicionais', 'Bacon', 'Ovo'] } },
  { id: 2, nome: 'Duplo Cheddar', preco: 39.9, categoria: 'Hambúrgueres', descricao: 'Dois burgers suculentos, cheddar cremoso e cebola caramelizada.', imagem: imagem('photo-1553979459-d2229ba7433a'), selo: 'Favorito' },
  { id: 3, nome: 'Bacon na Brasa', preco: 36.9, categoria: 'Hambúrgueres', descricao: 'Burger 160g, bacon crocante, queijo prato e maionese defumada.', imagem: imagem('photo-1550547660-d9450f859349'), selo: 'Defumado' },
  { id: 4, nome: 'Veggie da Casa', preco: 31.9, categoria: 'Hambúrgueres', descricao: 'Burger de grão-de-bico, queijo, rúcula e molho de ervas no pão brioche.', imagem: imagem('photo-1520072959219-c595dc870360'), selo: 'Vegetariano' },
  { id: 5, nome: 'Batata Crocante', preco: 18.9, categoria: 'Acompanhamentos', descricao: 'Porção generosa de batatas douradas com páprica da casa.', imagem: imagem('photo-1573080496219-bb080dd4f877'), selo: 'Pra dividir' },
  { id: 6, nome: 'Anéis de Cebola', preco: 19.9, categoria: 'Acompanhamentos', descricao: 'Anéis empanados e crocantes, acompanhados de molho especial.', imagem: imagem('photo-1639024471283-03518883512d'), selo: 'Crocante' },
  { id: 7, nome: 'Milkshake de Chocolate', preco: 17.9, categoria: 'Bebidas', descricao: 'Leite, sorvete de chocolate e calda. Cremoso do primeiro ao último gole.', imagem: imagem('photo-1572490122747-3968b75cc699'), selo: 'Geladinho' },
  { id: 8, nome: 'Refrigerante Lata', preco: 7.5, categoria: 'Bebidas', descricao: 'Lata 350 ml bem gelada. Consulte os sabores disponíveis.', imagem: imagem('photo-1629203851122-3726ecdf080e'), selo: '350 ml' },
  { id: 9, nome: 'Brownie com Sorvete', preco: 18.9, categoria: 'Sobremesas', descricao: 'Brownie quentinho de chocolate com uma bola de sorvete de creme.', imagem: imagem('photo-1606313564200-e75d5e30476c'), selo: 'Sobremesa' },
];
