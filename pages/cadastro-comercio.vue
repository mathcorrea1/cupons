<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
    <BaseCard class="w-full max-w-2xl" padding="lg">
      <div class="text-center mb-8">
        <Icon name="store" :size="48" class="text-blue-600 mx-auto mb-4" />
        <h1 class="text-3xl font-bold mb-2">Cadastro de Comerciante</h1>
        <p class="text-gray-600">Preencha os dados do seu estabelecimento</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          v-model="form.cnpj"
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          icon="store"
          required
          :error="errors.cnpj"
          :mask="formatarCNPJ"
        />

        <BaseInput
          v-model="form.razaoSocial"
          label="Razão Social"
          placeholder="Nome empresarial"
          required
          :error="errors.razaoSocial"
        />

        <BaseInput
          v-model="form.nomeFantasia"
          label="Nome Fantasia"
          placeholder="Nome do estabelecimento"
          required
          :error="errors.nomeFantasia"
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Categoria <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.categoriaId"
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

        <div class="grid md:grid-cols-2 gap-4">
          <BaseInput
            v-model="form.cep"
            label="CEP"
            placeholder="00000-000"
            :mask="formatarCEP"
          />

          <BaseInput
            v-model="form.endereco"
            label="Endereço"
            placeholder="Rua, número"
          />
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <BaseInput
            v-model="form.bairro"
            label="Bairro"
            placeholder="Nome do bairro"
          />

          <BaseInput
            v-model="form.cidade"
            label="Cidade"
            placeholder="Nome da cidade"
          />
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">UF</label>
            <select
              v-model="form.uf"
              class="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              <option value="AC">AC</option>
              <option value="AL">AL</option>
              <option value="AP">AP</option>
              <option value="AM">AM</option>
              <option value="BA">BA</option>
              <option value="CE">CE</option>
              <option value="DF">DF</option>
              <option value="ES">ES</option>
              <option value="GO">GO</option>
              <option value="MA">MA</option>
              <option value="MT">MT</option>
              <option value="MS">MS</option>
              <option value="MG">MG</option>
              <option value="PA">PA</option>
              <option value="PB">PB</option>
              <option value="PR">PR</option>
              <option value="PE">PE</option>
              <option value="PI">PI</option>
              <option value="RJ">RJ</option>
              <option value="RN">RN</option>
              <option value="RS">RS</option>
              <option value="RO">RO</option>
              <option value="RR">RR</option>
              <option value="SC">SC</option>
              <option value="SP">SP</option>
              <option value="SE">SE</option>
              <option value="TO">TO</option>
            </select>
          </div>

          <BaseInput
            v-model="form.telefone"
            label="Telefone"
            placeholder="(00) 0000-0000"
            :mask="formatarTelefone"
          />
        </div>

        <BaseInput
          v-model="form.email"
          type="email"
          label="E-mail"
          placeholder="contato@empresa.com"
          required
          :error="errors.email"
        />

        <BaseInput
          v-model="form.senha"
          type="password"
          label="Senha"
          placeholder="Mínimo 6 caracteres"
          required
          :error="errors.senha"
        />

        <BaseInput
          v-model="form.confirmarSenha"
          type="password"
          label="Confirmar Senha"
          placeholder="Digite a senha novamente"
          required
          :error="errors.confirmarSenha"
        />

        <div class="flex gap-3 pt-4">
          <BaseButton
            type="button"
            variant="outline"
            full-width
            @click="$router.push('/cadastro')"
          >
            Voltar
          </BaseButton>
          
          <BaseButton
            type="submit"
            variant="primary"
            full-width
            :loading="loading"
          >
            Cadastrar
          </BaseButton>
        </div>
      </form>

      <div class="mt-6 text-center text-sm text-gray-600">
        Já tem uma conta?
        <NuxtLink to="/login" class="text-blue-600 hover:text-blue-700 font-medium">
          Faça login
        </NuxtLink>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNotification } from '~/composables/useNotification'
import { useCategorias } from '~/composables/useCategorias'
import { validarCNPJ, formatarCNPJ, formatarCEP, formatarTelefone, limparFormatacao, docToEmail } from '~/utils/validators'

const { success, error: notifyError } = useNotification()
const { categorias, fetchCategorias } = useCategorias()
const loading = ref(false)

const form = ref({
  cnpj: '',
  razaoSocial: '',
  nomeFantasia: '',
  categoriaId: '',
  endereco: '',
  bairro: '',
  cep: '',
  cidade: '',
  uf: '',
  telefone: '',
  email: '',
  senha: '',
  confirmarSenha: ''
})

const errors = ref<Record<string, string>>({})

onMounted(async () => {
  await fetchCategorias()
})

const validateForm = (): boolean => {
  errors.value = {}

  const cnpjLimpo = limparFormatacao(form.value.cnpj)
  if (!validarCNPJ(cnpjLimpo)) {
    errors.value.cnpj = 'CNPJ inválido'
  }

  if (form.value.razaoSocial.length < 3) {
    errors.value.razaoSocial = 'Razão Social deve ter no mínimo 3 caracteres'
  }

  if (form.value.nomeFantasia.length < 3) {
    errors.value.nomeFantasia = 'Nome Fantasia deve ter no mínimo 3 caracteres'
  }

  if (!form.value.categoriaId) {
    errors.value.categoriaId = 'Selecione uma categoria'
  }

  if (!form.value.email) {
    errors.value.email = 'E-mail é obrigatório'
  }

  if (form.value.senha.length < 6) {
    errors.value.senha = 'Senha deve ter no mínimo 6 caracteres'
  }

  if (form.value.senha !== form.value.confirmarSenha) {
    errors.value.confirmarSenha = 'As senhas não conferem'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    notifyError('Por favor, corrija os erros no formulário')
    return
  }

  loading.value = true

  try {
    const cnpjLimpo = limparFormatacao(form.value.cnpj)
    const emailGerado = docToEmail(cnpjLimpo)

    const response = await $fetch('/api/auth/cadastro-comercio', {
      method: 'POST',
      body: {
        cnpj: cnpjLimpo,
        razaoSocial: form.value.razaoSocial,
        nomeFantasia: form.value.nomeFantasia,
        categoriaId: Number(form.value.categoriaId),
        endereco: form.value.endereco,
        bairro: form.value.bairro,
        cep: limparFormatacao(form.value.cep),
        cidade: form.value.cidade,
        uf: form.value.uf,
        telefone: limparFormatacao(form.value.telefone),
        email: emailGerado,
        senha: form.value.senha
      }
    })

    if (response.error) {
      notifyError(response.error)
    } else {
      success('Cadastro realizado com sucesso!')
      setTimeout(() => {
        navigateTo('/login')
      }, 1500)
    }
  } catch (e: any) {
    notifyError(e.message || 'Erro ao cadastrar. Tente novamente.')
  } finally {
    loading.value = false
  }
}
</script>
