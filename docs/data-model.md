# Modelo de Dados - Plataforma de Gestão de Grupos

## Justificativa da Escolha do Banco de Dados

### PostgreSQL

O PostgreSQL foi escolhido como sistema gerenciador de banco de dados para este projeto pelos seguintes motivos:

#### 1. **Relacionamentos Complexos**

- A plataforma possui múltiplos relacionamentos entre entidades (usuários, reuniões, pagamentos, assinaturas, etc.)
- PostgreSQL oferece suporte robusto para chaves estrangeiras, integridade referencial e constraints
- Facilita consultas complexas com JOINs eficientes

#### 2. **ACID Compliance**

- Transações financeiras (pagamentos) requerem garantias de atomicidade, consistência, isolamento e durabilidade
- PostgreSQL garante que operações críticas (criação de usuário + assinatura + pagamento) sejam completadas com sucesso ou revertidas completamente

#### 3. **Tipos de Dados Nativos**

- Suporte a ENUM para status (intentions_status, payment_status, user_role)

#### 4. **Escalabilidade e Performance**

- Query optimizer eficiente para consultas complexas
- Capacidade de lidar com grandes volumes de dados

#### 5. **Ecossistema e Ferramentas**

- Excelente integração com Drizzle ORM (TypeScript-first)
- Ferramentas de migração robustas
- Suporte a conexões via URL (DATABASE_URL)
- Ampla comunidade e documentação

#### 6. **Segurança**

- Autenticação e autorização granular
- Criptografia de dados

---

## Esquema do Banco de Dados

### Visão Geral das Tabelas

1. **users** - Usuários da plataforma
2. **intentions** - Intenções de cadastro (pré-registro)
3. **invites** - Convites gerados para novos usuários
4. **announcements** - Anúncios publicados por usuários
5. **meetings** - Reuniões agendadas
6. **meetings_to_users** - Relação N:N entre reuniões e usuários (presença)
7. **plans** - Planos de assinatura disponíveis
8. **subscriptions** - Assinaturas ativas dos usuários
9. **payments** - Pagamentos relacionados às assinaturas

---

## Detalhamento das Tabelas

### 1. users (Usuários)

Armazena informações dos usuários cadastrados na plataforma.

| Campo      | Tipo      | Restrições               | Descrição                               |
| ---------- | --------- | ------------------------ | --------------------------------------- |
| id         | TEXT      | PRIMARY KEY              | Identificador único do usuário          |
| name       | TEXT      | NOT NULL                 | Nome completo do usuário                |
| email      | TEXT      | NOT NULL, UNIQUE         | Email do usuário (login)                |
| password   | TEXT      | NOT NULL                 | Senha criptografada                     |
| role       | ENUM      | NOT NULL, DEFAULT 'user' | Papel do usuário (admin, user)          |
| company    | TEXT      | NOT NULL                 | Empresa/organização do usuário          |
| invite_id  | TEXT      | NULLABLE                 | Referência ao convite usado no cadastro |
| created_at | TIMESTAMP | DEFAULT NOW()            | Data de criação do registro             |

**ENUM user_role:**

- `admin` - Administrador
- `user` - Usuário padrão

**Relacionamentos:**

- 1:N com `announcements` (um usuário pode criar vários anúncios)
- 1:N com `meetings_to_users` (um usuário pode participar de várias reuniões)
- N:1 com `invites` (um usuário está associado a um convite)

---

### 2. intentions (Intenções de Cadastro)

Registra solicitações de cadastro antes da aprovação formal.

| Campo      | Tipo      | Restrições                  | Descrição                       |
| ---------- | --------- | --------------------------- | ------------------------------- |
| id         | TEXT      | PRIMARY KEY                 | Identificador único da intenção |
| name       | TEXT      | NOT NULL                    | Nome do interessado             |
| email      | TEXT      | NOT NULL                    | Email do interessado            |
| company    | TEXT      | NOT NULL                    | Empresa do interessado          |
| motivation | TEXT      | NOT NULL                    | Motivação para participar       |
| status     | ENUM      | NOT NULL, DEFAULT 'pending' | Status da solicitação           |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW()     | Data da solicitação             |

**ENUM intentions_status:**

- `pending` - Aguardando aprovação
- `approved` - Aprovado
- `rejected` - Rejeitado

