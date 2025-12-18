/**
 * Validação de CPF (Brasil)
 */
export function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digito1 = resto >= 10 ? 0 : resto;
  if (digito1 !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digito2 = resto >= 10 ? 0 : resto;
  if (digito2 !== parseInt(cpf.charAt(10))) return false;

  return true;
}

/**
 * Validação de CNPJ (Brasil)
 */
export function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
}

/**
 * Remove formatação de CPF/CNPJ (mantém apenas números)
 */
export function limparFormatacao(valor: string): string {
  return valor.replace(/[^\d]/g, '');
}

/**
 * Formata CPF
 */
export function formatarCPF(cpf: string): string {
  cpf = cpf.replace(/[^\d]/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ
 */
export function formatarCNPJ(cnpj: string): string {
  cnpj = cnpj.replace(/[^\d]/g, '');
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Converte CPF/CNPJ para email fake (para Supabase Auth)
 * Usa formato valido com subdominio
 */
export function docToEmail(doc: string): string {
  const cleanDoc = doc.replace(/[^\d]/g, '');
  return `user${cleanDoc}@cupons.app`;
}

/**
 * Gera um hash aleatório de 12 caracteres para cupom
 */
export function gerarHashCupom(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let hash = '';
  for (let i = 0; i < 12; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

/**
 * Formata data para YYYY-MM-DD
 */
export function formatarData(data: Date | string): string {
  const dateObj = typeof data === 'string' ? new Date(data) : data;
  return dateObj.toLocaleDateString('pt-BR');
}

/**
 * Verifica se uma data está dentro do período
 */
export function dentroDoPerido(dataInicio: string | Date, dataFim: string | Date): boolean {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const inicio = typeof dataInicio === 'string' ? new Date(dataInicio) : dataInicio;
  inicio.setHours(0, 0, 0, 0);
  
  const fim = typeof dataFim === 'string' ? new Date(dataFim) : dataFim;
  fim.setHours(0, 0, 0, 0);
  
  return hoje >= inicio && hoje <= fim;
}

/**
 * Formata percentual para exibição
 */
export function formatarPercentual(valor: number): string {
  return `${(valor * 100).toFixed(0)}%`;
}

/**
 * Máscara de telefone
 */
export function formatarTelefone(telefone: string): string {
  telefone = telefone.replace(/[^\d]/g, '');
  if (telefone.length === 11) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (telefone.length === 10) {
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
}

/**
 * Formata CEP
 */
export function formatarCEP(cep: string): string {
  cep = cep.replace(/[^\d]/g, '');
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}
