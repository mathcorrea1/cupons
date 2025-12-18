import { serverSupabaseClient } from '#supabase/server';
import { docToEmail } from '~/utils/validators';
import type { CadastroMorador } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody<CadastroMorador>(event);
  const supabase = await serverSupabaseClient(event);

  // Validações básicas
  if (!body.cpf || !body.nome || !body.email || !body.senha) {
    throw createError({
      statusCode: 400,
      message: 'Campos obrigatórios faltando'
    });
  }

  try {
    // 1. Verificar se CPF já existe
    const { data: cpfExistente } = await supabase
      .from('associado')
      .select('cpf_associado')
      .eq('cpf_associado', body.cpf)
      .single();

    if (cpfExistente) {
      throw createError({
        statusCode: 400,
        message: 'CPF já cadastrado. Faça login ou use outro CPF.'
      });
    }

    // 2. Criar usuário no Supabase Auth usando email fake
    const emailFake = docToEmail(body.cpf);
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: emailFake,
      password: body.senha,
      options: {
        emailRedirectTo: undefined,
        data: {
          cpf: body.cpf,
          nome: body.nome
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

    // 3. Inserir dados na tabela ASSOCIADO
    const insertData = {
      cpf_associado: body.cpf,
      auth_user_id: authData.user.id,
      nom_associado: body.nome,
      dtn_associado: body.dataNascimento || null,
      end_associado: body.endereco || null,
      bai_associado: body.bairro || null,
      cep_associado: body.cep || null,
      cid_associado: body.cidade || null,
      uf_associado: body.uf || null,
      cel_associado: body.celular || null,
      email_associado: body.email,
      sen_associado: body.senha // Campo legacy
    };
    
    console.log('Tentando inserir associado:', insertData);
    
    const { error: insertError } = await supabase
      .from('associado')
      .insert(insertData);

    if (insertError) {
      console.error('Erro ao inserir associado:', JSON.stringify(insertError, null, 2));
      // Se falhar ao inserir no banco, tentar deletar o usuário criado
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      throw createError({
        statusCode: 500,
        message: `Erro ao salvar dados do morador: ${insertError.message}`
      });
    }

    return {
      success: true,
      message: 'Cadastro realizado com sucesso! Faça login com seu CPF.',
      userId: authData.user.id
    };

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao realizar cadastro'
    });
  }
});
