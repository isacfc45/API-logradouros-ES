"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const normalization_1 = require("./services/normalization");
const path_1 = __importDefault(require("path"));
const server = (0, fastify_1.default)({ logger: true });
// Usando caminho relativo para funcionar em qualquer ambiente (Windows/Docker)
const DB_PATH = path_1.default.join(process.cwd(), 'logradouros.db');
const db = new better_sqlite3_1.default(DB_PATH, { readonly: true });
server.get('/validar', async (request, reply) => {
    const { rua, cidade } = request.query;
    if (!rua) {
        return reply.status(400).send({ error: 'O parametro "rua" e obrigatorio.' });
    }
    const ruaNormalizada = (0, normalization_1.normalizeString)(rua);
    let query = 'SELECT * FROM logradouros WHERE nome_normalizado = ?';
    const params = [ruaNormalizada];
    if (cidade) {
        query += ' AND cidade_nome LIKE ?';
        params.push(`%${cidade}%`);
    }
    try {
        let results = db.prepare(query).all(...params);
        if (results.length === 0) {
            let partialQuery = 'SELECT * FROM logradouros WHERE nome_normalizado LIKE ?';
            const partialParams = [`%${ruaNormalizada}%`];
            if (cidade) {
                partialQuery += ' AND cidade_nome LIKE ?';
                partialParams.push(`%${cidade}%`);
            }
            results = db.prepare(partialQuery).all(...partialParams);
        }
        return {
            existe: results.length > 0,
            total: results.length,
            resultados: results.map((r) => ({
                id_cidade: r.cidade_id,
                cidade: r.cidade_nome,
                tipo: r.tipo,
                nome: r.nome
            }))
        };
    }
    catch (err) {
        console.error(err);
        return reply.status(500).send({ error: 'Erro ao consultar o banco de dados.' });
    }
});
const start = async () => {
    try {
        // Porta via variavel de ambiente ou 3001
        const port = Number(process.env.PORT) || 3001;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Servidor rodando em http://0.0.0.0:${port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
