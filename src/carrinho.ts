import type { Estado, ItemCarrinho, ItemCarrinhoDetalhado } from './types';
import { multiplicarCentavos, paraCentavos, paraReais, somarCentavos, validarInteiroPositivo } from './utils';

function encontrarProdutoDisponivel(estado: Estado, produtoId: number) {
  const produto = estado.produtos.find((atual) => atual.id === produtoId);
  if (!produto) throw new Error(`Produto ${produtoId} não existe.`);
  return produto;
}

export function adicionarAoCarrinho(estado: Estado, produtoId: number, quantidade: number): void {
  validarInteiroPositivo(quantidade, 'Quantidade');
  const produto = encontrarProdutoDisponivel(estado, produtoId);
  const existente = estado.carrinho.find((item) => item.produtoId === produtoId);
  const novaQuantidade = (existente?.quantidade ?? 0) + quantidade;
  if (!Number.isSafeInteger(novaQuantidade) || novaQuantidade > produto.estoque) {
    throw new Error(`Estoque insuficiente: ${produto.nome} possui ${produto.estoque} unidade(s).`);
  }
  if (existente) {
    existente.quantidade = novaQuantidade; // Mesma linha é atualizada, não duplicada.
  } else {
    estado.carrinho.push({ produtoId, quantidade });
  }
}

export function alterarQuantidade(estado: Estado, produtoId: number, quantidade: number): void {
  validarInteiroPositivo(quantidade, 'Quantidade');
  const item = estado.carrinho.find((atual) => atual.produtoId === produtoId);
  if (!item) throw new Error('O produto não está no carrinho.');
  const produto = encontrarProdutoDisponivel(estado, produtoId);
  if (quantidade > produto.estoque) {
    throw new Error(`Estoque insuficiente para ${produto.nome}.`);
  }
  item.quantidade = quantidade;
}

export function removerDoCarrinho(estado: Estado, produtoId: number): void {
  const indice = estado.carrinho.findIndex((item) => item.produtoId === produtoId);
  if (indice === -1) throw new Error('O produto não está no carrinho.');
  estado.carrinho.splice(indice, 1);
}

export function listarItensCarrinho(estado: Estado): ItemCarrinho[] {
  return estado.carrinho.map((item) => ({ ...item }));
}

export function detalharCarrinho(estado: Estado): ItemCarrinhoDetalhado[] {
  return estado.carrinho.map((item) => {
    const produto = encontrarProdutoDisponivel(estado, item.produtoId);
    const precoCentavos = paraCentavos(produto.preco);
    const subtotalCentavos = multiplicarCentavos(precoCentavos, item.quantidade);
    return {
      produtoId: item.produtoId,
      nomeProduto: produto.nome,
      precoUnitario: produto.preco,
      quantidade: item.quantidade,
      subtotal: paraReais(subtotalCentavos)
    };
  });
}

export function calcularTotalCarrinho(estado: Estado): number {
  const centavos = detalharCarrinho(estado).reduce((acumulador, item) => {
    return somarCentavos(acumulador, paraCentavos(item.subtotal));
  }, 0);
  return paraReais(centavos);
}