**Relacionamentos:**

- 1:N com `invites` (uma intenção aprovada pode gerar um convite)

---

### 3. invites (Convites)

Gerencia tokens de convite para novos usuários.

| Campo        | Tipo      | Restrições              | Descrição                      |
| ------------ | --------- | ----------------------- | ------------------------------ |
| id           | TEXT      | PRIMARY KEY             | Identificador único do convite |
| token        | TEXT      | NOT NULL, UNIQUE        | Token único para registro      |
| intention_id | TEXT      | NOT NULL                | Referência à intenção aprovada |
| created_at   | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação do convite     |
| used_at      | TIMESTAMP | NULLABLE                | Data de utilização do convite  |

**Relacionamentos:**

- N:1 com `intentions` (cada convite está vinculado a uma intenção)
- 1:1 com `users` (cada convite pode ser usado por um usuário)

---

### 4. announcements (Anúncios)

Armazena mensagens e comunicados publicados na plataforma.

| Campo      | Tipo      | Restrições              | Descrição                      |
| ---------- | --------- | ----------------------- | ------------------------------ |
| id         | TEXT      | PRIMARY KEY             | Identificador único do anúncio |
| user_id    | TEXT      | NOT NULL                | Referência ao usuário autor    |
| message    | TEXT      | NOT NULL                | Conteúdo do anúncio            |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de publicação             |

**Relacionamentos:**

- N:1 com `users` (cada anúncio pertence a um usuário)

---

### 5. meetings (Reuniões)

Registra reuniões agendadas do grupo.

| Campo        | Tipo      | Restrições              | Descrição                      |
| ------------ | --------- | ----------------------- | ------------------------------ |
| id           | TEXT      | PRIMARY KEY             | Identificador único da reunião |
| title        | TEXT      | NOT NULL                | Título/tema da reunião         |
| scheduled_at | TIMESTAMP | NOT NULL                | Data e hora agendada           |
| created_at   | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação do registro    |

**Relacionamentos:**

- 1:N com `meetings_to_users` (uma reunião pode ter vários participantes)

---

### 6. meetings_to_users (Presença em Reuniões)

Tabela associativa que registra a participação dos usuários nas reuniões.

| Campo      | Tipo      | Restrições              | Descrição                        |
| ---------- | --------- | ----------------------- | -------------------------------- |
| meeting_id | TEXT      | NOT NULL                | Referência à reunião             |
| user_id    | TEXT      | NOT NULL                | Referência ao usuário            |
| checkin    | TIMESTAMP | NULLABLE                | Data/hora de check-in do usuário |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação do registro      |

**Chave Composta:** (meeting_id, user_id)

**Relacionamentos:**

- N:1 com `meetings` (vários registros para uma reunião)
- N:1 com `users` (vários registros para um usuário)

---

### 7. plans (Planos de Assinatura)

Define os planos de assinatura disponíveis.

| Campo       | Tipo      | Restrições              | Descrição                      |
| ----------- | --------- | ----------------------- | ------------------------------ |
| id          | TEXT      | PRIMARY KEY             | Identificador único do plano   |
| name        | TEXT      | NOT NULL                | Nome do plano                  |
| price       | TEXT      | NOT NULL                | Valor do plano (formato texto) |
| description | TEXT      | NOT NULL                | Descrição dos benefícios       |
| created_at  | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação                |

**Relacionamentos:**

- 1:N com `subscriptions` (um plano pode ter várias assinaturas)

---

### 8. subscriptions (Assinaturas)

Gerencia assinaturas ativas dos usuários.

| Campo      | Tipo      | Restrições              | Descrição                         |
| ---------- | --------- | ----------------------- | --------------------------------- |
| id         | TEXT      | PRIMARY KEY             | Identificador único da assinatura |
| user_id    | TEXT      | NOT NULL                | Referência ao usuário             |
| plan_id    | TEXT      | NOT NULL                | Referência ao plano               |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação                   |
| started_at | TIMESTAMP | NOT NULL                | Data de início da assinatura      |
| expires_at | TIMESTAMP | NOT NULL                | Data de expiração                 |
| active     | BOOLEAN   | NOT NULL, DEFAULT true  | Status de ativação                |

**Relacionamentos:**

