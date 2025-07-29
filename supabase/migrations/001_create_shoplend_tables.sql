-- =====================================================
-- MIGRAÇÕES PARA O SISTEMA SHOPLEND
-- Baseado no PRD - App de Empréstimo de Equipamentos
-- =====================================================

-- 1. TABELA CLIENTES
-- Armazena dados dos clientes que solicitam equipamentos
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    categoria_cliente VARCHAR(20) NOT NULL CHECK (categoria_cliente IN ('gestante', 'idoso', 'outros')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON clientes(cpf);
CREATE INDEX IF NOT EXISTS idx_clientes_telefone ON clientes(telefone);
CREATE INDEX IF NOT EXISTS idx_clientes_categoria ON clientes(categoria_cliente);

-- 2. TABELA SEGURANCAS
-- Armazena dados dos funcionários de segurança que operam o sistema
CREATE TABLE IF NOT EXISTS segurancas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    posto_trabalho VARCHAR(20) NOT NULL CHECK (posto_trabalho IN ('espaco_familia', 'espaco_pet')),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para consulta por posto de trabalho
CREATE INDEX IF NOT EXISTS idx_segurancas_posto ON segurancas(posto_trabalho);

-- 3. TABELA EQUIPAMENTOS
-- Armazena informações sobre os equipamentos disponíveis
CREATE TABLE IF NOT EXISTS equipamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_equipamento VARCHAR(20) NOT NULL CHECK (tipo_equipamento IN ('carrinho_bebe', 'cadeira_rodas', 'carrinho_pet')),
    codigo VARCHAR(20) NOT NULL UNIQUE, -- Ex: CB-001, CR-003, CP-002
    status VARCHAR(20) NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'em_uso', 'em_manutencao')),
    localizacao VARCHAR(20) NOT NULL CHECK (localizacao IN ('espaco_familia', 'espaco_pet')),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_equipamentos_tipo ON equipamentos(tipo_equipamento);
CREATE INDEX IF NOT EXISTS idx_equipamentos_status ON equipamentos(status);
CREATE INDEX IF NOT EXISTS idx_equipamentos_localizacao ON equipamentos(localizacao);
CREATE INDEX IF NOT EXISTS idx_equipamentos_codigo ON equipamentos(codigo);

-- 4. TABELA EMPRESTIMOS
-- Registra todos os empréstimos realizados
CREATE TABLE IF NOT EXISTS emprestimos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    equipamento_id UUID NOT NULL REFERENCES equipamentos(id) ON DELETE CASCADE,
    seguranca_id UUID NOT NULL REFERENCES segurancas(id) ON DELETE CASCADE,
    data_emprestimo TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tempo_uso_estimado INTEGER NOT NULL, -- em horas
    data_devolucao_prevista TIMESTAMP WITH TIME ZONE NOT NULL,
    data_devolucao_real TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'finalizado', 'atrasado')),
    termo_aceito BOOLEAN DEFAULT false,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_emprestimos_cliente ON emprestimos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_emprestimos_equipamento ON emprestimos(equipamento_id);
CREATE INDEX IF NOT EXISTS idx_emprestimos_seguranca ON emprestimos(seguranca_id);
CREATE INDEX IF NOT EXISTS idx_emprestimos_status ON emprestimos(status);
CREATE INDEX IF NOT EXISTS idx_emprestimos_data ON emprestimos(data_emprestimo);

