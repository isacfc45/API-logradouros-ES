# Estágio de Build
FROM node:22-slim AS builder

# Instalar dependências para módulos nativos (Python, G++, Make)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Rodar o build (ignora erros de tipos se necessário para o deploy rápido, mas vamos tentar o build limpo)
RUN npm run build

# Estágio de Produção
FROM node:22-slim

WORKDIR /app

# Copia apenas o necessário do estágio de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/logradouros.db ./logradouros.db

EXPOSE 3001

# No Easypanel/Produção, rodamos o código compilado em JS para ser mais leve
CMD ["node", "dist/server.js"]