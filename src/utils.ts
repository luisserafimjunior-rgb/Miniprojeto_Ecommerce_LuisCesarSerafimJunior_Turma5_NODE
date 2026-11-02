// Evita problemas de ponto flutuante: a soma monetária é feita em centavos.
export function paraCentavos(valorEmReais: number): number {
  if (!Number.isFinite(valorEmReais) || valorEmReais < 0) {
    throw new Error('Valor monetário precisa ser um número finito e não negativo.');
  }
  const centavos = Math.round(valorEmReais * 100);
  if (!Number.isSafeInteger(centavos)) {
    throw new Error('Valor monetário acima do limite seguro.');
  }
  return centavos;
}

export function paraReais(centavos: number): number {
  if (!Number.isSafeInteger(centavos)) {
    throw new Error('Total em centavos acima do limite seguro.');
  }
  return centavos / 100;
}

export function validarPreco(preco: number): void {
  const centavos = paraCentavos(preco);
  if (centavos <= 0 || Math.abs(preco * 100 - centavos) > 0.000001) {
    throw new Error('O preço deve ser maior que zero e ter até duas casas decimais.');
  }
}

export function validarInteiroNaoNegativo(valor: number, campo: string): void {
  if (!Number.isSafeInteger(valor) || valor < 0) {
    throw new Error(`${campo} deve ser um número inteiro não negativo.`);
  }
}

export function validarInteiroPositivo(valor: number, campo: string): void {
  if (!Number.isSafeInteger(valor) || valor <= 0) {
    throw new Error(`${campo} deve ser um número inteiro positivo.`);
  }
}

export function validarTexto(texto: string, campo: string): void {
  if (typeof texto !== 'string' || texto.trim().length === 0) {
    throw new Error(`${campo} é obrigatório.`);
  }
}

// Ignora maiúsculas, minúsculas e acentos nas pesquisas.
export function normalizarTexto(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function somarCentavos(a: number, b: number): number {
  const resultado = a + b;
  if (!Number.isSafeInteger(resultado)) {
    throw new Error('Total em centavos acima do limite seguro.');
  }
  return resultado;
}

export function multiplicarCentavos(precoCentavos: number, quantidade: number): number {
  const resultado = precoCentavos * quantidade;
  if (!Number.isSafeInteger(resultado)) {
    throw new Error('Subtotal em centavos acima do limite seguro.');
  }
  return resultado;
}