- N:1 com `users` (um usuário pode ter várias assinaturas)
- N:1 com `plans` (uma assinatura está vinculada a um plano)
- 1:N com `payments` (uma assinatura pode ter vários pagamentos)

---

### 9. payments (Pagamentos)

Registra pagamentos relacionados às assinaturas.

| Campo           | Tipo      | Restrições                  | Descrição                          |
| --------------- | --------- | --------------------------- | ---------------------------------- |
| id              | TEXT      | PRIMARY KEY                 | Identificador único do pagamento   |
| subscription_id | TEXT      | NOT NULL                    | Referência à assinatura            |
| amount          | TEXT      | NOT NULL                    | Valor do pagamento (formato texto) |
| status          | ENUM      | NOT NULL, DEFAULT 'pending' | Status do pagamento                |
| due_date        | TIMESTAMP | NOT NULL                    | Data de vencimento                 |
| paid_at         | TIMESTAMP | NULLABLE                    | Data de pagamento efetivo          |
| created_at      | TIMESTAMP | NOT NULL, DEFAULT NOW()     | Data de criação                    |

**ENUM payment_status:**

- `pending` - Pendente
- `completed` - Completado
- `failed` - Falhou

**Relacionamentos:**

- N:1 com `subscriptions` (vários pagamentos para uma assinatura)

---

## Diagrama de Relacionamentos (ER)

```
┌─────────────┐
│  intentions │
│             │
│ - id (PK)   │
│ - name      │
│ - email     │
│ - company   │
│ - motivation│
│ - status    │
└──────┬──────┘
       │
       │ 1:N
       ▼
┌─────────────┐        ┌─────────────┐
│   invites   │        │    users    │
│             │        │             │
│ - id (PK)   │◄───────│ - id (PK)   │
│ - token     │  N:1   │ - name      │
│ - intention │        │ - email     │
│ - used_at   │        │ - password  │
└─────────────┘        │ - role      │
                       │ - company   │
                       │ - invite_id │
                       └──────┬──────┘
                              │
                 ┌────────────┼───────────────────────┐
                 │            │                       │
                 │ 1:N        │ 1:N                   │ N:1
                 ▼            ▼                       ▼
         ┌─────────────┐  ┌──────────────────┐  ┌──────────────┐
         │announcements│  │meetings_to_users │  │subscriptions │
         │             │  │                  │  │              │
         │ - id (PK)   │  │ - meeting_id (FK)│  │ - id (PK)    │
         │ - user_id   │  │ - user_id (FK)   │  │ - user_id    │
         │ - message   │  │ - checkin        │  │ - plan_id    │
         └─────────────┘  └────────┬─────────┘  │ - started_at │
                                   │            │ - expires_at │
                                   │ N:1        │ - active     │
                                   ▼            └───────┬──────┘
                          ┌─────────────┐               │
                          │  meetings   │               │ 1:N
                          │             │               ▼
                          │ - id (PK)   │      ┌────────────────────┐
                          │ - title     │      │  payments          │
                          │ - scheduled │      │                    │
                          └─────────────┘      │ - id (PK)          │
                                               │ - subscription_id  │
         ┌──────────────┐                      │ - amount           │
         │    plans     │                      │ - status           │
         │              │                      │ - due_date         │
         │ - id (PK)    │◄─────────────────────│ - paid_at          │
         │ - name       │         N:1          └────────────────────┘
         │ - price      │
         │ - description│
         └──────────────┘
```

---

## Considerações de Segurança

1. **Senhas**: Armazenadas com hash (bcrypt/argon2)
2. **Tokens**: Gerados com aleatoriedade criptográfica
3. **Validação**: Constraints de banco garantem integridade
4. **Auditoria**: Campos `created_at` em todas as tabelas

---

## Migrações

O projeto utiliza Drizzle Kit para gerenciar migrações:

```bash
# Gerar tabelas a partir do modelo
npm run db:push

# Gerar migração
npm run db:generate

# Aplicar migrações
npm run db:migrate

# Popular dados iniciais
npm run db:seed
```

Configuração em `drizzle.config.ts`:

- **Dialeto**: PostgreSQL
- **Schema**: `./drizzle/schema/**/*.ts`
- **Migrações**: `./drizzle/migrations`
- **Conexão**: `process.env.DATABASE_URL`
