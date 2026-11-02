const test = require('node:test');
const assert = require('node:assert/strict');
const { criarEstadoInicial } = require('../dist/dados.js');
const produtos = require('../dist/produtos.js');
const clientes = require('../dist/clientes.js');
const carrinho = require('../dist/carrinho.js');
const pedidos = require('../dist/pedidos.js');
const relatorios = require('../dist/relatorios.js');

// Cada teste começa com dados novos; um teste não interfere em outro.
test('o sistema começa com pelo menos 3 clientes', () => {
  assert.ok(clientes.listarClientes(criarEstadoInicial()).length >= 3);
});

test('produto cadastra, lista, encontra por ID e retorna cópias', () => {
  const estado = criarEstadoInicial();
  produtos.cadastrarProduto(estado, { id: 10, nome: 'Tablet', categoria: 'Eletrônicos', preco: 800, estoque: 2 });
  assert.equal(produtos.buscarProdutoPorId(estado, 10).nome, 'Tablet');
  const resposta = produtos.listarProdutos(estado);
  resposta[0].nome = 'MUDADO FORA DO SISTEMA';
  assert.equal(produtos.buscarProdutoPorId(estado, 1).nome, 'Notebook');
});

test('rejeita produto com ID repetido, nome vazio, preço ruim ou estoque negativo', () => {
  const estado = criarEstadoInicial();
  assert.throws(() => produtos.cadastrarProduto(estado, { id: 1, nome: 'Outro', categoria: 'A', preco: 1, estoque: 1 }));
  assert.throws(() => produtos.cadastrarProduto(estado, { id: 20, nome: ' ', categoria: 'A', preco: 1, estoque: 1 }));
  assert.throws(() => produtos.cadastrarProduto(estado, { id: 20, nome: 'A', categoria: 'A', preco: 0, estoque: 1 }));
  assert.throws(() => produtos.cadastrarProduto(estado, { id: 20, nome: 'A', categoria: 'A', preco: -1, estoque: 1 }));
  assert.throws(() => produtos.cadastrarProduto(estado, { id: 20, nome: 'A', categoria: 'A', preco: 1.234, estoque: 1 }));
  assert.throws(() => produtos.cadastrarProduto(estado, { id: 20, nome: 'A', categoria: 'A', preco: 1, estoque: -1 }));
  assert.equal(estado.produtos.length, 4);
});

test('busca parcial e categoria ignoram maiúsculas e acentos', () => {
  const estado = criarEstadoInicial();
  assert.equal(produtos.buscarProdutosPorNome(estado, 'NOTE').length, 1);
  assert.equal(produtos.filtrarProdutosPorCategoria(estado, 'INFORMATICA').length, 2);
});

test('atualiza produto sem trocar ID e remove quando não está no carrinho', () => {
  const estado = criarEstadoInicial();
  const atualizado = produtos.atualizarProduto(estado, 2, { nome: 'Mouse sem fio', preco: 75, estoque: 5 });
  assert.equal(atualizado.id, 2);
  assert.equal(atualizado.preco, 75);
  produtos.removerProduto(estado, 2);
  assert.equal(produtos.buscarProdutoPorId(estado, 2), undefined);
  assert.throws(() => produtos.atualizarProduto(estado, 99, { nome: 'Nada' }));
});

test('clientes exigem nome/email e rejeitam IDs e emails duplicados', () => {
  const estado = criarEstadoInicial();
  clientes.cadastrarCliente(estado, { id: 8, nome: 'João', email: 'JOAO@EXAMPLE.COM' });
  assert.equal(clientes.buscarClientePorId(estado, 8).email, 'joao@example.com');
  assert.throws(() => clientes.cadastrarCliente(estado, { id: 8, nome: 'A', email: 'outro@example.com' }));
  assert.throws(() => clientes.cadastrarCliente(estado, { id: 9, nome: 'B', email: 'joao@EXAMPLE.com' }));
  assert.throws(() => clientes.cadastrarCliente(estado, { id: 9, nome: '', email: 'novo@example.com' }));
  assert.throws(() => clientes.cadastrarCliente(estado, { id: 9, nome: 'C', email: 'invalido' }));
});

test('carrinho acumula produto repetido, altera e remove sem duplicar', () => {
  const estado = criarEstadoInicial();
  carrinho.adicionarAoCarrinho(estado, 2, 1);
  carrinho.adicionarAoCarrinho(estado, 2, 2);
  assert.deepEqual(carrinho.listarItensCarrinho(estado), [{ produtoId: 2, quantidade: 3 }]);
  carrinho.alterarQuantidade(estado, 2, 4);
  assert.equal(carrinho.listarItensCarrinho(estado)[0].quantidade, 4);
  carrinho.removerDoCarrinho(estado, 2);
  assert.deepEqual(carrinho.listarItensCarrinho(estado), []);
});

