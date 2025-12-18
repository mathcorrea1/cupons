<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard do Comerciante</h1>
        <p v-if="perfil" class="text-gray-600">{{ perfil.nome_fantasia }}</p>
      </div>

      <!-- Statistics -->
      <div class="mb-8">
        <StatisticsCards
          :total-cupons="statistics.totalCupons"
          :cupons-ativos="statistics.cuponsAtivos"
          :total-reservas="statistics.totalReservas"
          :cupons-usados="statistics.cuponsUsados"
        />
      </div>

      <!-- Coupon List -->
      <CouponList
        :cupons="cupons"
        :loading="cuponLoading"
        @create="openCreateModal"
        @view="viewCupom"
        @edit="openEditModal"
        @delete="confirmDelete"
      />

      <!-- Form Modal -->
      <CouponFormModal
        v-model="showFormModal"
        :cupom="selectedCupom"
        :categorias="categorias"
        :loading="formLoading"
        @submit="handleSubmit"
      />

      <!-- View Modal -->
      <BaseModal
        v-model="showViewModal"
        title="Detalhes do Cupom"
        size="lg"
      >
        <div v-if="selectedCupom" class="space-y-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              {{ selectedCupom.titulo }}
            </h3>
            <BaseBadge :variant="selectedCupom.ativo ? 'success' : 'default'">
              {{ selectedCupom.ativo ? 'Ativo' : 'Inativo' }}
            </BaseBadge>
          </div>

          <div v-if="selectedCupom.descricao">
            <h4 class="font-semibold text-gray-900 mb-2">Descrição</h4>
            <p class="text-gray-600">{{ selectedCupom.descricao }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Desconto</h4>
              <p class="text-2xl font-bold text-green-600">
                {{ selectedCupom.percentual_desconto }}%
              </p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Validade</h4>
              <p class="text-sm text-gray-600">
                {{ formatarData(selectedCupom.data_inicio) }} até {{ formatarData(selectedCupom.data_fim) }}
              </p>
            </div>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 mb-2">ID do Cupom</h4>
            <code class="block bg-gray-100 p-3 rounded text-sm font-mono break-all">
              {{ selectedCupom.id }}
            </code>
          </div>

          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-semibold text-gray-900">Reservas</h4>
              <BaseButton
                size="sm"
                variant="outline"
                :loading="loadingReservas"
                @click="loadReservas"
              >
                Atualizar
              </BaseButton>
            </div>
            
            <BaseTable
              v-if="reservas.length > 0"
              :columns="reservasColumns"
              :data="reservas"
              :loading="loadingReservas"
            >
              <template #cell-usado="{ value }">
                <BaseBadge :variant="value ? 'success' : 'warning'" size="sm">
                  {{ value ? 'Usado' : 'Pendente' }}
                </BaseBadge>
              </template>
              
              <template #cell-data_reserva="{ value }">
                {{ formatarData(value) }}
              </template>
              
              <template #cell-data_uso="{ value }">
                {{ value ? formatarData(value) : '-' }}
              </template>
            </BaseTable>
            
            <p v-else class="text-gray-500 text-center py-4">
              Nenhuma reserva para este cupom
            </p>
          </div>
        </div>
      </BaseModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useCupons } from '~/composables/useCupons'
import { useCategorias } from '~/composables/useCategorias'
import { useReservas } from '~/composables/useReservas'
import { useNotification } from '~/composables/useNotification'
import { gerarHashCupom, formatarData } from '~/utils/validators'
import type { Comercio, CupomFormData, CupomWithDetails, TableColumn } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { getUserProfile } = useAuth()
const { cupons, loading: cuponLoading, fetchCupons, createCupom, updateCupom, deleteCupom } = useCupons()
const { categorias, fetchCategorias } = useCategorias()
const { fetchReservasByCupom } = useReservas()
const { success, error: notifyError } = useNotification()

const perfil = ref<Comercio | null>(null)
const showFormModal = ref(false)
const showViewModal = ref(false)
const selectedCupom = ref<CupomWithDetails | null>(null)
const formLoading = ref(false)
const reservas = ref<any[]>([])
const loadingReservas = ref(false)

const reservasColumns: TableColumn[] = [
  { key: 'associado.nome', label: 'Associado', align: 'left' },
  { key: 'data_reserva', label: 'Data Reserva', align: 'center' },
  { key: 'data_uso', label: 'Data Uso', align: 'center' },
  { key: 'usado', label: 'Status', align: 'center' }
]

const statistics = computed(() => {
  const total = cupons.value.length
  const ativos = cupons.value.filter(c => c.ativo).length
  const totalReservas = cupons.value.reduce((sum, c) => sum + (c.reservas?.count || 0), 0)

  return {
    totalCupons: total,
    cuponsAtivos: ativos,
    totalReservas: totalReservas,
    cuponsUsados: 0 // Removido quantidade_utilizada pois não existe no schema
  }
})

onMounted(async () => {
  perfil.value = await getUserProfile('comercio')
  if (perfil.value) {
    await Promise.all([
      fetchCupons({ comercioId: perfil.value.id }),
      fetchCategorias()
    ])
  }
})

const openCreateModal = () => {
  selectedCupom.value = null
  showFormModal.value = true
}

const openEditModal = (cupom: CupomWithDetails) => {
  selectedCupom.value = cupom
  showFormModal.value = true
}

const viewCupom = async (cupom: CupomWithDetails) => {
  selectedCupom.value = cupom
  showViewModal.value = true
  await loadReservas()
}

const loadReservas = async () => {
  if (!selectedCupom.value) return
  
  loadingReservas.value = true
  const { data } = await fetchReservasByCupom(selectedCupom.value.id)
  if (data) {
    reservas.value = data
  }
  loadingReservas.value = false
}

const handleSubmit = async (formData: CupomFormData) => {
  if (!perfil.value) return

  formLoading.value = true

  try {
    const cupomData = {
      comercio_id: perfil.value.id,
      categoria_id: formData.categoriaId,
      titulo: formData.titulo,
      descricao: formData.descricao,
      percentual_desconto: Number(formData.percentualDesconto),
      data_inicio: formData.dataInicio,
      data_fim: formData.dataFim,
      quantidade_total: formData.quantidadeTotal ? Number(formData.quantidadeTotal) : null,
      quantidade_utilizada: 0,
      ativo: true,
      hash_cupom: gerarHashCupom()
    }

    if (selectedCupom.value) {
      // Editar
      const { error } = await updateCupom(selectedCupom.value.id, cupomData as any)
      if (!error) {
        success('Cupom atualizado com sucesso!')
        showFormModal.value = false
      } else {
        notifyError('Erro ao atualizar cupom: ' + error)
      }
    } else {
      // Criar
      const { error } = await createCupom(cupomData as any)
      if (!error) {
        success('Cupom criado com sucesso!')
        showFormModal.value = false
      } else {
        notifyError('Erro ao criar cupom: ' + error)
      }
    }
  } catch (error) {
    console.error('Erro:', error)
    notifyError('Erro ao processar cupom')
  } finally {
    formLoading.value = false
  }
}

const confirmDelete = async (cupom: CupomWithDetails) => {
  if (!confirm(`Tem certeza que deseja excluir o cupom "${cupom.titulo}"?`)) {
    return
  }

  const { error } = await deleteCupom(cupom.id, perfil.value?.id)
  if (!error) {
    success('Cupom excluído com sucesso!')
  } else {
    notifyError('Erro ao excluir cupom: ' + error)
  }
}
</script>
