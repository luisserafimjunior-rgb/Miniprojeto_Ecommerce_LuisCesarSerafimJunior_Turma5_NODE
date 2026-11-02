// Interfaces descrevem a estrutura dos dados; não criam objetos por si mesmas.
export interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number; // Em reais, com até duas casas decimais.
  estoque: number;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
}

export interface ItemCarrinho {
  produtoId: number;
  quantidade: number;
}

// Os itens de um pedido guardam o preço da data da compra (histórico imutável).
export interface ItemPedido {
  produtoId: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  itens: ItemPedido[];
  total: number;
  data: string;
}

// A 'base de dados' em memória é passada como parâmetro para ser fácil testar.
export interface Estado {
  produtos: Produto[];
  clientes: Cliente[];
  carrinho: ItemCarrinho[];
  pedidos: Pedido[];
  proximoPedidoId: number;
}

export interface ItemCarrinhoDetalhado {
  produtoId: number;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
}

export interface ResumoVendas {
  quantidadePedidos: number;
  produtosCadastrados: number;
  quantidadeEmEstoque: number;
  unidadesVendidas: number;
  faturamento: number;
}
