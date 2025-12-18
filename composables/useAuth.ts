import { ref, computed } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      return { data, error: null }
    } catch (e: any) {
      error.value = e.message
      return { data: null, error: e.message }
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string, metadata?: any) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (signUpError) throw signUpError

      return { data, error: null }
    } catch (e: any) {
      error.value = e.message
      return { data: null, error: e.message }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      
      return { error: null }
    } catch (e: any) {
      error.value = e.message
      return { error: e.message }
    } finally {
      loading.value = false
    }
  }

  const getUserProfile = async (tipo: 'comercio' | 'morador') => {
    if (!user.value) return null

    try {
      const table = tipo === 'comercio' ? 'comercio' : 'associado'
      const { data, error: fetchError } = await supabase
        .from(table)
        .select('*')
        .eq('auth_user_id', user.value.id)
        .single() as { data: any, error: any }

      if (fetchError) throw fetchError

      // Mapear para formato esperado
      if (tipo === 'comercio' && data) {
        return {
          id: data.cnpj_comercio,
          auth_user_id: data.auth_user_id,
          cnpj: data.cnpj_comercio,
          razao_social: data.raz_social_comercio,
          nome_fantasia: data.nom_fantasia_comercio,
          categoria_id: data.id_categoria,
          endereco: data.end_comercio,
          bairro: data.bai_comercio,
          cep: data.cep_comercio,
          cidade: data.cid_comercio,
          uf: data.uf_comercio,
          telefone: data.con_comercio,
          email: data.email_comercio,
          ativo: true
        }
      } else if (tipo === 'morador' && data) {
        return {
          id: data.cpf_associado,
          auth_user_id: data.auth_user_id,
          cpf: data.cpf_associado,
          nome: data.nom_associado,
          data_nascimento: data.dtn_associado,
          endereco: data.end_associado,
          bairro: data.bai_associado,
          cep: data.cep_associado,
          cidade: data.cid_associado,
          uf: data.uf_associado,
          celular: data.cel_associado,
          email: data.email_associado,
          ativo: true
        }
      }

      return data
    } catch (e) {
      console.error('Erro ao buscar perfil:', e)
      return null
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    getUserProfile
  }
}
