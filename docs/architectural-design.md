# Architectural Design

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENTE (Browser)                         │
│                                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌─────────────┐    │
│  │ Landing    │  │  Auth      │  │ Dashboard  │  │  Components │    │
│  │ Pages      │  │ (Sign In/  │  │  Pages     │  │   (UI)      │    │
│  │            │  │  Sign Up)  │  │            │  │             │    │
│  └────────────┘  └────────────┘  └────────────┘  └─────────────┘    │
│                                                                     │
│                    ↓ HTTP/HTTPS (Fetch API) ↓                       │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION (Full-Stack)                 │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND LAYER                             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │  │
│  │  │ React    │  │ Server   │  │ Hooks    │  │ Schemas  │       │  │
│  │  │Components│  │Components│  │          │  │(Zod)     │       │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                │                                    │
│                                ↓ Server Actions / API Routes        │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    BACKEND LAYER                              │  │
│  │                                                               │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │              API ROUTES (/app/api)                      │  │  │
│  │  │  • /announcement  • /invite                             │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                                │                              │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │              SERVER ACTIONS (lib/actions)               │  │  │
│  │  │  • auth.ts  • intention.ts  • invite.ts  • user.ts      │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                                │                              │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │          DATA ACCESS LAYER (lib/dal)                    │  │  │
│  │  │  • announcement.ts  • intention.ts                      │  │  │
│  │  │  • invite.ts        • user.ts                           │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                                │                              │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │               ORM (Drizzle ORM)                         │  │  │
│  │  │  • Schema Definitions  • Query Builder                  │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                │                                    │
│                                ↓ SQL Queries                        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE (PostgreSQL)                          │
│                                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌─────────────┐    │
│  │   users    │  │ intentions │  │  invites   │  │announcements│    │
│  └────────────┘  └────────────┘  └────────────┘  └─────────────┘    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌─────────────┐    │
│  │  meetings  │  │  payments  │  │   plans    │  │subscriptions│    │
│  └────────────┘  └────────────┘  └────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

## Fluxo de Comunicação

### 1. Requisição do Cliente

```
Cliente → Next.js Frontend (React Components)
```

- Usuário interage com componentes React
- Forms e UI components capturam input do usuário

### 2. Camada de Aplicação

```
Frontend → Server Actions / API Routes → DAL → Drizzle ORM → PostgreSQL
```

- **Server Actions**: Lógica executada no servidor (autenticação, CRUD)
- **API Routes**: Endpoints REST para operações específicas
- **DAL**: Camada de abstração para acesso aos dados
- **Drizzle ORM**: Traduz operações para SQL type-safe

### 3. Resposta ao Cliente

```
PostgreSQL → Drizzle ORM → DAL → Server Actions/API → Frontend → Cliente
```

- Dados são retornados pela cadeia reversa
- Frontend renderiza os dados recebidos

## Tecnologias Principais

- **Frontend**: Next.js 16, React 19, TailwindCSS, Radix UI
- **Backend**: Next.js API Routes, Server Actions
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Autenticação**: JWT (jose library)
- **Validação**: Zod schemas
- **UI Components**: Radix UI + shadcn/ui
