-- =============================================
-- SISTEMA DE CUPONS - SCRIPT SQL COMPLETO
-- =============================================
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- 1. TABELA CATEGORIA
CREATE TABLE IF NOT EXISTS public.CATEGORIA (
    id_categoria SERIAL PRIMARY KEY,
    nom_categoria VARCHAR(25) NOT NULL
);

-- 2. TABELA COMERCIO
CREATE TABLE IF NOT EXISTS public.COMERCIO (
    cnpj_comercio VARCHAR(14) PRIMARY KEY,
    auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    id_categoria INTEGER NOT NULL REFERENCES public.CATEGORIA(id_categoria) ON DELETE RESTRICT,
    raz_social_comercio VARCHAR(50) NOT NULL,
    nom_fantasia_comercio VARCHAR(30) NOT NULL,
    end_comercio VARCHAR(40),
    bai_comercio VARCHAR(30),
    cep_comercio VARCHAR(8),
    cid_comercio VARCHAR(40),
    uf_comercio CHAR(2),
    con_comercio VARCHAR(15),
    email_comercio VARCHAR(50) NOT NULL,
    sen_comercio VARCHAR(20), -- Campo legacy (a senha real é gerida pelo Supabase Auth)
    UNIQUE(auth_user_id)
);

-- 3. TABELA ASSOCIADO
CREATE TABLE IF NOT EXISTS public.ASSOCIADO (
    cpf_associado VARCHAR(11) PRIMARY KEY,
    auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nom_associado VARCHAR(40) NOT NULL,
    dtn_associado DATE,
    end_associado VARCHAR(40),
    bai_associado VARCHAR(30),
    cep_associado VARCHAR(8),
    cid_associado VARCHAR(40),
    uf_associado CHAR(2),
    cel_associado VARCHAR(15),
    email_associado VARCHAR(50) NOT NULL,
    sen_associado VARCHAR(20), -- Campo legacy (a senha real é gerida pelo Supabase Auth)
    UNIQUE(auth_user_id)
);

-- 4. TABELA CUPOM
CREATE TABLE IF NOT EXISTS public.CUPOM (
    num_cupom CHAR(12) PRIMARY KEY,
    cnpj_comercio VARCHAR(14) NOT NULL REFERENCES public.COMERCIO(cnpj_comercio) ON DELETE CASCADE,
    tit_cupom VARCHAR(25) NOT NULL,
    dta_emissao_cupom DATE NOT NULL DEFAULT CURRENT_DATE,
    dta_inicio_cupom DATE NOT NULL,
    dta_termino_cupom DATE NOT NULL,
    per_desc_cupom NUMERIC(4,2) NOT NULL CHECK (per_desc_cupom >= 0 AND per_desc_cupom <= 1),
    CONSTRAINT check_datas CHECK (dta_termino_cupom >= dta_inicio_cupom)
);

-- 5. TABELA CUPOM_ASSOCIADO (Reserva/Uso)
CREATE TABLE IF NOT EXISTS public.CUPOM_ASSOCIADO (
    id_cupom_associado SERIAL PRIMARY KEY,
    num_cupom CHAR(12) NOT NULL REFERENCES public.CUPOM(num_cupom) ON DELETE CASCADE,
    cpf_associado VARCHAR(11) NOT NULL REFERENCES public.ASSOCIADO(cpf_associado) ON DELETE CASCADE,
    dta_cupom_associado DATE NOT NULL DEFAULT CURRENT_DATE,
    dta_uso_cupom_associado DATE,
    UNIQUE(num_cupom, cpf_associado)
);

-- =============================================
-- INSERIR CATEGORIAS PADRÃO
-- =============================================
INSERT INTO public.CATEGORIA (nom_categoria) VALUES 
    ('Alimentação'),
    ('Vestuário'),
    ('Serviços'),
    ('Saúde'),
    ('Beleza'),
    ('Educação'),
    ('Entretenimento'),
    ('Eletrônicos'),
    ('Outros')
ON CONFLICT DO NOTHING;

-- =============================================
-- CONFIGURAÇÃO DE ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.CATEGORIA ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.COMERCIO ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ASSOCIADO ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.CUPOM ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.CUPOM_ASSOCIADO ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS RLS - CATEGORIA
-- =============================================
-- Todos podem ler categorias
CREATE POLICY "Permitir leitura de categorias para todos"
    ON public.CATEGORIA FOR SELECT
    USING (true);

-- =============================================
-- POLÍTICAS RLS - COMERCIO
-- =============================================
-- Comerciante pode ler apenas seus próprios dados
CREATE POLICY "Comerciante pode ler seus próprios dados"
    ON public.COMERCIO FOR SELECT
    USING (auth.uid() = auth_user_id);

-- Comerciante pode atualizar apenas seus próprios dados
CREATE POLICY "Comerciante pode atualizar seus próprios dados"
    ON public.COMERCIO FOR UPDATE
    USING (auth.uid() = auth_user_id);

-- Permitir inserção durante cadastro (sem autenticação ainda)
CREATE POLICY "Permitir inserção de comércio durante cadastro"
    ON public.COMERCIO FOR INSERT
    WITH CHECK (true);

-- Associados podem ver dados básicos de comércios (para marketplace)
CREATE POLICY "Associados podem ver comércios"
    ON public.COMERCIO FOR SELECT
    USING (true);

-- =============================================
-- POLÍTICAS RLS - ASSOCIADO
-- =============================================
-- Associado pode ler apenas seus próprios dados
CREATE POLICY "Associado pode ler seus próprios dados"
    ON public.ASSOCIADO FOR SELECT
    USING (auth.uid() = auth_user_id);

