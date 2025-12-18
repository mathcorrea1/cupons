import { serverSupabaseClient } from '#supabase/server';
import { docToEmail } from '~/utils/validators';
import type { CadastroComerciante } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody<CadastroComerciante>(event);
  const supabase = await serverSupabaseClient(event);

  // Validações básicas
  if (!body.cnpj || !body.razaoSocial || !body.nomeFantasia || !body.email || !body.senha) {
    throw createError({
      statusCode: 400,
      message: 'Campos obrigatórios faltando'
    });
  }

  try {
    // 1. Verificar se CNPJ já existe
    const { data: cnpjExistente } = await supabase
      .from('comercio')
      .select('cnpj_comercio')
      .eq('cnpj_comercio', body.cnpj)
      .single();

    if (cnpjExistente) {
      throw createError({
        statusCode: 400,
        message: 'CNPJ já cadastrado. Faça login ou use outro CNPJ.'
      });
    }

    // 2. Criar usuário no Supabase Auth usando email fake
    const emailFake = docToEmail(body.cnpj);
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: emailFake,
      password: body.senha,
      options: {
        emailRedirectTo: undefined,
        data: {
          cnpj: body.cnpj,
          razaoSocial: body.razaoSocial
        }
      }
    });

    if (authError) {
      throw createError({
        statusCode: 400,
        message: authError.message
      });
    }

    if (!authData.user) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar usuário'
      });
    }

    // 3. Inserir dados na tabela COMERCIO
    const { error: insertError } = await supabase
      .from('comercio')
      .insert({
        cnpj_comercio: body.cnpj,
        auth_user_id: authData.user.id,
        id_categoria: Number(body.categoriaId),
        raz_social_comercio: body.razaoSocial,
        nom_fantasia_comercio: body.nomeFantasia,
        end_comercio: body.endereco || null,
        bai_comercio: body.bairro || null,
        cep_comercio: body.cep || null,
        cid_comercio: body.cidade || null,
        uf_comercio: body.uf || null,
        con_comercio: body.telefone || null,
        email_comercio: body.email,
        sen_comercio: body.senha // Campo legacy
      });

    if (insertError) {
      // Se falhar ao inserir no banco, tentar deletar o usuário criado
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      throw createError({
        statusCode: 500,
        message: 'Erro ao salvar dados do comércio'
      });
    }

    return {
      success: true,
      message: 'Cadastro realizado com sucesso! Faça login com seu CNPJ.',
      userId: authData.user.id
    };

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao realizar cadastro'
    });
  }
});
