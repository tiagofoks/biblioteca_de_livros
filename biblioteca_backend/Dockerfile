# Estágio de Build: Compila o TypeScript para JavaScript
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
# Instala as dependências, incluindo as de desenvolvimento para compilação
RUN npm install

# Copia todo o código fonte
COPY . .

# Compila o projeto NestJS
RUN npm run build

# Estágio de Produção: Imagem final com apenas o necessário para rodar
FROM node:20-alpine AS production

# Define variáveis de ambiente de produção
ENV NODE_ENV production
# Define a porta que a aplicação vai rodar dentro do container
ENV PORT 3001

WORKDIR /app

# Copia apenas os arquivos de produção e o código compilado
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist

# Expõe a porta
EXPOSE 3001

# Comando para rodar a aplicação NestJS
CMD ["node", "dist/main"]