-- 5. TABELA FILA_ESPERA
-- Gerencia a fila de espera quando não há equipamentos disponíveis
CREATE TABLE IF NOT EXISTS fila_espera (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    tipo_equipamento_solicitado VARCHAR(20) NOT NULL CHECK (tipo_equipamento_solicitado IN ('carrinho_bebe', 'cadeira_rodas', 'carrinho_pet')),
    data_entrada_fila TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    posicao INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'aguardando' CHECK (status IN ('aguardando', 'notificado', 'atendido', 'cancelado')),
    tempo_uso_estimado INTEGER NOT NULL, -- em horas
    notificado_em TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE, -- Quando a notificação expira (10 min após notificar)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para gerenciamento da fila
CREATE INDEX IF NOT EXISTS idx_fila_cliente ON fila_espera(cliente_id);
CREATE INDEX IF NOT EXISTS idx_fila_tipo_equipamento ON fila_espera(tipo_equipamento_solicitado);
CREATE INDEX IF NOT EXISTS idx_fila_status ON fila_espera(status);
CREATE INDEX IF NOT EXISTS idx_fila_posicao ON fila_espera(posicao);
CREATE INDEX IF NOT EXISTS idx_fila_data_entrada ON fila_espera(data_entrada_fila);

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA DE TIMESTAMPS
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para cada tabela
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_segurancas_updated_at BEFORE UPDATE ON segurancas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipamentos_updated_at BEFORE UPDATE ON equipamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emprestimos_updated_at BEFORE UPDATE ON emprestimos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fila_espera_updated_at BEFORE UPDATE ON fila_espera FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS (SEED DATA)
-- =====================================================

-- Inserir funcionários de segurança
INSERT INTO segurancas (nome, posto_trabalho) VALUES 
('João Silva', 'espaco_familia'),
('Maria Santos', 'espaco_familia'),
('Pedro Costa', 'espaco_pet'),
('Ana Oliveira', 'espaco_pet')
ON CONFLICT DO NOTHING;

-- Inserir equipamentos iniciais
INSERT INTO equipamentos (tipo_equipamento, codigo, localizacao) VALUES 
-- Carrinhos de Bebê
('carrinho_bebe', 'CB-001', 'espaco_familia'),
('carrinho_bebe', 'CB-002', 'espaco_familia'),
('carrinho_bebe', 'CB-003', 'espaco_familia'),
('carrinho_bebe', 'CB-004', 'espaco_familia'),
('carrinho_bebe', 'CB-005', 'espaco_familia'),

-- Cadeiras de Rodas
('cadeira_rodas', 'CR-001', 'espaco_familia'),
('cadeira_rodas', 'CR-002', 'espaco_familia'),
('cadeira_rodas', 'CR-003', 'espaco_familia'),
('cadeira_rodas', 'CR-004', 'espaco_familia'),

-- Carrinhos de Pet
('carrinho_pet', 'CP-001', 'espaco_pet'),
('carrinho_pet', 'CP-002', 'espaco_pet'),
('carrinho_pet', 'CP-003', 'espaco_pet')
ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- VIEWS ÚTEIS PARA CONSULTAS
-- =====================================================

-- View para consultar disponibilidade de equipamentos
CREATE OR REPLACE VIEW vw_disponibilidade_equipamentos AS
SELECT 
    tipo_equipamento,
    localizacao,
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'disponivel' THEN 1 END) as disponiveis,
    COUNT(CASE WHEN status = 'em_uso' THEN 1 END) as em_uso,
    COUNT(CASE WHEN status = 'em_manutencao' THEN 1 END) as em_manutencao
FROM equipamentos 
GROUP BY tipo_equipamento, localizacao;

-- View para empréstimos ativos com detalhes
CREATE OR REPLACE VIEW vw_emprestimos_ativos AS
SELECT 
    e.id,
    c.nome as cliente_nome,
    c.telefone as cliente_telefone,
    c.categoria_cliente,
    eq.codigo as equipamento_codigo,
    eq.tipo_equipamento,
    s.nome as seguranca_nome,
    e.data_emprestimo,
    e.data_devolucao_prevista,
    e.tempo_uso_estimado,
    CASE 
        WHEN e.data_devolucao_prevista < NOW() THEN 'atrasado'
        ELSE e.status
    END as status_atual
FROM emprestimos e
JOIN clientes c ON e.cliente_id = c.id
JOIN equipamentos eq ON e.equipamento_id = eq.id
JOIN segurancas s ON e.seguranca_id = s.id
WHERE e.status = 'ativo';

-- View para fila de espera ordenada
CREATE OR REPLACE VIEW vw_fila_espera_ordenada AS
SELECT 
    f.id,
    c.nome as cliente_nome,
    c.telefone as cliente_telefone,
    c.categoria_cliente,
    f.tipo_equipamento_solicitado,
    f.posicao,
    f.data_entrada_fila,
    f.status,
    f.tempo_uso_estimado
FROM fila_espera f
JOIN clientes c ON f.cliente_id = c.id
WHERE f.status IN ('aguardando', 'notificado')
ORDER BY f.tipo_equipamento_solicitado, f.posicao;

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================

COMMENT ON TABLE clientes IS 'Dados dos clientes que solicitam equipamentos';
COMMENT ON TABLE segurancas IS 'Funcionários de segurança que operam o sistema';
COMMENT ON TABLE equipamentos IS 'Equipamentos disponíveis para empréstimo';
COMMENT ON TABLE emprestimos IS 'Registro de todos os empréstimos realizados';
COMMENT ON TABLE fila_espera IS 'Fila de espera quando não há equipamentos disponíveis';

-- =====================================================
-- FIM DAS MIGRAÇÕES
-- =====================================================