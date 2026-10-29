// Informe o WhatsApp com código do país e DDD, somente números. Exemplo: 5511999999999
export const whatsappLoja = '';

export const formatarPreco = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
