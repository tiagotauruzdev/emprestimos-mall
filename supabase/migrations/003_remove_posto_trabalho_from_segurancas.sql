-- =====================================================
-- MIGRAÇÃO 003: REMOVER POSTO_TRABALHO DA TABELA SEGURANCAS
-- E ADICIONAR LOCAL_ENTREGA NA TABELA EMPRESTIMOS
-- =====================================================

-- 1. Adicionar campo local_entrega na tabela emprestimos
ALTER TABLE emprestimos 
ADD COLUMN IF NOT EXISTS local_entrega VARCHAR(20) CHECK (local_entrega IN ('espaco_familia', 'espaco_pet'));

-- 2. Remover a constraint do posto_trabalho antes de remover a coluna
ALTER TABLE segurancas 
DROP CONSTRAINT IF EXISTS segurancas_posto_trabalho_check;

-- 3. Remover o campo posto_trabalho da tabela segurancas
ALTER TABLE segurancas 
DROP COLUMN IF EXISTS posto_trabalho;

-- 4. Remover o índice relacionado ao posto_trabalho
DROP INDEX IF EXISTS idx_segurancas_posto;

-- 5. Atualizar os dados existentes dos seguranças (remover referência ao posto)
UPDATE segurancas SET 
    nome = 'João Silva',
    ativo = true
WHERE nome = 'João Silva';

UPDATE segurancas SET 
    nome = 'Maria Santos',
    ativo = true
WHERE nome = 'Maria Santos';

UPDATE segurancas SET 
    nome = 'Pedro Costa',
    ativo = true
WHERE nome = 'Pedro Costa';

UPDATE segurancas SET 
    nome = 'Ana Oliveira',
    ativo = true
WHERE nome = 'Ana Oliveira';

-- 6. Criar índice para o novo campo local_entrega
CREATE INDEX IF NOT EXISTS idx_emprestimos_local_entrega ON emprestimos(local_entrega);

-- 7. Atualizar a view de empréstimos ativos para incluir local_entrega
CREATE OR REPLACE VIEW vw_emprestimos_ativos AS
SELECT 
    e.id,
    c.nome as cliente_nome,
    c.telefone as cliente_telefone,
    c.categoria_cliente,
    eq.codigo as equipamento_codigo,
    eq.tipo_equipamento,
    eq.localizacao as equipamento_localizacao,
    e.local_entrega,
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

-- 8. Comentários
COMMENT ON COLUMN emprestimos.local_entrega IS 'Local onde o equipamento foi entregue ao cliente (espaco_familia ou espaco_pet)';