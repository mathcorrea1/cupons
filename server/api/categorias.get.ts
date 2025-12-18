import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  
  const { data, error } = await supabase
    .from('categoria')
    .select('id_categoria, nom_categoria')
    .order('nom_categoria', { ascending: true });

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar categorias'
    });
  }

  // Mapear para o formato esperado pelo frontend
  return data?.map(cat => ({
    id: cat.id_categoria,
    nome: cat.nom_categoria
  })) || [];
});
