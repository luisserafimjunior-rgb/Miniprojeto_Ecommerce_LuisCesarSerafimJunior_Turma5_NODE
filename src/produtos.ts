import type { Estado, Produto } from './types';
import {
  normalizarTexto, validarInteiroNaoNegativo,
  validarInteiroPositivo, validarPreco, validarTexto
} from './utils';

function validarDadosProduto(produto: Produto): void {
  validarInteiroPositivo(produto.id, 'ID do produto');
  validarTexto(produto.nome, 'Nome do produto');
  validarTexto(produto.categoria, 'Categoria');
  validarPreco(produto.preco);
  validarInteiroNaoNegativo(produto.estoque, 'Estoque');
}

export function cadastrarProduto(estado: Estado, produto: Produto): Produto {
  validarDadosProduto(produto);
  if (estado.produtos.some((atual) => atual.id === produto.id)) {
    throw new Error(`Já existe produto com ID ${produto.id}.`);
  }
  const novo = { ...produto, nome: produto.nome.trim(), categoria: produto.categoria.trim() };
  estado.produtos.push(novo);
  return { ...novo };
}

export function listarProdutos(estado: Estado): Produto[] {
  return estado.produtos.map((produto) => ({ ...produto }));
}

export function buscarProdutoPorId(estado: Estado, id: number): Produto | undefined {
  const produto = estado.produtos.find((item) => item.id === id);
  return produto ? { ...produto } : undefined;
}

export function buscarProdutosPorNome(estado: Estado, trecho: string): Produto[] {
  validarTexto(trecho, 'Trecho pesquisado');
  const busca = normalizarTexto(trecho);
  return listarProdutos(estado).filter((produto) => normalizarTexto(produto.nome).includes(busca));
}

export function filtrarProdutosPorCategoria(estado: Estado, categoria: string): Produto[] {
  validarTexto(categoria, 'Categoria pesquisada');
  const busca = normalizarTexto(categoria);
  return listarProdutos(estado).filter((produto) => normalizarTexto(produto.categoria) === busca);
}

export function atualizarProduto(
  estado: Estado,
  id: number,
  alteracoes: Partial<Omit<Produto, 'id'>>
): Produto {
  const indice = estado.produtos.findIndex((produto) => produto.id === id);
  if (indice === -1) throw new Error(`Produto ${id} não encontrado.`);
  const atual = estado.produtos[indice]!;
  const atualizado: Produto = {
    ...atual,
    ...alteracoes,
    id, // Mesmo que haja um 'id' inesperado, ele não será alterado.
  };
  validarDadosProduto(atualizado);
  atualizado.nome = atualizado.nome.trim();
  atualizado.categoria = atualizado.categoria.trim();
  estado.produtos[indice] = atualizado;
  return { ...atualizado };
}

export function removerProduto(estado: Estado, id: number): void {
  if (estado.carrinho.some((item) => item.produtoId === id)) {
    throw new Error('Remova o produto do carrinho antes de excluí-lo do catálogo.');
  }
  const indice = estado.produtos.findIndex((produto) => produto.id === id);
  if (indice === -1) throw new Error(`Produto ${id} não encontrado.`);
  estado.produtos.splice(indice, 1);
  // Pedidos anteriores preservam os dados comprados (snapshot).
}