-- Associado pode atualizar apenas seus próprios dados
CREATE POLICY "Associado pode atualizar seus próprios dados"
    ON public.ASSOCIADO FOR UPDATE
    USING (auth.uid() = auth_user_id);

-- Permitir inserção durante cadastro (sem autenticação ainda)
CREATE POLICY "Permitir inserção de associado durante cadastro"
    ON public.ASSOCIADO FOR INSERT
    WITH CHECK (true);

-- =============================================
-- POLÍTICAS RLS - CUPOM
-- =============================================
-- Comerciante pode gerenciar apenas seus próprios cupons
CREATE POLICY "Comerciante pode ler seus próprios cupons"
    ON public.CUPOM FOR SELECT
    USING (
        cnpj_comercio IN (
            SELECT cnpj_comercio FROM public.COMERCIO WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Comerciante pode inserir cupons"
    ON public.CUPOM FOR INSERT
    WITH CHECK (
        cnpj_comercio IN (
            SELECT cnpj_comercio FROM public.COMERCIO WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Comerciante pode atualizar seus cupons"
    ON public.CUPOM FOR UPDATE
    USING (
        cnpj_comercio IN (
            SELECT cnpj_comercio FROM public.COMERCIO WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Comerciante pode deletar seus cupons"
    ON public.CUPOM FOR DELETE
    USING (
        cnpj_comercio IN (
            SELECT cnpj_comercio FROM public.COMERCIO WHERE auth_user_id = auth.uid()
        )
    );

-- Associados podem ver todos os cupons disponíveis (marketplace)
CREATE POLICY "Associados podem ver cupons disponíveis"
    ON public.CUPOM FOR SELECT
    USING (
        -- Cupom está dentro do período de validade
        CURRENT_DATE >= dta_inicio_cupom AND CURRENT_DATE <= dta_termino_cupom
    );

-- =============================================
-- POLÍTICAS RLS - CUPOM_ASSOCIADO
-- =============================================
-- Associado pode ver apenas suas próprias reservas
CREATE POLICY "Associado pode ver suas reservas"
    ON public.CUPOM_ASSOCIADO FOR SELECT
    USING (
        cpf_associado IN (
            SELECT cpf_associado FROM public.ASSOCIADO WHERE auth_user_id = auth.uid()
        )
    );

-- Associado pode criar reservas
CREATE POLICY "Associado pode criar reservas"
    ON public.CUPOM_ASSOCIADO FOR INSERT
    WITH CHECK (
        cpf_associado IN (
            SELECT cpf_associado FROM public.ASSOCIADO WHERE auth_user_id = auth.uid()
        )
    );

-- Associado pode atualizar suas reservas (marcar como usado)
CREATE POLICY "Associado pode atualizar suas reservas"
    ON public.CUPOM_ASSOCIADO FOR UPDATE
    USING (
        cpf_associado IN (
            SELECT cpf_associado FROM public.ASSOCIADO WHERE auth_user_id = auth.uid()
        )
    );

-- Comerciante pode ver reservas de seus cupons
CREATE POLICY "Comerciante pode ver reservas de seus cupons"
    ON public.CUPOM_ASSOCIADO FOR SELECT
    USING (
        num_cupom IN (
            SELECT c.num_cupom 
            FROM public.CUPOM c
            JOIN public.COMERCIO co ON c.cnpj_comercio = co.cnpj_comercio
            WHERE co.auth_user_id = auth.uid()
        )
    );

-- Comerciante pode atualizar reservas de seus cupons (validar uso)
CREATE POLICY "Comerciante pode validar uso de cupons"
    ON public.CUPOM_ASSOCIADO FOR UPDATE
    USING (
        num_cupom IN (
            SELECT c.num_cupom 
            FROM public.CUPOM c
            JOIN public.COMERCIO co ON c.cnpj_comercio = co.cnpj_comercio
            WHERE co.auth_user_id = auth.uid()
        )
    );

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX idx_comercio_auth_user ON public.COMERCIO(auth_user_id);
CREATE INDEX idx_associado_auth_user ON public.ASSOCIADO(auth_user_id);
CREATE INDEX idx_cupom_comercio ON public.CUPOM(cnpj_comercio);
CREATE INDEX idx_cupom_datas ON public.CUPOM(dta_inicio_cupom, dta_termino_cupom);
CREATE INDEX idx_cupom_associado_cupom ON public.CUPOM_ASSOCIADO(num_cupom);
CREATE INDEX idx_cupom_associado_cpf ON public.CUPOM_ASSOCIADO(cpf_associado);

-- =============================================
-- FUNÇÕES AUXILIARES
-- =============================================

-- Função para verificar se um cupom está válido
CREATE OR REPLACE FUNCTION public.cupom_valido(p_num_cupom CHAR(12))
RETURNS BOOLEAN AS $$
DECLARE
    v_valido BOOLEAN;
BEGIN
    SELECT 
        CURRENT_DATE >= dta_inicio_cupom AND CURRENT_DATE <= dta_termino_cupom
    INTO v_valido
    FROM public.CUPOM
    WHERE num_cupom = p_num_cupom;
    
    RETURN COALESCE(v_valido, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SCRIPT CONCLUÍDO
-- =============================================
-- Próximos passos:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Verifique se todas as tabelas foram criadas
-- 3. Configure as variáveis de ambiente no projeto Nuxt
-- =============================================
