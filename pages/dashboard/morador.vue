<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard do Morador</h1>
        <p v-if="perfil" class="text-gray-600">Bem-vindo, {{ perfil.nome }}!</p>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'marketplace'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
              @click="activeTab = 'marketplace'"
            >
              <Icon name="shopping-bag" :size="20" class="inline mr-2" />
              Marketplace
            </button>
            
            <button
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'my-coupons'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
              @click="activeTab = 'my-coupons'"
            >
              <Icon name="ticket" :size="20" class="inline mr-2" />
              Meus Cupons
              <BaseBadge v-if="reservasAtivas > 0" variant="primary" size="sm" class="ml-2">
                {{ reservasAtivas }}
              </BaseBadge>
            </button>
          </nav>
        </div>
      </div>

      <!-- Marketplace Tab -->
      <div v-if="activeTab === 'marketplace'" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-1">
          <CouponFilters
            v-model="filters"
            :categorias="categorias"
            @reset="resetFilters"
          />
        </div>

        <!-- Marketplace -->
        <div class="lg:col-span-3">
          <CouponMarketplace
            :cupons="cuponsFiltered"
            :loading="cuponLoading"
            @select="selectCupom"
            @reserve="reserveCupom"
          />
        </div>
      </div>

      <!-- My Coupons Tab -->
      <div v-if="activeTab === 'my-coupons'">
        <MyCoupons
          :reservas="reservas"
          :loading="reservasLoading"
          @show-q-r-code="showQRCodeModal"
        />
      </div>

      <!-- Coupon Details Modal -->
      <BaseModal
        v-model="showDetailsModal"
        :title="selectedCupom?.titulo || ''"
        size="lg"
      >
        <div v-if="selectedCupom" class="space-y-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              {{ selectedCupom.titulo }}
            </h3>
            <BaseBadge variant="success" size="lg">
              {{ selectedCupom.percentual_desconto }}% OFF
            </BaseBadge>
          </div>

          <div v-if="selectedCupom.descricao">
            <h4 class="font-semibold text-gray-900 mb-2">Descrição</h4>
            <p class="text-gray-600">{{ selectedCupom.descricao }}</p>
          </div>

          <div v-if="selectedCupom.comercio" class="border-t border-gray-200 pt-4">
            <h4 class="font-semibold text-gray-900 mb-3">Informações do Estabelecimento</h4>
            
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <Icon name="store" :size="16" class="text-gray-400" />
                <span class="font-medium">{{ selectedCupom.comercio.nome_fantasia }}</span>
              </div>
              
              <div v-if="selectedCupom.comercio.endereco" class="flex items-start gap-2">
                <Icon name="map-pin" :size="16" class="text-gray-400 mt-0.5" />
                <span class="text-gray-600">
                  {{ selectedCupom.comercio.endereco }}, {{ selectedCupom.comercio.bairro }}<br>
                  {{ selectedCupom.comercio.cidade }}/{{ selectedCupom.comercio.uf }} - {{ selectedCupom.comercio.cep }}
                </span>
              </div>
              
              <div v-if="selectedCupom.comercio.telefone" class="flex items-center gap-2">
                <Icon name="phone" :size="16" class="text-gray-400" />
                <span class="text-gray-600">{{ selectedCupom.comercio.telefone }}</span>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4">
            <h4 class="font-semibold text-gray-900 mb-2">Validade</h4>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="calendar" :size="16" />
              <span>{{ formatarData(selectedCupom.data_inicio) }} até {{ formatarData(selectedCupom.data_fim) }}</span>
            </div>
          </div>
        </div>

        <template #footer>
          <BaseButton variant="outline" @click="showDetailsModal = false">
            Fechar
          </BaseButton>
          <BaseButton
            variant="primary"
            icon="ticket"
            :loading="reserving"
            :disabled="jaReservado"
            @click="reserveCupom(selectedCupom!)"
          >
            {{ jaReservado ? 'Já Reservado' : 'Reservar Cupom' }}
          </BaseButton>
        </template>
      </BaseModal>

      <!-- QR Code Modal -->
      <BaseModal
        v-model="showQRModal"
        title="Código de Validação"
        size="md"
      >
        <div v-if="selectedReserva" class="text-center space-y-4">
          <div class="bg-white p-6 rounded-lg border-2 border-gray-200">
            <p class="text-sm text-gray-600 mb-4">Apresente este ID no estabelecimento:</p>
            <code class="text-2xl font-mono font-bold text-blue-600 break-all">
              {{ selectedReserva.id }}
            </code>
          </div>
          
          <BaseAlert variant="info">
            <p class="text-sm">
              Este código é único e deve ser apresentado no estabelecimento para validação do cupom.
            </p>
          </BaseAlert>
        </div>

        <template #footer>
          <BaseButton variant="primary" full-width @click="showQRModal = false">
            Fechar
          </BaseButton>
        </template>
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
import type { Associado, CupomWithDetails, ReservaWithDetails } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { getUserProfile } = useAuth()
const { cupons, loading: cuponLoading, fetchCupons } = useCupons()
const { categorias, fetchCategorias } = useCategorias()
const { reservas, loading: reservasLoading, fetchReservasByAssociado, createReserva, verificarReservaExistente } = useReservas()
const { success, error: notifyError, warning } = useNotification()

