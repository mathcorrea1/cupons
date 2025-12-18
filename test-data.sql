-- =============================================
-- DADOS DE TESTE PARA O SISTEMA
-- =============================================
-- Execute este script APÓS o supabase-schema.sql
-- para popular o banco com dados de exemplo
-- =============================================

-- IMPORTANTE: 
-- Você precisará criar os usuários manualmente através
-- da interface do sistema para que sejam criados no auth.users
-- Os dados abaixo são apenas para referência

-- =============================================
-- DADOS DE TESTE PARA CADASTRO
-- =============================================

-- COMERCIANTES PARA TESTE:
-- 1. Restaurante do João
--    CNPJ: 12345678000190
--    Categoria: Alimentação
--    Senha: teste123

-- 2. Loja da Maria
--    CNPJ: 98765432000100
--    Categoria: Vestuário
--    Senha: teste123

-- 3. Salão de Beleza Elegância
--    CNPJ: 11122233000144
--    Categoria: Beleza
--    Senha: teste123

-- MORADORES PARA TESTE:
-- 1. João Silva
--    CPF: 12345678900
--    Senha: teste123

-- 2. Maria Oliveira
--    CPF: 98765432100
--    Senha: teste123

-- 3. Pedro Santos
--    CPF: 11122233344
--    Senha: teste123

-- =============================================
-- EXEMPLOS DE CUPONS (criar após cadastro)
-- =============================================

-- Exemplo 1: Desconto em Restaurante
-- Título: Pizza 20% OFF
-- Desconto: 20%
-- Validade: 30 dias a partir de hoje

-- Exemplo 2: Desconto em Vestuário
-- Título: Primeira Compra 15%
-- Desconto: 15%
-- Validade: 60 dias a partir de hoje

-- Exemplo 3: Desconto em Beleza
-- Título: Corte + Barba 25%
-- Desconto: 25%
-- Validade: 7 dias a partir de hoje

-- =============================================
-- VALIDADORES ONLINE ÚTEIS
-- =============================================

-- Gerar CPF válido: https://www.4devs.com.br/gerador_de_cpf
-- Gerar CNPJ válido: https://www.4devs.com.br/gerador_de_cnpj
-- Validar CPF/CNPJ: https://www.receita.fazenda.gov.br/

-- =============================================
-- FLUXO DE TESTE COMPLETO
-- =============================================

-- 1. SETUP INICIAL
--    - Execute supabase-schema.sql no Supabase SQL Editor
--    - Verifique se todas as 5 tabelas foram criadas
--    - Verifique se as 9 categorias foram inseridas

-- 2. TESTE DE CADASTRO
--    a) Cadastrar Comerciante:
--       - Acesse /cadastro-comercio
--       - Use CNPJ: 12345678000190
--       - Nome Fantasia: Restaurante do João
--       - Email: joao@restaurante.com
--       - Senha: teste123
--       - Preencha demais campos
--    
--    b) Cadastrar Morador:
--       - Acesse /cadastro-morador
--       - Use CPF: 12345678900
--       - Nome: João Silva
--       - Email: joao@email.com
--       - Senha: teste123

-- 3. TESTE DE LOGIN
--    a) Login como Comerciante:
--       - Tipo: Comerciante
--       - CNPJ: 12345678000190
--       - Senha: teste123
--    
--    b) Login como Morador:
--       - Tipo: Morador
--       - CPF: 12345678900
--       - Senha: teste123

-- 4. TESTE DE CRIAÇÃO DE CUPOM (como Comerciante)
--    - Acesse Dashboard do Comerciante
--    - Clique em "Criar Novo Cupom"
--    - Título: Pizza 20% OFF
--    - Desconto: 20
--    - Data Início: Hoje
--    - Data Fim: Hoje + 30 dias
--    - Salvar
--    - Verifique se o hash de 12 caracteres foi gerado

-- 5. TESTE DE RESERVA (como Morador)
--    - Faça logout do comerciante
--    - Login como morador
--    - Acesse Dashboard do Morador
--    - Vá para "Marketplace de Cupons"
--    - Encontre o cupom criado
--    - Clique em "Reservar Cupom"
--    - Vá para "Meus Cupons" e verifique a reserva

-- 6. TESTE DE VALIDAÇÃO (como Comerciante)
--    - Faça logout do morador
--    - Login como comerciante
--    - Acesse Dashboard
--    - Clique em "Ver Detalhes" no cupom
--    - Veja a reserva do morador
--    - Clique em "Validar Uso"
--    - Confirme

-- 7. TESTE DE FILTROS (como Morador)
--    - Crie múltiplos cupons com categorias diferentes
--    - Teste filtro por categoria
--    - Teste ordenação por:
--      * Mais recentes
--      * Maior desconto
--      * Próximos a expirar

-- =============================================
-- VERIFICAÇÕES NO SUPABASE
-- =============================================

-- Verificar usuários criados
-- SELECT * FROM auth.users;

-- Verificar comerciantes
-- SELECT * FROM public.COMERCIO;

-- Verificar moradores
-- SELECT * FROM public.ASSOCIADO;

-- Verificar cupons
-- SELECT * FROM public.CUPOM;

-- Verificar reservas
-- SELECT * FROM public.CUPOM_ASSOCIADO;

-- Verificar cupons com detalhes completos
-- SELECT 
--   c.*,
--   co.nom_fantasia_comercio,
--   cat.nom_categoria,
--   COUNT(ca.id_cupom_associado) as total_reservas
-- FROM public.CUPOM c
-- JOIN public.COMERCIO co ON c.cnpj_comercio = co.cnpj_comercio
-- JOIN public.CATEGORIA cat ON co.id_categoria = cat.id_categoria
-- LEFT JOIN public.CUPOM_ASSOCIADO ca ON c.num_cupom = ca.num_cupom
-- GROUP BY c.num_cupom, co.nom_fantasia_comercio, cat.nom_categoria;

-- =============================================
-- TESTES DE SEGURANÇA (RLS)
-- =============================================

-- 1. Tentar acessar cupons de outro comerciante
--    Resultado esperado: Não deve permitir

-- 2. Tentar modificar reserva de outro morador
--    Resultado esperado: Não deve permitir

-- 3. Tentar reservar cupom expirado
--    Resultado esperado: Não deve permitir (validação frontend)

-- 4. Tentar reservar mesmo cupom duas vezes
--    Resultado esperado: Erro de UNIQUE constraint

-- =============================================
-- CENÁRIOS DE ERRO PARA TESTAR
-- =============================================

-- 1. CPF/CNPJ inválido no cadastro
-- 2. Senha com menos de 6 caracteres
-- 3. Email já cadastrado
-- 4. Login com credenciais incorretas
-- 5. Criar cupom com data fim < data início
-- 6. Criar cupom com desconto > 100%
-- 7. Reservar cupom já reservado

-- =============================================
-- PERFORMANCE TEST
-- =============================================

-- Criar vários cupons (10-20)
-- Criar vários moradores (5-10)
-- Fazer múltiplas reservas
-- Testar filtros e ordenação no marketplace
-- Verificar tempo de carregamento

-- =============================================
-- FIM DOS DADOS DE TESTE
-- =============================================
