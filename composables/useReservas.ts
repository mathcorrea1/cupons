import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import type { CupomAssociado } from '~/types'

export const useReservas = () => {
  const supabase = useSupabaseClient()
  
  const reservas = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchReservasByAssociado = async (associadoId: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('cupom_associado')
        .select(`
          *,
          cupom:cupom(
            *,
            comercio:comercio(*),
            categoria:categoria(*)
          )
        `)
        .eq('cpf_associado', associadoId)
        .order('dta_cupom_associado', { ascending: false })

      if (fetchError) throw fetchError

      // Mapear resultado do SQL para TypeScript
      const mappedData = data?.map((reserva: any) => ({
        id: reserva.id_cupom_associado,
        cupom_id: reserva.num_cupom,
        associado_id: reserva.cpf_associado,
        data_reserva: reserva.dta_cupom_associado,
        data_uso: reserva.dta_uso_cupom_associado,
        usado: !!reserva.dta_uso_cupom_associado,
        cupom: reserva.cupom ? {
          id: reserva.cupom.num_cupom,
          titulo: reserva.cupom.tit_cupom,
          data_emissao: reserva.cupom.dta_emissao_cupom,
          data_inicio: reserva.cupom.dta_inicio_cupom,
          data_fim: reserva.cupom.dta_termino_cupom,
          percentual_desconto: Math.round(reserva.cupom.per_desc_cupom * 100),
          comercio_id: reserva.cupom.cnpj_comercio,
          ativo: true,
          comercio: reserva.cupom.comercio ? {
            razao_social: reserva.cupom.comercio.raz_social_comercio,
            nome_fantasia: reserva.cupom.comercio.nom_fantasia_comercio,
            endereco: reserva.cupom.comercio.end_comercio,
            bairro: reserva.cupom.comercio.bai_comercio,
            cidade: reserva.cupom.comercio.cid_comercio,
            uf: reserva.cupom.comercio.uf_comercio,
            cep: reserva.cupom.comercio.cep_comercio,
            email: reserva.cupom.comercio.email_comercio,
            cnpj: reserva.cupom.comercio.cnpj_comercio,
            categoria_id: reserva.cupom.comercio.id_categoria,
            auth_user_id: reserva.cupom.comercio.auth_user_id,
            ativo: true
          } : undefined,
          categoria: reserva.cupom.categoria ? {
            id: reserva.cupom.categoria.id_categoria,
            nome: reserva.cupom.categoria.nom_categoria
          } : undefined
        } : undefined
      })) || []

      reservas.value = mappedData
      return { data: mappedData, error: null }
    } catch (e: any) {
      error.value = e.message
      return { data: null, error: e.message }
    } finally {
      loading.value = false
    }
  }

  const fetchReservasByCupom = async (cupomId: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('cupom_associado')
        .select(`
          *,
          associado:associado(*)
        `)
        .eq('num_cupom', cupomId)
        .order('dta_cupom_associado', { ascending: false })

      if (fetchError) throw fetchError

      // Mapear resultado do SQL para TypeScript
      const mappedData = data?.map((reserva: any) => ({
        id: reserva.id_cupom_associado,
        cupom_id: reserva.num_cupom,
        associado_id: reserva.cpf_associado,
        data_reserva: reserva.dta_cupom_associado,
        data_uso: reserva.dta_uso_cupom_associado,
        usado: !!reserva.dta_uso_cupom_associado,
        associado: reserva.associado ? {
          cpf: reserva.associado.cpf_associado,
          nome: reserva.associado.nom_associado,
          data_nascimento: reserva.associado.dtn_associado,
          endereco: reserva.associado.end_associado,
          bairro: reserva.associado.bai_associado,
          cep: reserva.associado.cep_associado,
          cidade: reserva.associado.cid_associado,
          uf: reserva.associado.uf_associado,
          celular: reserva.associado.cel_associado,
          email: reserva.associado.email_associado,
          auth_user_id: reserva.associado.auth_user_id,
          ativo: true
        } : undefined
      })) || []

      return { data: mappedData, error: null }
    } catch (e: any) {
      error.value = e.message
      return { data: [], error: e.message }
    } finally {
      loading.value = false
    }
  }

  const createReserva = async (reservaData: Partial<CupomAssociado>) => {
    loading.value = true
    error.value = null

    try {
      // Mapear TypeScript para schema do banco
      const dbData: any = {
        num_cupom: reservaData.cupom_id,
        cpf_associado: reservaData.associado_id,
        dta_cupom_associado: reservaData.data_reserva || new Date().toISOString().split('T')[0]
      }

      const { data, error: insertError } = await supabase
        .from('cupom_associado')
        .insert([dbData] as any)
        .select()
        .single() as { data: any, error: any }

      if (insertError) throw insertError

      // Mapear resultado
      const mappedResult = {
        id: data.id_cupom_associado,
        cupom_id: data.num_cupom,
        associado_id: data.cpf_associado,
        data_reserva: data.dta_cupom_associado,
        data_uso: data.dta_uso_cupom_associado,
        usado: !!data.dta_uso_cupom_associado
      }

      return { data: mappedResult, error: null }
    } catch (e: any) {
      error.value = e.message
      return { data: null, error: e.message }
    } finally {
      loading.value = false
    }
  }

  const validarUso = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      // Buscar a reserva
      const { data: reserva, error: fetchError } = await supabase
        .from('cupom_associado')
        .select('*')
        .eq('id_cupom_associado', id)
        .single() as { data: any, error: any }

      if (fetchError) throw fetchError
      if (!reserva) throw new Error('Reserva não encontrada')

      // Verificar se já foi usado
      if (reserva.dta_uso_cupom_associado) {
        throw new Error('Este cupom já foi utilizado')
      }

      // Marcar como usado
      const { data, error: updateError } = await (supabase
        .from('cupom_associado') as any)
        .update({
          dta_uso_cupom_associado: new Date().toISOString().split('T')[0]
        })
        .eq('id_cupom_associado', id)
        .select()
        .single() as { data: any, error: any }

      if (updateError) throw updateError

      // Mapear resultado
      const mappedResult = {
        id: data.id_cupom_associado,
        cupom_id: data.num_cupom,
        associado_id: data.cpf_associado,
        data_reserva: data.dta_cupom_associado,
        data_uso: data.dta_uso_cupom_associado,
        usado: !!data.dta_uso_cupom_associado
      }

      return { data: mappedResult, error: null }
    } catch (e: any) {
      error.value = e.message
      return { data: null, error: e.message }
    } finally {
      loading.value = false
    }
  }

  const verificarReservaExistente = async (cupomId: string, associadoId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('CUPOM_ASSOCIADO')
        .select('id_cupom_associado')
        .eq('num_cupom', cupomId)
        .eq('cpf_associado', associadoId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      return !!data
    } catch (e) {
      return false
    }
  }

  return {
    reservas,
    loading,
    error,
    fetchReservasByAssociado,
    fetchReservasByCupom,
    createReserva,
    validarUso,
    verificarReservaExistente
  }
}