test('carrinho rejeita quantidades inválidas, produto inexistente e falta de estoque', () => {
  const estado = criarEstadoInicial();
  assert.throws(() => carrinho.adicionarAoCarrinho(estado, 2, 0));
  assert.throws(() => carrinho.adicionarAoCarrinho(estado, 2, -1));
  assert.throws(() => carrinho.adicionarAoCarrinho(estado, 2, 1.5));
  assert.throws(() => carrinho.adicionarAoCarrinho(estado, 800, 1));
  assert.throws(() => carrinho.adicionarAoCarrinho(estado, 1, 6));
  assert.deepEqual(estado.carrinho, []);
});

test('subtotais e total usam centavos e evitam imprecisão de 0,1 + 0,2', () => {
  const estado = criarEstadoInicial();
  produtos.cadastrarProduto(estado, { id: 11, nome: 'A', categoria: 'Moedas', preco: 0.1, estoque: 1 });
  produtos.cadastrarProduto(estado, { id: 12, nome: 'B', categoria: 'Moedas', preco: 0.2, estoque: 1 });
  carrinho.adicionarAoCarrinho(estado, 11, 1);
  carrinho.adicionarAoCarrinho(estado, 12, 1);
  assert.equal(carrinho.calcularTotalCarrinho(estado), 0.3);
  assert.deepEqual(carrinho.detalharCarrinho(estado).map((i) => i.subtotal), [0.1, 0.2]);
});

test('finalizar compra gera pedido, diminui estoque e limpa carrinho', () => {
  const estado = criarEstadoInicial();
  carrinho.adicionarAoCarrinho(estado, 1, 1);
  carrinho.adicionarAoCarrinho(estado, 2, 2);
  const pedido = pedidos.finalizarPedido(estado, 1);
  assert.equal(pedido.id, 1);
  assert.equal(pedido.clienteId, 1);
  assert.equal(pedido.total, 2600);
  assert.equal(pedido.itens.length, 2);
  assert.equal(produtos.buscarProdutoPorId(estado, 1).estoque, 4);
  assert.equal(produtos.buscarProdutoPorId(estado, 2).estoque, 8);
  assert.deepEqual(estado.carrinho, []);
  assert.equal(pedidos.consultarPedidosPorCliente(estado, 1).length, 1);
  assert.equal(pedidos.consultarPedidosPorCliente(estado, 2).length, 0);
  assert.match(pedido.data, /^\d{4}-\d\d-\d\dT/);
});

test('não finaliza carrinho vazio ou cliente inexistente', () => {
  const estado = criarEstadoInicial();
  assert.throws(() => pedidos.finalizarPedido(estado, 1));
  carrinho.adicionarAoCarrinho(estado, 2, 1);
  assert.throws(() => pedidos.finalizarPedido(estado, 999));
  assert.equal(estado.pedidos.length, 0);
  assert.equal(estado.carrinho.length, 1);
});

test('compra com um item sem estoque não altera outro produto nem grava pedido', () => {
  const estado = criarEstadoInicial();
  carrinho.adicionarAoCarrinho(estado, 1, 1);
  carrinho.adicionarAoCarrinho(estado, 2, 2);
  produtos.atualizarProduto(estado, 2, { estoque: 1 }); // Alterado depois de adicionar ao carrinho.
  assert.throws(() => pedidos.finalizarPedido(estado, 1), /Estoque insuficiente/);
  assert.equal(produtos.buscarProdutoPorId(estado, 1).estoque, 5);
  assert.equal(produtos.buscarProdutoPorId(estado, 2).estoque, 1);
  assert.equal(estado.pedidos.length, 0);
  assert.equal(estado.carrinho.length, 2);
  assert.equal(estado.proximoPedidoId, 1);
});

test('pedido guarda preço do momento da compra, sem alterar o passado', () => {
  const estado = criarEstadoInicial();
  carrinho.adicionarAoCarrinho(estado, 2, 1);
  const pedido = pedidos.finalizarPedido(estado, 1);
  produtos.atualizarProduto(estado, 2, { preco: 700 });
  pedido.itens[0].precoUnitario = 99999; // Mudar a cópia não muda o histórico.
  const historico = pedidos.listarPedidos(estado);
  assert.equal(historico[0].itens[0].precoUnitario, 50);
  assert.equal(historico[0].total, 50);
});

test('remover do catálogo produto no carrinho é proibido', () => {
  const estado = criarEstadoInicial();
  carrinho.adicionarAoCarrinho(estado, 2, 1);
  assert.throws(() => produtos.removerProduto(estado, 2));
  assert.ok(produtos.buscarProdutoPorId(estado, 2));
});

test('pedidos recebem identificadores únicos e resumo reflete vendas', () => {
  const estado = criarEstadoInicial();
  carrinho.adicionarAoCarrinho(estado, 2, 1);
  assert.equal(pedidos.finalizarPedido(estado, 1).id, 1);
  carrinho.adicionarAoCarrinho(estado, 2, 2);
  assert.equal(pedidos.finalizarPedido(estado, 2).id, 2);
  const resumo = relatorios.gerarResumoVendas(estado);
  assert.equal(resumo.quantidadePedidos, 2);
  assert.equal(resumo.unidadesVendidas, 3);
  assert.equal(resumo.faturamento, 150);
  assert.equal(resumo.quantidadeEmEstoque, 24);
});
