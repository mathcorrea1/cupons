// Database Tables Types
export interface Categoria {
  id: number
  nome: string
  created_at?: string
}

export interface Comercio {
  id: string
  auth_user_id: string
  cnpj: string
  razao_social: string
  nome_fantasia: string
  categoria_id: number
  endereco?: string
  bairro?: string
  cep?: string
  cidade?: string
  uf?: string
  telefone?: string
  email: string
  ativo: boolean
  created_at?: string
  updated_at?: string
  // Relations
  categoria?: Categoria
}

export interface Associado {
  id: string
  auth_user_id: string
  cpf: string
  nome: string
  data_nascimento?: string
  endereco?: string
  bairro?: string
  cep?: string
  cidade?: string
  uf?: string
  celular?: string
  email: string
  ativo: boolean
  created_at?: string
  updated_at?: string
}

export interface Cupom {
  id: string
  comercio_id: string
  titulo: string
  descricao?: string
  percentual_desconto: number
  data_inicio: string
  data_fim: string
  data_emissao?: string
  ativo: boolean
  // Relations
  comercio?: Comercio
  categoria?: Categoria
}

export interface CupomAssociado {
  id: number
  cupom_id: string
  associado_id: string
  data_reserva: string
  data_uso?: string
  usado: boolean
  // Relations
  cupom?: Cupom
  associado?: Associado
}

// Extended Types
export interface CupomWithDetails extends Cupom {
  comercio: Comercio
  categoria: Categoria
  reservas?: { count: number }
}

export interface ReservaWithDetails extends CupomAssociado {
  cupom: CupomWithDetails
}

// Form DTOs (Data Transfer Objects)
export interface CadastroComerciante {
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  categoriaId: number
  endereco: string
  bairro: string
  cep: string
  cidade: string
  uf: string
  telefone: string
  email: string
  senha: string
}

export interface CadastroMorador {
  cpf: string
  nome: string
  dataNascimento: string
  endereco: string
  bairro: string
  cep: string
  cidade: string
  uf: string
  celular: string
  email: string
  senha: string
}

export interface CupomFormData {
  titulo: string
  descricao?: string
  categoriaId: number | undefined
  percentualDesconto: number
  dataInicio: string
  dataFim: string
  quantidadeTotal?: number
}

// Enums
export enum TipoUsuario {
  COMERCIANTE = 'comerciante',
  MORADOR = 'morador'
}

// Utility Types
export type TableColumn = {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  format?: (value: any) => string
}
