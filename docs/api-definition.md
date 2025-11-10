# API Documentation - Group Management Platform

## Visão Geral

Esta API REST fornece endpoints para gerenciamento de grupos, usuários, intenções de participação, convites e anúncios. A API utiliza autenticação baseada em JWT (JSON Web Tokens) e segue os princípios RESTful.

**Arquitetura:** Next.js App Router API Routes  
**Banco de Dados:** PostgreSQL com Drizzle ORM  
**Autenticação:** JWT armazenado em cookies HTTP-only

---

## Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. O token é armazenado em um cookie HTTP-only chamado `auth-token`.

### Configurações do Token

- **Algoritmo:** HS256
- **Expiração:** 7 dias
- **Refresh Threshold:** 24 horas
- **Cookie Settings:**
  - `httpOnly: true`
  - `secure: true` (em produção)
  - `sameSite: lax`
  - `maxAge: 604800` (7 dias)

### Headers Necessários

Para endpoints protegidos, o cookie `auth-token` deve estar presente na requisição.

---

## Base URL

```
Local: http://localhost:3000/api
Produção: https://<seu-dominio>/api
```

---

## Endpoints

### 👤 Usuários (Users)

#### `GET /api/user`

Obtém os dados do usuário autenticado.

**Resposta de Sucesso (200):**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "password": "string (hashed)",
      "role": "user | admin",
      "company": "string",
      "inviteId": "string | null",
      "createdAt": "timestamp"
    }
  ]
}
```

**Erros:**

- `401`: Usuário não autenticado
- `500`: Erro interno do servidor

---

#### `POST /api/user`

Cria um novo usuário no sistema.

**Request Body:**

```json
{
  "name": "string (obrigatório)",
  "email": "string (obrigatório)",
  "password": "string (obrigatório)",
  "company": "string (obrigatório)"
}
```

**Resposta de Sucesso (201):**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "password": "string (hashed)",
    "role": "user",
    "company": "string",
    "inviteId": null,
    "createdAt": "timestamp"
  }
}
```

**Erros:**

- `400`: Campos obrigatórios faltando
- `500`: Falha ao criar usuário

---

#### `GET /api/user/[email]`

Busca um usuário específico por email.

**Parâmetros de URL:**

- `email`: Email do usuário a ser buscado

**Resposta de Sucesso (200):**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "password": "string (hashed)",
    "role": "user | admin",
    "company": "string",
    "inviteId": "string | null",
    "createdAt": "timestamp"
  }
}
```

**Erros:**

- `401`: Usuário não autenticado
- `404`: Usuário não encontrado
- `500`: Erro interno do servidor

---

### 💡 Intenções (Intentions)

As intenções representam solicitações de pessoas interessadas em participar de um grupo.

#### `GET /api/intention`

Lista todas as intenções cadastradas.

**Resposta de Sucesso (200):**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "company": "string",
      "motivation": "string",
      "status": "pending | approved | rejected",
      "createdAt": "timestamp"
    }
  ]
}
```

**Erros:**

- `500`: Erro interno do servidor

---

#### `POST /api/intention`

Cria uma nova intenção de participação.

**Request Body:**

```json
{
  "name": "string (obrigatório)",
  "email": "string (obrigatório)",
  "company": "string (obrigatório)",
  "motivation": "string (obrigatório)"
}
```

**Resposta de Sucesso (201):**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "company": "string",
    "motivation": "string",
    "status": "pending",
    "createdAt": "timestamp"
  }
}
```

**Erros:**

- `400`: Campos obrigatórios faltando
- `500`: Erro ao criar intenção

---

#### `GET /api/intention/[id]`

Obtém uma intenção específica por ID.

**Parâmetros de URL:**

- `id`: ID da intenção

**Resposta de Sucesso (200):**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "company": "string",
    "motivation": "string",
    "status": "pending | approved | rejected",
    "createdAt": "timestamp"
  }
}
```

**Erros:**

- `404`: Intenção não encontrada
- `500`: Erro interno do servidor

---

#### `PUT /api/intention/[id]`

Atualiza o status de uma intenção.

