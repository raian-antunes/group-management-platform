# Organização de Componentes React no Next.js

## Estrutura de Pastas

### **`/app`** - Rotas e Páginas (App Router)

- **`(auth)/`** - Grupo de rotas de autenticação (signin, signup)
- **`(landing)/`** - Página inicial pública
- **`dashboard/`** - Área administrativa (announcements, intentions, user)
- **`api/`** - API Routes (announcement, invite)

### **`/components`** - Componentes Reutilizáveis

- **Componentes globais** na raiz: `appSidebar.tsx`, `errorMessage.tsx`, `signOutButton.tsx`
- **`layout/form/`** - Formulários específicos (formIntention, formSignIn, formSignUp, formUser)
- **`ui/`** - Componentes de UI base (shadcn/ui): button, card, input, label, table, sidebar, etc.

## Padrões de Organização

1. **App Router (Next.js 13+)**: Uso de grupos de rota `(auth)`, `(landing)` para organização sem afetar URLs
2. **Componentes de UI**: Biblioteca de componentes base reutilizáveis na pasta `ui/`
3. **Componentes de Formulário**: Isolados em `components/layout/form/`
4. **Server/Client Components**: Separação entre lógica de servidor (pages) e componentes interativos
5. **Layouts aninhados**: Cada seção tem seu próprio `layout.tsx` para estrutura consistente
