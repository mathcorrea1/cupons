import { serverSupabaseClient } from '#supabase/server';
import { docToEmail } from '~/utils/validators';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    documento: string;
    senha: string;
    tipo: 'morador' | 'comerciante';
  }>(event);
  
  const supabase = await serverSupabaseClient(event);

  // Validações básicas
  if (!body.documento || !body.senha || !body.tipo) {
    throw createError({
      statusCode: 400,
      message: 'Campos obrigatórios faltando'
    });
  }

  try {
    // Converter documento para email fake
    const emailFake = docToEmail(body.documento);
    
    console.log('Tentando login com:', { emailFake, documento: body.documento, tipo: body.tipo });
    
    // Tentar fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailFake,
      password: body.senha,
    });

    if (error) {
      console.error('Erro no login Supabase:', error);
      throw createError({
        statusCode: 401,
        message: `Credenciais inválidas: ${error.message}`
      });
    }

    if (!data.user) {
      throw createError({
        statusCode: 401,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se o usuário existe na tabela correta
    if (body.tipo === 'comerciante') {
      const { data: comercio, error: comercioError } = await supabase
        .from('comercio')
        .select('cnpj_comercio, nom_fantasia_comercio')
        .eq('auth_user_id', data.user.id)
        .single();

      if (comercioError || !comercio) {
        throw createError({
          statusCode: 401,
          message: 'Usuário não é um comerciante'
        });
      }

      return {
        success: true,
        user: data.user,
        tipo: 'comerciante',
        perfil: comercio
      };
    } else {
      const { data: associado, error: associadoError } = await supabase
        .from('associado')
        .select('cpf_associado, nom_associado')
        .eq('auth_user_id', data.user.id)
        .single();

      if (associadoError || !associado) {
        throw createError({
          statusCode: 401,
          message: 'Usuário não é um morador'
        });
      }

      return {
        success: true,
        user: data.user,
        tipo: 'morador',
        perfil: associado
      };
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao fazer login'
    });
  }
});
