"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs_1 = __importDefault(require("fs"));
const normalization_1 = require("../services/normalization");
const JSON_PATH = 'C:/Users/isacf/Downloads/json_final_unificado.json';
const DB_PATH = 'C:/Users/isacf/projetos/validador-ruas-es/logradouros.db';
function runIngestion() {
    console.log('--- Iniciando Ingestao de Dados ---');
    if (!fs_1.default.existsSync(JSON_PATH)) {
        console.error('Arquivo JSON nao encontrado:', JSON_PATH);
        process.exit(1);
    }
    const db = new better_sqlite3_1.default(DB_PATH);
    db.exec('CREATE TABLE IF NOT EXISTS logradouros (id INTEGER PRIMARY KEY AUTOINCREMENT, cidade_id INTEGER, cidade_nome TEXT, tipo TEXT, nome TEXT, nome_normalizado TEXT)');
    db.prepare('DELETE FROM logradouros').run();
    const rawData = fs_1.default.readFileSync(JSON_PATH, 'utf8');
    const logradouros = JSON.parse(rawData);
    const insert = db.prepare('INSERT INTO logradouros (cidade_id, cidade_nome, tipo, nome, nome_normalizado) VALUES (?, ?, ?, ?, ?)');
    const transaction = db.transaction((items) => {
        for (const item of items) {
            insert.run(item.id, item.name, item.NM_TIP_LOG, item.NM_LOG, (0, normalization_1.normalizeString)(item.NM_LOG));
        }
    });
    console.log('Processando ' + logradouros.length + ' registros...');
    transaction(logradouros);
    console.log('Criando indices...');
    db.exec('CREATE INDEX IF NOT EXISTS idx_nome_norm ON logradouros (nome_normalizado)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_cidade ON logradouros (cidade_nome)');
    console.log('Ingestao concluida com sucesso!');
    db.close();
}
runIngestion();
