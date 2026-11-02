import type { Cliente, Estado } from './types';
import { validarInteiroPositivo, validarTexto } from './utils';

function validarDadosCliente(cliente: Cliente): void {
  validarInteiroPositivo(cliente.id, 'ID do cliente');
  validarTexto(cliente.nome, 'Nome do cliente');
  validarTexto(cliente.email, 'E-mail do cliente');
  // Validação simples e compatível com o escopo: não é verificação real de caixa postal.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email.trim())) {
    throw new Error('Informe um e-mail em formato válido.');
  }
}

export function cadastrarCliente(estado: Estado, cliente: Cliente): Cliente {
  validarDadosCliente(cliente);
  if (estado.clientes.some((atual) => atual.id === cliente.id)) {
    throw new Error(`Já existe cliente com ID ${cliente.id}.`);
  }
  const email = cliente.email.trim().toLowerCase();
  if (estado.clientes.some((atual) => atual.email.toLowerCase() === email)) {
    throw new Error(`Já existe cliente com o e-mail ${email}.`);
  }
  const novo = { ...cliente, nome: cliente.nome.trim(), email };
  estado.clientes.push(novo);
  return { ...novo };
}

export function listarClientes(estado: Estado): Cliente[] {
  return estado.clientes.map((cliente) => ({ ...cliente }));
}

export function buscarClientePorId(estado: Estado, id: number): Cliente | undefined {
  const cliente = estado.clientes.find((atual) => atual.id === id);
  return cliente ? { ...cliente } : undefined;
}
