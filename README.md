# Validador de Logradouros - Espírito Santo

API para validação de existência de ruas e cidades no estado do Espírito Santo, integrada com SQLite para alta performance.

## Como Rodar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Realize a ingestão dos dados (certifique-se de que o JSON está no caminho correto):
   ```bash
   npx tsx src/scripts/ingest.ts
   ```

3. Inicie o servidor:
   ```bash
   npm start
   ```

O servidor estará rodando em `http://localhost:3001`.

## Endpoints

### GET /validar

Valida se uma rua existe.

**Parâmetros (Query):**
- `rua` (obrigatório): Nome da rua.
- `cidade` (opcional): Nome da cidade para filtrar.

**Exemplo:**
`GET /validar?rua=QUINTINO BOCAIUVA&cidade=Vitória`

**Resposta:**
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