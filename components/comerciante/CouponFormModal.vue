<template>
  <BaseModal
    v-model="isOpen"
    :title="isEditing ? 'Editar Cupom' : 'Criar Novo Cupom'"
    size="lg"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput
        v-model="formData.titulo"
        label="Título do Cupom"
        placeholder="Ex: 20% de desconto em pizzas"
        required
        :error="errors.titulo"
      />

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Descrição (opcional)
        </label>
        <textarea
          v-model="formData.descricao"
          rows="3"
          class="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Descreva os detalhes do cupom..."
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Categoria <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.categoriaId"
          required
          class="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione uma categoria</option>
          <option
            v-for="categoria in categorias"
            :key="categoria.id"
            :value="categoria.id"
          >
            {{ categoria.nome }}
          </option>
        </select>
        <p v-if="errors.categoriaId" class="mt-1 text-sm text-red-600">
          {{ errors.categoriaId }}
        </p>
      </div>

      <BaseInput
        v-model="formData.percentualDesconto"
        type="number"
        label="Percentual de Desconto (%)"
        placeholder="Ex: 20"
        required
        :error="errors.percentualDesconto"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput
          v-model="formData.dataInicio"
          type="date"
          label="Data de Início"
          required
          :error="errors.dataInicio"
        />

        <BaseInput
          v-model="formData.dataFim"
          type="date"
          label="Data de Término"
          required
          :error="errors.dataFim"
        />
      </div>

      <BaseInput
        :model-value="formData.quantidadeTotal ?? ''"
        @update:model-value="(val) => formData.quantidadeTotal = val === '' ? undefined : Number(val)"
        type="number"
        label="Quantidade Total (opcional)"
        placeholder="Deixe em branco para ilimitado"
        :error="errors.quantidadeTotal"
      />
    </form>

    <template #footer>
      <BaseButton variant="outline" @click="handleClose">
        Cancelar
      </BaseButton>
      <BaseButton
        variant="primary"
        :loading="loading"
        @click="handleSubmit"
      >
        {{ isEditing ? 'Salvar Alterações' : 'Criar Cupom' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Cupom, Categoria, CupomFormData } from '~/types'

interface Props {
  modelValue: boolean
  cupom?: Cupom | null
  categorias: Categoria[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  cupom: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: CupomFormData]
}>()

const isOpen = ref(props.modelValue)
const isEditing = ref(false)

const formData = ref<CupomFormData>({
  titulo: '',
  descricao: '',
  categoriaId: undefined,
  percentualDesconto: 0,
  dataInicio: '',
  dataFim: '',
  quantidadeTotal: undefined
})

const errors = ref<Record<string, string>>({})

watch(() => props.modelValue, (value) => {
  isOpen.value = value
  if (value && props.cupom) {
    // Modo edição
    isEditing.value = true
    formData.value = {
      titulo: props.cupom.titulo,
      descricao: props.cupom.descricao || '',
      categoriaId: props.cupom.categoria?.id || 0,
      percentualDesconto: props.cupom.percentual_desconto,
      dataInicio: props.cupom.data_inicio.split('T')[0],
      dataFim: props.cupom.data_fim.split('T')[0],
      quantidadeTotal: 0 // Campo não existe mais no schema
    }
  } else if (value) {
    // Modo criação
    isEditing.value = false
    resetForm()
  }
})

watch(isOpen, (value) => {
  emit('update:modelValue', value)
})

const resetForm = () => {
  formData.value = {
    titulo: '',
    descricao: '',
    categoriaId: 0,
    percentualDesconto: 0,
    dataInicio: '',
    dataFim: '',
    quantidadeTotal: undefined
  }
  errors.value = {}
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.titulo.trim()) {
    errors.value.titulo = 'Título é obrigatório'
  }

  if (!formData.value.categoriaId) {
    errors.value.categoriaId = 'Selecione uma categoria'
  }

  if (formData.value.percentualDesconto <= 0 || formData.value.percentualDesconto > 100) {
    errors.value.percentualDesconto = 'Desconto deve ser entre 1 e 100%'
  }

  if (!formData.value.dataInicio) {
    errors.value.dataInicio = 'Data de início é obrigatória'
  }

  if (!formData.value.dataFim) {
    errors.value.dataFim = 'Data de término é obrigatória'
  }

  if (formData.value.dataInicio && formData.value.dataFim) {
    if (new Date(formData.value.dataFim) < new Date(formData.value.dataInicio)) {
      errors.value.dataFim = 'Data de término deve ser maior que data de início'
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', formData.value)
  }
}

const handleClose = () => {
  isOpen.value = false
  resetForm()
}
</script>
