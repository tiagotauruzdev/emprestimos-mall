-- Migração para ajustar a lógica de localização
-- Seguranças não têm posto fixo, localização é definida no empréstimo

-- 1. Remover a constraint de posto_trabalho da tabela segurancas
ALTER TABLE segurancas DROP CONSTRAINT IF EXISTS segurancas_posto_trabalho_check;

-- 2. Remover a coluna posto_trabalho da tabela segurancas
ALTER TABLE segurancas DROP COLUMN IF EXISTS posto_trabalho;

-- 3. Adicionar coluna de localização na tabela emprestimos
ALTER TABLE emprestimos ADD COLUMN IF NOT EXISTS localizacao VARCHAR(20) CHECK (localizacao IN ('espaco_familia', 'espaco_pet'));

-- 4. Atualizar dados existentes (se houver)
-- Definir localização baseada no tipo de equipamento para empréstimos existentes
UPDATE emprestimos 
SET localizacao = CASE 
    WHEN EXISTS (
        SELECT 1 FROM equipamentos e 
        WHERE e.id = emprestimos.equipamento_id 
        AND e.tipo_equipamento IN ('carrinho_bebe', 'cadeira_rodas')
    ) THEN 'espaco_familia'
    WHEN EXISTS (
        SELECT 1 FROM equipamentos e 
        WHERE e.id = emprestimos.equipamento_id 
        AND e.tipo_equipamento = 'carrinho_pet'
    ) THEN 'espaco_pet'
    ELSE 'espaco_familia'
END
WHERE localizacao IS NULL;

-- 5. Tornar a coluna localizacao obrigatória
ALTER TABLE emprestimos ALTER COLUMN localizacao SET NOT NULL;

-- 6. Criar índice para a nova coluna
CREATE INDEX IF NOT EXISTS idx_emprestimos_localizacao ON emprestimos(localizacao);

-- 7. Atualizar a view de disponibilidade para não depender do posto do segurança
DROP VIEW IF EXISTS vw_disponibilidade_equipamentos;

CREATE VIEW vw_disponibilidade_equipamentos AS
SELECT 
    e.tipo_equipamento,
    e.localizacao,
    COUNT(*) as total,
    COUNT(CASE WHEN e.status = 'disponivel' THEN 1 END) as disponiveis,
    COUNT(CASE WHEN e.status = 'em_uso' THEN 1 END) as em_uso,
    COUNT(CASE WHEN e.status = 'em_manutencao' THEN 1 END) as em_manutencao
FROM equipamentos e
GROUP BY e.tipo_equipamento, e.localizacao;

-- 8. Atualizar a view de empréstimos ativos para incluir localização
DROP VIEW IF EXISTS vw_emprestimos_ativos;

CREATE VIEW vw_emprestimos_ativos AS
SELECT 
    emp.id,
    eq.codigo as codigo_equipamento,
    eq.tipo_equipamento,
    c.nome as nome_cliente,
    emp.data_emprestimo,
    emp.data_devolucao_prevista as prazo_devolucao,
    emp.localizacao,
    s.nome as nome_operador
FROM emprestimos emp
JOIN equipamentos eq ON emp.equipamento_id = eq.id
JOIN clientes c ON emp.cliente_id = c.id
JOIN segurancas s ON emp.seguranca_id = s.id
WHERE emp.status = 'ativo'
ORDER BY emp.data_emprestimo DESC;

-- 9. Comentários para documentação
COMMENT ON COLUMN emprestimos.localizacao IS 'Local onde o equipamento foi retirado: espaco_familia ou espaco_pet';
COMMENT ON TABLE segurancas IS 'Funcionários de segurança - podem trabalhar em qualquer localização';
COMMENT ON VIEW vw_disponibilidade_equipamentos IS 'Disponibilidade de equipamentos por tipo e localização';
COMMENT ON VIEW vw_emprestimos_ativos IS 'Empréstimos ativos com informações completas incluindo localização';