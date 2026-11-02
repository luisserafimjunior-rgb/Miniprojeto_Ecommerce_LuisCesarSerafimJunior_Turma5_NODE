import { criarEstadoInicial } from './dados';
import { cadastrarProduto, atualizarProduto, buscarProdutoPorId, buscarProdutosPorNome,
  filtrarProdutosPorCategoria, listarProdutos, removerProduto } from './produtos';
import { cadastrarCliente, buscarClientePorId, listarClientes } from './clientes';
import { adicionarAoCarrinho, alterarQuantidade, removerDoCarrinho,
  detalharCarrinho, calcularTotalCarrinho } from './carrinho';
import { consultarPedidosPorCliente, finalizarPedido, listarPedidos } from './pedidos';
import { gerarRelatorioDeEstoque, gerarResumoVendas } from './relatorios';

const estado = criarEstadoInicial();

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function secao(titulo: string): void {
  console.log(`\n========== ${titulo} ==========`);
}

function demonstrarErro(titulo: string, executar: () => void): void {
  try {
    executar();
    console.log(`FALHA NO TESTE: ${titulo} não provocou erro.`);
  } catch (erro: unknown) {
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    console.log(`ERRO ESPERADO (${titulo}): ${mensagem}`);
  }
}

secao('MINIPROJETO E-COMMERCE | LUIS CESAR SERAFIM JUNIOR | TURMA 5 NODE');
secao('1. CATÁLOGO DE PRODUTOS');
console.table(listarProdutos(estado));
cadastrarProduto(estado, { id: 5, nome: 'Webcam', categoria: 'Acessórios', preco: 199.9, estoque: 6 });
console.log('Produto cadastrado:', buscarProdutoPorId(estado, 5));
console.log('Busca parcial "note":', buscarProdutosPorNome(estado, 'note'));
console.log('Categoria acessórios:', filtrarProdutosPorCategoria(estado, 'acessorios'));
console.log('Atualização:', atualizarProduto(estado, 5, { preco: 179.9, estoque: 7 }));
removerProduto(estado, 5);
console.log('Produto 5 removido:', buscarProdutoPorId(estado, 5) === undefined);

secao('2. CLIENTES');
console.table(listarClientes(estado));
console.log('Cliente por ID:', buscarClientePorId(estado, 1));
console.log('Novo cliente:', cadastrarCliente(estado, {
  id: 4, nome: 'Luis Cesar Serafim Junior', email: 'luis@example.com'
}));


secao('3. CARRINHO E CÁLCULOS');

adicionarAoCarrinho(estado, 2, 1);
adicionarAoCarrinho(estado, 2, 1);
adicionarAoCarrinho(estado, 1, 1);
adicionarAoCarrinho(estado, 4, 1);

alterarQuantidade(estado, 2, 3);
removerDoCarrinho(estado, 4);

console.table(detalharCarrinho(estado));

console.log(
  'TOTAL DO CARRINHO:',
  moeda.format(calcularTotalCarrinho(estado))
);

secao('4. FINALIZAÇÃO E CONSULTA DE PEDIDOS');
const pedido = finalizarPedido(estado, 4);
console.log('Pedido finalizado:', JSON.stringify(pedido, null, 2));
console.log('Pedidos do cliente 4:', JSON.stringify(consultarPedidosPorCliente(estado, 4), null, 2));
console.log('Todos os pedidos:', JSON.stringify(listarPedidos(estado), null, 2));
console.log('Estoque do mouse após compra:', buscarProdutoPorId(estado, 2)?.estoque);

secao('5. RELATÓRIOS');
console.table(gerarRelatorioDeEstoque(estado));
console.log('RESUMO:', gerarResumoVendas(estado));

secao('6. TESTES DE SITUAÇÕES INVÁLIDAS');
demonstrarErro('preço negativo', () => cadastrarProduto(estado, {
  id: 99, nome: 'Produto inválido', categoria: 'Teste', preco: -50, estoque: 1
}));
demonstrarErro('quantidade maior que estoque', () => adicionarAoCarrinho(estado, 1, 999));
demonstrarErro('carrinho vazio', () => finalizarPedido(estado, 1));
demonstrarErro('cliente com e-mail duplicado', () => cadastrarCliente(estado, {
  id: 5, nome: 'Duplicado', email: 'ANA@example.com'
}));

secao('FIM DA DEMONSTRAÇÃO');
