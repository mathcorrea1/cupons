import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Cupom, CupomWithDetails } from '~/types'

export const useCupons = () => {
  const supabase = useSupabaseClient()
  
  const cupons = ref<CupomWithDetails[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCupons = async (filters?: {
    comercioId?: string
    categoriaId?: number
    ativo?: boolean
  }) => {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('cupom')
        .select(`
          *,
          comercio:comercio!cnpj_comercio(
            *,
            categoria:categoria!id_categoria(*)
          ),
          reservas:cupom_associado(count)
        `)
        .order('dta_emissao_cupom', { ascending: false })

      if (filters?.comercioId) {
        query = query.eq('cnpj_comercio', filters.comercioId)
      }

      if (filters?.categoriaId) {
        query = query.eq('id_categoria', filters.categoriaId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      // Mapear para formato esperado
      const mappedData = data?.map((cupom: any) => ({
        id: cupom.num_cupom,
        comercio_id: cupom.cnpj_comercio,
        titulo: cupom.tit_cupom,
        percentual_desconto: Math.round(cupom.per_desc_cupom * 100),
        data_inicio: cupom.dta_inicio_cupom,
        data_fim: cupom.dta_termino_cupom,
        data_emissao: cupom.dta_emissao_cupom,
        ativo: true,
        comercio: {
          id: cupom.comercio.cnpj_comercio,
          nome_fantasia: cupom.comercio.nom_fantasia_comercio,
          razao_social: cupom.comercio.raz_social_comercio,
          telefone: cupom.comercio.con_comercio,
          endereco: cupom.comercio.end_comercio,
          bairro: cupom.comercio.bai_comercio,
          cidade: cupom.comercio.cid_comercio,
          uf: cupom.comercio.uf_comercio,
          cep: cupom.comercio.cep_comercio,
          email: cupom.comercio.email_comercio,
          cnpj: cupom.comercio.cnpj_comercio,
          categoria_id: cupom.comercio.id_categoria,
          auth_user_id: cupom.comercio.auth_user_id,
          ativo: true
        },
        categoria: cupom.comercio?.categoria ? {
          id: cupom.comercio.categoria.id_categoria,
          nome: cupom.comercio.categoria.nom_categoria
        } : null,
        reservas: cupom.reservas || { count: 0 }
      })) || []

      cupons.value = mappedData
      return { data: mappedData, error: null }
    } catch (e: any) {
      error.value = e.message
      return { data: null, error: e.message }
    } finally {
      loading.value = false
    }
  }

  const fetchCupomById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const { data: cupom, error: fetchError } = await supabase
        .from('cupom')
        .select(`
          *,
          comercio:comercio(*),
          categoria:categoria(*)
        `)
        .eq('num_cupom', id)
        .single() as { data: any, error: any }

      if (fetchError) throw fetchError

      // Mapear resultado do SQL para TypeScript
      const mappedCupom = {
        id: cupom.num_cupom,
        titulo: cupom.tit_cupom,
        data_emissao: cupom.dta_emissao_cupom,
        data_inicio: cupom.dta_inicio_cupom,
        data_fim: cupom.dta_termino_cupom,
        percentual_desconto: Math.round(cupom.per_desc_cupom * 100),
        comercio_id: cupom.cnpj_comercio,
        ativo: true,
        comercio: {
          id: cupom.comercio.cnpj_comercio,
          razao_social: cupom.comercio.raz_social_comercio,
          nome_fantasia: cupom.comercio.nom_fantasia_comercio,
          telefone: cupom.comercio.con_comercio,
          endereco: cupom.comercio.end_comercio,
          bairro: cupom.comercio.bai_comercio,
          cidade: cupom.comercio.cid_comercio,
          uf: cupom.comercio.uf_comercio,
          cep: cupom.comercio.cep_comercio,
          email: cupom.comercio.email_comercio,
          cnpj: cupom.comercio.cnpj_comercio,
          categoria_id: cupom.comercio.id_categoria,
          auth_user_id: cupom.comercio.auth_user_id,
          ativo: true
        },
        categoria: {
          id: cupom.categoria.id_categoria,
          nome: cupom.categoria.nom_categoria
        }
      }

      return { data: mappedCupom, error: null }
    } catch (e: any) {
      error.value = e.message
      return { data: null, error: e.message }
    } finally {
      loading.value = false
    }
  }

  const createCupom = async (cupomData: any) => {
    loading.value = true
    error.value = null

    try {
      // Mapear para schema do banco
      const dbData = {
        num_cupom: cupomData.hash_cupom,
        cnpj_comercio: cupomData.comercio_id,
        tit_cupom: cupomData.titulo,
        dta_emissao_cupom: new Date().toISOString().split('T')[0],
        dta_inicio_cupom: cupomData.data_inicio,
        dta_termino_cupom: cupomData.data_fim,
        per_desc_cupom: cupomData.percentual_desconto / 100
      }

      const { data, error: insertError } = await supabase
        .from('cupom')
        .insert([dbData] as any)
        .select()
        .single()

      if (insertError) throw insertError

      await fetchCupons({ comercioId: cupomData.comercio_id })
      return { data, error: null }
    } catch (e: any) {
      error.value = e.message
      return { data: null, error: e.message }
    } finally {
      loading.value = false
    }
  }

  const updateCupom = async (id: string, cupomData: any) => {
    loading.value = true
    error.value = null

    try {
      // Mapear para schema do banco
      const dbData: any = {}
      if (cupomData.titulo) dbData.tit_cupom = cupomData.titulo
      if (cupomData.data_inicio) dbData.dta_inicio_cupom = cupomData.data_inicio
      if (cupomData.data_fim) dbData.dta_termino_cupom = cupomData.data_fim
      if (cupomData.percentual_desconto) dbData.per_desc_cupom = cupomData.percentual_desconto / 100

      const { data, error: updateError } = await (supabase
        .from('cupom') as any)
        .update(dbData)
        .eq('num_cupom', id)
        .select()
        .single()

      if (updateError) throw updateError

      await fetchCupons({ comercioId: cupomData.comercio_id })
      return { data, error: null }
    } catch (e: any) {
      error.value = e.message
      return { data: null, error: e.message }
    } finally {
      loading.value = false
    }
  }

  const deleteCupom = async (id: string, comercioId?: string) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('cupom')
        .delete()
        .eq('num_cupom', id)

      if (deleteError) throw deleteError

      if (comercioId) {
        await fetchCupons({ comercioId })
      }
      return { error: null }
    } catch (e: any) {
      error.value = e.message
      return { error: e.message }
    } finally {
      loading.value = false
    }
  }

  const toggleCupomStatus = async (id: string, ativo: boolean, comercioId?: string) => {
    return updateCupom(id, { ativo })
  }

  return {
    cupons,
    loading,
    error,
    fetchCupons,
    fetchCupomById,
    createCupom,
    updateCupom,
    deleteCupom,
    toggleCupomStatus
  }
}
