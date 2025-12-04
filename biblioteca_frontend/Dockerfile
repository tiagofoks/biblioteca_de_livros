# Estágio de Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copia package.json e instala dependências
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copia o código fonte
COPY . .

# Comando de Build do Next.js
RUN npm run build

# Estágio de Produção
FROM node:20-alpine AS runner
WORKDIR /app

# Instala apenas as dependências de produção
COPY --from=builder /app/package.json ./
RUN npm install --only=production

# Copia as pastas essenciais para produção
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Variável de ambiente (define onde a aplicação estará acessível)
ENV PORT 3000

# Comando para rodar a aplicação em produção
CMD ["npm", "start"]