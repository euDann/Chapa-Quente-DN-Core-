# Chapa Quente

Cardápio online com carrinho e pedido pré-preenchido para enviar pelo WhatsApp.

## Rodar localmente

```sh
npm install
npm run dev
```

## Configurar a loja

- Em `src/config/loja.js`, preencha `whatsappLoja` com DDI, DDD e número, somente dígitos. Exemplo: `5511999999999`.
- Em `src/App.jsx`, atualize os itens, descrições e preços do array `cardapio` para refletir o cardápio real.
- Os preços e produtos atuais são demonstrativos.

Com o número configurado, o botão do carrinho abre uma conversa com o pedido pronto para a loja confirmar.
