FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# O banco de dados SQLite precisa estar no container ou em um volume
COPY --from=builder /app/logradouros.db ./logradouros.db

EXPOSE 3001
CMD ["npm", "start"]