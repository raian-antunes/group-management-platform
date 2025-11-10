# Group Management Platform

Plataforma de gestão colaborativa para gerenciamento de grupos, intenções de participação, anúncios e usuários.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (versão 12 ou superior)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/) ou [bun](https://bun.sh/)

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd group-management-platform
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"

# JWT Secret (use uma string aleatória de pelo menos 32 caracteres)
JWT_SECRET="sua-chave-secreta-jwt-min-32-chars-long"

# URLs da Aplicação
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**Importante:**

- Substitua `usuario`, `senha` e `nome_do_banco` pelas credenciais do seu PostgreSQL
- Gere uma chave JWT segura para produção (pode usar: `openssl rand -base64 32`)
- Em produção, altere as URLs para o domínio real da aplicação (ex: `https://seudominio.com`)

### 4. Configure o banco de dados

Execute os seguintes comandos para configurar o banco de dados:

```bash
# Gera as migrações baseadas no schema
npm run db:generate

# Aplica as migrações no banco de dados
npm run db:push

# Popula o banco com dados de demonstração (opcional)
npm run db:seed
```

O comando `db:seed` cria:

- 2 usuários de teste:
  - **Admin:** `admin@admin.com` / senha: `teste123`
  - **User:** `user@user.com` / senha: `teste123`
- Múltiplos anúncios de exemplo
- 20 intenções de participação com diferentes status

## 💻 Executando o Projeto

### Modo de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

### Modo de Produção

```bash
# Build da aplicação
npm run build

# Inicia o servidor de produção
npm start
```

## 📁 Estrutura do Projeto

```
├── app/                    # Rotas e páginas (Next.js App Router)
│   ├── (auth)/            # Páginas de autenticação (signin/signup)
│   ├── (landing)/         # Página inicial
│   ├── dashboard/         # Dashboard com anúncios, intenções e usuários
│   └── api/               # Rotas da API
├── components/            # Componentes React reutilizáveis
│   ├── ui/               # Componentes de interface
│   └── layout/           # Componentes de layout e formulários
├── drizzle/              # Configuração e schemas do banco de dados
│   ├── schema/           # Definições das tabelas
│   ├── config.ts         # Configuração do Drizzle ORM
│   └── seed.ts           # Script para popular o banco
├── lib/                  # Bibliotecas e utilitários
│   ├── actions/          # Server Actions
│   ├── dal/              # Data Access Layer
│   └── schemas/          # Schemas de validação
└── hooks/                # Custom React Hooks
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

### Banco de Dados

- `npm run db:generate` - Gera migrações do banco de dados
- `npm run db:push` - Aplica as migrações no banco
- `npm run db:migrate` - Executa as migrações
- `npm run db:seed` - Popula o banco com dados de teste

### Testes

- `npm run test` - Executa os testes em modo watch
- `npm run test:ui` - Abre a interface visual do Vitest
- `npm run test:coverage` - Executa os testes e gera relatório de cobertura

## 🔧 Tecnologias Utilizadas

### Core

- **Framework:** [Next.js 16](https://nextjs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)

### Autenticação & Segurança

- **Autenticação:** [JWT (Jose)](https://github.com/panva/jose)
- **Criptografia:** [bcrypt](https://www.npmjs.com/package/bcrypt)

### Interface & Estilização

- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Tabelas:** [TanStack Table](https://tanstack.com/table)
- **Tema:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Toast Notifications:** [Sonner](https://sonner.emilkowal.ski/)

### Testes

- **Test Framework:** [Vitest](https://vitest.dev/)
- **Testing Library:** [React Testing Library](https://testing-library.com/react)
- **Environment:** [jsdom](https://github.com/jsdom/jsdom)
- **Coverage:** [v8](https://v8.dev/blog/javascript-code-coverage)

## 📝 Funcionalidades

- ✅ Autenticação de usuários com JWT
- ✅ Gerenciamento de intenções de participação
- ✅ Sistema de anúncios
- ✅ Painel administrativo
- ✅ Gestão de usuários
- ✅ Sistema de convites
- ✅ Interface responsiva
- ✅ Testes automatizados com 92%+ de cobertura

## 🧪 Testes

O projeto possui uma suíte completa de testes automatizados:

### Estrutura de Testes

```
__tests__/
├── app/                    # Testes das páginas
│   ├── (auth)/            # Testes de autenticação
│   ├── (landing)/         # Testes da landing page
│   ├── api/               # Testes das rotas API
│   └── dashboard/         # Testes do dashboard
├── components/            # Testes dos componentes
├── hooks/                 # Testes dos hooks customizados
└── lib/                   # Testes dos utilitários
```

### Executando os Testes

```bash
# Modo watch (desenvolvimento)
npm run test

# Interface visual interativa
npm run test:ui

# Gerar relatório de cobertura
npm run test:coverage
```

### Cobertura Atual

- **Statements:** 92.95%
- **Branches:** 98.5%
- **Functions:** 78.26%
- **Lines:** 95.39%

O relatório de cobertura é gerado na pasta `coverage/` e pode ser visualizado abrindo o arquivo `coverage/index.html` no navegador.

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Autenticação baseada em JWT
- Validação de dados com schemas
- Proteção de rotas (middleware)