**Parâmetros de URL:**

- `id`: ID da intenção

**Request Body:**

```json
{
  "status": "pending | approved | rejected (obrigatório)"
}
```

**Resposta de Sucesso (200):**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "company": "string",
    "motivation": "string",
    "status": "approved",
    "createdAt": "timestamp"
  }
}
```

**Erros:**

- `400`: Status é obrigatório
- `404`: Intenção não encontrada
- `500`: Erro ao atualizar intenção

---

### 📨 Convites (Invites)

#### `GET /api/invite?token={token}`

Valida e obtém informações de um convite pelo token.

**Query Parameters:**

- `token`: Token do convite (obrigatório)

**Resposta de Sucesso (200):**

```json
{
  "data": {
    "id": "string",
    "token": "string",
    "intentionId": "string",
    "createdAt": "timestamp",
    "usedAt": "timestamp | null",
    "intention": {
      "id": "string",
      "name": "string",
      "email": "string",
      "company": "string",
      "motivation": "string",
      "status": "string",
      "createdAt": "timestamp"
    }
  }
}
```

**Erros:**

- `400`: Token é obrigatório
- `404`: Token não encontrado
- `500`: Erro interno do servidor

---

#### `POST /api/invite`

Cria um novo convite para uma intenção aprovada.

**Request Body:**

```json
{
  "intentionId": "string (obrigatório)"
}
```

**Resposta de Sucesso (201):**

```json
{
  "data": {
    "id": "string",
    "token": "string",
    "intentionId": "string",
    "createdAt": "timestamp",
    "usedAt": null
  }
}
```

**Erros:**

- `400`: intentionId é obrigatório
- `500`: Falha ao criar convite

---

#### `PUT /api/invite/[token]`

Marca um convite como utilizado.

**Parâmetros de URL:**

- `token`: Token do convite

**Resposta de Sucesso (200):**

```json
{
  "data": {
    "id": "string",
    "token": "string",
    "intentionId": "string",
    "createdAt": "timestamp",
    "usedAt": "timestamp"
  }
}
```

**Erros:**

- `400`: Token é obrigatório
- `404`: Convite não encontrado
- `500`: Erro ao atualizar convite

---

### 📢 Anúncios (Announcements)

#### `GET /api/announcement`

Lista todos os anúncios com informações do usuário que criou.

**Resposta de Sucesso (200):**

```json
{
  "data": [
    {
      "id": "string",
      "userId": "string",
      "message": "string",
      "createdAt": "timestamp",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "user | admin",
        "company": "string",
        "createdAt": "timestamp"
      }
    }
  ]
}
```

**Observação:** Os anúncios são ordenados por data de criação (mais recentes primeiro).

**Erros:**

- `500`: Erro interno do servidor

---

## Modelos de Dados

### User

```typescript
{
  id: string
  name: string
  email: string (unique)
  password: string (hashed with bcrypt)
  role: "user" | "admin"
  company: string
  inviteId: string | null
  createdAt: timestamp
}
```

### Intention

```typescript
{
  id: string
  name: string
  email: string
  company: string
  motivation: string
  status: "pending" | "approved" | "rejected"
  createdAt: timestamp
}
```

### Invite

```typescript
{
  id: string
  token: string(unique)
  intentionId: string
  createdAt: timestamp
  usedAt: timestamp | null
}
```

### Announcement

```typescript
{
  id: string
  userId: string
  message: string
  createdAt: timestamp
}
```

---

## Códigos de Status HTTP

| Código | Descrição                                 |
| ------ | ----------------------------------------- |
| 200    | OK - Requisição bem-sucedida              |
| 201    | Created - Recurso criado com sucesso      |
| 400    | Bad Request - Dados inválidos ou faltando |
| 401    | Unauthorized - Autenticação necessária    |
| 404    | Not Found - Recurso não encontrado        |
| 500    | Internal Server Error - Erro no servidor  |

---

## Formato de Erro Padrão

Todas as respostas de erro seguem o formato:

```json
{
  "error": "Mensagem de erro descritiva"
}
```

---
