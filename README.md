# Sistema de Gerenciamento de Biblioteca

Sistema completo de gerenciamento de livros com backend NestJS, frontend Next.js e banco de dados PostgreSQL, tudo containerizado com Docker.

## 🚀 Tecnologias

### Backend
- **NestJS** - Framework Node.js
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **Class Validator** - Validação de dados

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP

## 📋 Funcionalidades

- ✅ Cadastro de livros
- ✅ Listagem de livros com busca
- ✅ Visualização de detalhes
- ✅ Edição de livros
- ✅ Exclusão lógica (soft delete)
- ✅ Validação de dados
- ✅ Interface responsiva

## 🐳 Como Executar com Docker

### Pré-requisitos
- Docker
- Docker Compose

### Passos

1. **Clone o repositório** (se aplicável)

2. **Inicie os containers:**
```bash
docker-compose up --build
```

3. **Acesse a aplicação:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - PostgreSQL: localhost:5432

### Comandos Úteis

```bash
# Parar os containers
docker-compose down

# Ver logs
docker-compose logs -f

# Reconstruir apenas um serviço
docker-compose up --build backend
docker-compose up --build frontend

# Limpar volumes (CUIDADO: apaga dados do banco)
docker-compose down -v
```

## 🛠️ Desenvolvimento Local (sem Docker)

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Banco de Dados

Configure um PostgreSQL local e ajuste as variáveis de ambiente no arquivo `.env`.

## 📁 Estrutura do Projeto

```
.
├── backend/
│   ├── src/
│   │   ├── books/
│   │   │   ├── dto/
│   │   │   ├── book.entity.ts
│   │   │   ├── books.controller.ts
│   │   │   ├── books.service.ts
│   │   │   └── books.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── books/[id]/
│   │   │   └── page.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env
└── README.md
```

## 🔧 Variáveis de Ambiente

Arquivo `.env` na raiz do projeto:

```env
# PostgreSQL
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=bookdb
POSTGRES_PORT=5432

# Backend
API_PORT=3001
DATABASE_URL=postgres://user:password@db:5432/bookdb

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_PORT=3000
```

## 🐛 Problemas Comuns

### Porta já em uso
Se as portas 3000, 3001 ou 5432 já estiverem em uso:
```bash
# Encontrar processo usando a porta
lsof -i :3000
# Matar o processo
kill -9 <PID>
```

### Erro de conexão com o banco
Certifique-se de que o container do PostgreSQL está saudável:
```bash
docker-compose ps
```

### Frontend não conecta ao backend
Verifique a variável `NEXT_PUBLIC_API_URL` no docker-compose.yml e no .env.

## 📝 API Endpoints

### Books

- `GET /books` - Lista todos os livros (com busca opcional)
- `GET /books/:id` - Busca livro por ID
- `POST /books` - Cria novo livro
- `PATCH /books/:id` - Atualiza livro
- `DELETE /books/:id` - Exclusão lógica do livro

### Exemplo de Requisição

```bash
# Criar livro
curl -X POST http://localhost:3001/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "isbn": "978-0451524935",
    "publication_year": 1949,
    "description": "Distopia clássica"
  }'