const perfil = ref<Associado | null>(null)
const activeTab = ref<'marketplace' | 'my-coupons'>('marketplace')
const showDetailsModal = ref(false)
const showQRModal = ref(false)
const selectedCupom = ref<CupomWithDetails | null>(null)
const selectedReserva = ref<ReservaWithDetails | null>(null)
const reserving = ref(false)
const jaReservado = ref(false)

const filters = ref({
  categoriaId: '',
  descontoMinimo: 0,
  busca: ''
})

const cuponsFiltered = computed(() => {
  let result = cupons.value.filter(c => c.ativo)

  if (filters.value.categoriaId) {
    result = result.filter(c => c.categoria?.id === Number(filters.value.categoriaId))
  }

  if (filters.value.descontoMinimo > 0) {
    result = result.filter(c => c.percentual_desconto >= filters.value.descontoMinimo)
  }

  if (filters.value.busca) {
    const busca = filters.value.busca.toLowerCase()
    result = result.filter(c => 
      c.titulo.toLowerCase().includes(busca) ||
      c.descricao?.toLowerCase().includes(busca) ||
      c.comercio?.nome_fantasia.toLowerCase().includes(busca)
    )
  }

  return result
})

const reservasAtivas = computed(() => {
  return reservas.value.filter(r => !r.usado).length
})

onMounted(async () => {
  perfil.value = await getUserProfile('morador')
  if (perfil.value) {
    await Promise.all([
      fetchCupons({ ativo: true }),
      fetchCategorias(),
      fetchReservasByAssociado(perfil.value.id)
    ])
  }
})

const resetFilters = () => {
  filters.value = {
    categoriaId: '',
    descontoMinimo: 0,
    busca: ''
  }
}

const selectCupom = async (cupom: CupomWithDetails) => {
  selectedCupom.value = cupom
  showDetailsModal.value = true
  
  // Verificar se já reservou
  if (perfil.value) {
    jaReservado.value = await verificarReservaExistente(cupom.id, perfil.value.id)
  }
}

const reserveCupom = async (cupom: CupomWithDetails) => {
  if (!perfil.value || reserving.value) return

  // Verificar se já reservou
  const jaReservou = await verificarReservaExistente(cupom.id, perfil.value.id)
  if (jaReservou) {
    warning('Você já reservou este cupom!')
    return
  }

  reserving.value = true

  try {
    const reservaData = {
      cupom_id: cupom.id,
      associado_id: perfil.value.id,
      hash_validacao: gerarHashCupom(),
      data_reserva: new Date().toISOString(),
      usado: false
    }

    const { error } = await createReserva(reservaData)

    if (!error) {
      success('Cupom reservado com sucesso!')
      showDetailsModal.value = false
      
      // Atualizar lista de reservas
      await fetchReservasByAssociado(perfil.value.id)
      
      // Mudar para aba de cupons
      activeTab.value = 'my-coupons'
    } else {
      notifyError('Erro ao reservar cupom: ' + error)
    }
  } catch (error) {
    console.error('Erro:', error)
    notifyError('Erro ao reservar cupom')
  } finally {
    reserving.value = false
  }
}

const showQRCodeModal = (reserva: ReservaWithDetails) => {
  selectedReserva.value = reserva
  showQRModal.value = true
}
</script>
