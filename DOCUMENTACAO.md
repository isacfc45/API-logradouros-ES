# 📑 Documentação Técnica: API de Validação de Logradouros (ES)

## 1. Visão Geral
A **API de Validação de Logradouros** é um serviço backend de alta performance desenvolvido para validar a existência de ruas e cidades no estado do Espírito Santo. O sistema processa uma base de dados de mais de **35.000 registros** e fornece respostas rápidas via integração HTTP.

### Objetivo
Sanitizar e validar dados de endereços em sistemas de cadastro, CRMs ou workflows de automação (como n8n), reduzindo erros de digitação e inconsistências geográficas.

---

## 2. Pilha Tecnológica (Tech Stack)
*   **Ambiente de Execução:** Node.js v22+
*   **Linguagem:** TypeScript
*   **Framework Web:** Fastify (Otimizado para baixa latência)
*   **Banco de Dados:** SQLite (better-sqlite3) - Armazenamento em arquivo local.
*   **Processamento de Texto:** unidecode (Remoção de acentuação).
*   **Infraestrutura:** Docker & Easypanel.

---

## 3. Arquitetura do Sistema

### 3.1 Camada de Dados
Diferente de APIs tradicionais que dependem de um servidor de banco de dados externo (como MySQL ou Postgres), esta solução utiliza **SQLite**. 
*   **Vantagem:** O banco de dados (logradouros.db) viaja junto com a aplicação no Docker.
*   **Performance:** Consultas locais em milissegundos, sem latência de rede entre aplicação e banco.

### 3.2 Lógica de Normalização
Para evitar falhas por diferenças de acentuação ou caixa (maiusculização), a API aplica uma função de **Normalização** em todas as buscas:
1.  **Entrada:** "Avenida São José"
2.  **Processamento:** Remove acentos (ã -> a), converte para minúsculas e remove caracteres especiais.
3.  **Saída:** avenida sao jose
Esta lógica garante que o sistema encontre a rua independentemente de como o usuário a escreveu.

### 3.3 Estratégia de Busca (Fallback)
A API executa uma busca inteligente em dois níveis:
1.  **Nível 1 (Exato):** Tenta encontrar o nome idêntico ao normalizado.
2.  **Nível 2 (Parcial):** Caso não encontre o exato, utiliza o operador LIKE para buscar termos contidos (Ex: buscar "Lacerda" encontrará "Eliezer Lacerda Fafa").

---

## 4. Guia de Integração (API)

### Endpoint Principal
`GET /validar`

### Parâmetros da Requisição (Query Strings)
| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| rua | string | Sim | Nome da rua ou parte dele para validação. |
| cidade | string | Não | Nome da cidade para filtrar a busca. |

### Exemplos de Chamada
*   **Busca por Rua:** https://seu-dominio.com/validar?rua=mexico
*   **Busca Filtrada:** https://seu-dominio.com/validar?rua=vitoria&cidade=Viana

### Estrutura de Resposta (JSON)
```json
{
  "existe": true,
  "total": 1,
  "resultados": [
    {
      "id_cidade": 3205309,
      "cidade": "Vitória",
      "tipo": "RUA",
      "nome": "QUINTINO BOCAIUVA"
    }
  ]
}
```

---

## 5. Integração com n8n
Para integrar este sistema ao seu workflow do n8n:
1.  Utilize o nó **HTTP Request**.
2.  **Method:** GET.
3.  **URL:** https://seu-dominio.com/validar.
4.  **Query Parameters:**
    *   rua: {{ $json.campo_da_rua }}
    *   cidade: {{ $json.campo_da_cidade }}
5.  **Validação:** Utilize um nó **If** para verificar se existe é igual a true.

---

## 6. Manutenção e Deploy

### Atualização de Dados
Para atualizar a lista de ruas:
1.  Substitua o arquivo json_final_unificado.json.
2.  Execute npm run ingest para atualizar o arquivo .db.
3.  Faça o push para o GitHub.

### Configurações de Produção (Easypanel/Docker)
*   **Porta Exposta:** 3001
*   **Variáveis de Ambiente:** PORT (opcional, padrão 3001).
*   **Build:** O Dockerfile realiza o build do TypeScript e instala dependências nativas (C++) necessárias para o SQLite.