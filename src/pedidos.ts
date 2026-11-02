import type { Estado, ItemPedido, Pedido } from './types';
import { multiplicarCentavos, paraCentavos, paraReais, somarCentavos } from './utils';

// Cópia profunda das listas, para não expor os objetos de histórico a alterações.
function copiarPedido(pedido: Pedido): Pedido {
  return { ...pedido, itens: pedido.itens.map((item) => ({ ...item })) };
}

export function finalizarPedido(estado: Estado, clienteId: number): Pedido {
  const cliente = estado.clientes.find((atual) => atual.id === clienteId);
  if (!cliente) throw new Error(`Cliente ${clienteId} não existe.`);
  if (estado.carrinho.length === 0) throw new Error('Não é possível finalizar carrinho vazio.');

  
const produtosVistos = new Set<number>();

for (const item of estado.carrinho) {
  if (produtosVistos.has(item.produtoId)) {
    throw new Error('Produto duplicado no carrinho.');
  }

  produtosVistos.add(item.produtoId);
}

  // ETAPA 1: validar TUDO e preparar o histórico ANTES de mexer no estoque.
  const itens: ItemPedido[] = estado.carrinho.map((item) => {
    const produto = estado.produtos.find((atual) => atual.id === item.produtoId);
    if (!produto) throw new Error(`Produto ${item.produtoId} não existe mais.`);
    if (!Number.isSafeInteger(item.quantidade) || item.quantidade <= 0) {
      throw new Error('Quantidade inválida no carrinho.');
    }
    if (produto.estoque < item.quantidade) {
      throw new Error(`Estoque insuficiente para ${produto.nome}; pedido cancelado.`);
    }
    const subtotal = multiplicarCentavos(paraCentavos(produto.preco), item.quantidade);
    return {
      produtoId: produto.id,
      nomeProduto: produto.nome,
      quantidade: item.quantidade,
      precoUnitario: produto.preco,
      subtotal: paraReais(subtotal)
    };
  });
  const totalCentavos = itens.reduce((acumulador, item) => {
    return somarCentavos(acumulador, paraCentavos(item.subtotal));
  }, 0);
  const novoId = estado.proximoPedidoId;
  if (!Number.isSafeInteger(novoId) || novoId <= 0 || !Number.isSafeInteger(novoId + 1)) {
    throw new Error('Limite de identificadores de pedidos atingido.');
  }
  const pedido: Pedido = {
    id: novoId,
    clienteId: cliente.id,
    itens,
    total: paraReais(totalCentavos),
    data: new Date().toISOString()
  };

  // ETAPA 2: efetivar a compra. Só acontece quando todas as validações passaram.
  for (const item of itens) {
    const produto = estado.produtos.find((atual) => atual.id === item.produtoId)!;
    produto.estoque -= item.quantidade;
  }
  estado.pedidos.push(pedido);
  estado.proximoPedidoId += 1;
  estado.carrinho.length = 0; // Esvazia o carrinho depois de comprar.
  return copiarPedido(pedido);
}

export function listarPedidos(estado: Estado): Pedido[] {
  return estado.pedidos.map(copiarPedido);
}

export function consultarPedidosPorCliente(estado: Estado, clienteId: number): Pedido[] {
  return estado.pedidos.filter((pedido) => pedido.clienteId === clienteId).map(copiarPedido);
}
