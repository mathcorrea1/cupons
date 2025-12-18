import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Categoria } from '~/types'

export const useCategorias = () => {
  const supabase = useSupabaseClient()
  
  const categorias = ref<Categoria[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategorias = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('categoria')
        .select('*')
        .order('nom_categoria')

      if (fetchError) throw fetchError

      // Mapear resultado do SQL para TypeScript
      const mappedData = data?.map((cat: any) => ({
        id: cat.id_categoria,
        nome: cat.nom_categoria
      })) || []

      categorias.value = mappedData
      return { data: mappedData, error: null }
    } catch (e: any) {
      error.value = e.message
      return { data: null, error: e.message }
    } finally {
      loading.value = false
    }
  }

  return {
    categorias,
    loading,
    error,
    fetchCategorias
  }
}
