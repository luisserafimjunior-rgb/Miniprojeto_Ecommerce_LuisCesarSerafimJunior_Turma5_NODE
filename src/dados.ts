import type { Estado } from './types';

// A cada chamada, um novo conjunto de dados é criado (sem estado compartilhado).
export function criarEstadoInicial(): Estado {
  return {
    produtos: [
      { id: 1, nome: 'Notebook', categoria: 'Informática', preco: 2500, estoque: 5 },
      { id: 2, nome: 'Mouse', categoria: 'Acessórios', preco: 50, estoque: 10 },
      { id: 3, nome: 'Monitor', categoria: 'Informática', preco: 900, estoque: 4 },
      { id: 4, nome: 'Teclado', categoria: 'Acessórios', preco: 120, estoque: 8 }
    ],
    // O enunciado exige pelo menos três clientes já cadastrados.
    clientes: [
      { id: 1, nome: 'Ana Silva', email: 'ana@example.com' },
      { id: 2, nome: 'Bruno Costa', email: 'bruno@example.com' },
      { id: 3, nome: 'Carla Souza', email: 'carla@example.com' }
    ],
    carrinho: [],
    pedidos: [],
    proximoPedidoId: 1
  };
}
