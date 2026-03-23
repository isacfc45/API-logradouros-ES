import fastify from 'fastify';
import Database from 'better-sqlite3';
import { normalizeString } from './services/normalization';
const server = fastify({ logger: true });
const DB_PATH = 'C:/Users/isacf/projetos/validador-ruas-es/logradouros.db';
const db = new Database(DB_PATH, { readonly: true });
server.get('/validar', async (request, reply) => {
    const { rua, cidade } = request.query;
    if (!rua) {
        return reply.status(400).send({ error: 'O parametro "rua" e obrigatorio.' });
    }
    const ruaNormalizada = normalizeString(rua);
    let query = 'SELECT * FROM logradouros WHERE nome_normalizado = ?';
    const params = [ruaNormalizada];
    if (cidade) {
        query += ' AND cidade_nome LIKE ?';
        params.push(`%${cidade}%`);
    }
    try {
        const results = db.prepare(query).all(...params);
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
        await server.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Servidor rodando em http://localhost:3000');
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map