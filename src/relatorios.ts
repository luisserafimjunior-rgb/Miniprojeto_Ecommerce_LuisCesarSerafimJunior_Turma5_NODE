import type { Estado, ResumoVendas } from './types';
import { paraCentavos, paraReais, somarCentavos } from './utils';

export function gerarResumoVendas(estado: Estado): ResumoVendas {
  const faturamentoEmCentavos = estado.pedidos.reduce((total, pedido) => {
    return somarCentavos(total, paraCentavos(pedido.total));
  }, 0);
  const unidadesVendidas = estado.pedidos.reduce((total, pedido) => {
    return total + pedido.itens.reduce((soma, item) => soma + item.quantidade, 0);
  }, 0);
  const quantidadeEmEstoque = estado.produtos.reduce((soma, produto) => {
    return soma + produto.estoque;
  }, 0);
  return {
    quantidadePedidos: estado.pedidos.length,
    produtosCadastrados: estado.produtos.length,
    quantidadeEmEstoque,
    unidadesVendidas,
    faturamento: paraReais(faturamentoEmCentavos)
  };
}

export function gerarRelatorioDeEstoque(estado: Estado) {
  return estado.produtos.map((produto) => ({
    id: produto.id,
    nome: produto.nome,
    estoque: produto.estoque,
    valorTotalEmEstoque: paraReais(paraCentavos(produto.preco) * produto.estoque)
  }));
}
