import "dotenv/config"
import { hash } from "bcrypt"
import { db } from "./config"
import {
  announcements,
  intentions,
  invites,
  meetings,
  meetingsToUsers,
  payments,
  plans,
  subscriptions,
  users,
} from "./schema"
import { createNewId } from "@/lib/utils"

async function seed() {
  console.log("Starting database seeding...")

  // Clean up existing data
  await db.delete(announcements)
  await db.delete(intentions)
  await db.delete(invites)
  await db.delete(meetings)
  await db.delete(meetingsToUsers)
  await db.delete(payments)
  await db.delete(subscriptions)
  await db.delete(plans)
  await db.delete(invites)
  await db.delete(invites)
  await db.delete(users)

  // Create demo users
  const demoPassword = await hash("teste123", 10)

  const adminUserId = createNewId()
  const memberUserId = createNewId()

  const adminUser = await db
    .insert(users)
    .values({
      id: adminUserId,
      name: "Usuário Admin",
      email: "admin@admin.com",
      password: demoPassword,
      role: "admin",
      company: "Empresa Admin",
    })
    .returning()
    .then((rows) => rows[0])

  const memberUser = await db
    .insert(users)
    .values({
      id: memberUserId,
      name: "Usuário User",
      email: "user@user.com",
      password: demoPassword,
      role: "user",
      company: "Empresa User",
    })
    .returning()
    .then((rows) => rows[0])

  console.log("Created demo users:")
  console.log(`- Admin: ${adminUser.email} (password: teste123)`)
  console.log(`- User: ${memberUser.email} (password: teste123)`)

  // Create announcements
  const announcementsData = [
    {
      message:
        "Olá pessoal! É com grande prazer que damos início a essa nova jornada de gestão colaborativa. Esta plataforma foi criada para facilitar nossa comunicação e organização em grupo.",
    },
    {
      message:
        "Acabamos de lançar uma nova funcionalidade que permite a criação de subgrupos especializados. Agora vocês podem organizar projetos específicos com mais facilidade.",
    },
    {
      message:
        "Informamos que haverá manutenção nos servidores no próximo sábado das 2h às 6h da manhã. Durante esse período, a plataforma ficará temporariamente indisponível.",
    },
    {
      message:
        "Convido todos para participarem do workshop sobre gestão ágil de projetos que acontecerá na próxima terça-feira às 14h. O evento será online e teremos certificação.",
    },
    {
      message:
        "As políticas de uso da plataforma foram atualizadas para incluir novas diretrizes de segurança e privacidade. Por favor, revisem o documento na seção de configurações.",
    },
    {
      message:
        "Obrigado a todos que participaram da pesquisa! Com base no feedback recebido, implementaremos melhorias na interface e novas funcionalidades nas próximas semanas.",
    },
    {
      message:
        "A partir desta semana, a plataforma oferece integração nativa com Slack, Microsoft Teams e Google Workspace. Configurem suas integrações na área de configurações.",
    },
    {
      message:
        "Dica da semana: Utilizem as tags para categorizar seus projetos e facilitar a busca. Isso tornará a navegação muito mais eficiente para toda a equipe.",
    },
    {
      message:
        "Dica da semana: Utilizem as tags para categorizar seus projetos e facilitar a busca. Isso tornará a navegação muito mais eficiente para toda a equipe.",
    },
    {
      message:
        "Dica da semana: Utilizem as tags para categorizar seus projetos e facilitar a busca. Isso tornará a navegação muito mais eficiente para toda a equipe.",
    },
    {
      message:
        "Implementamos um sistema de notificações mais inteligente que se adapta ao seu padrão de uso. Vocês podem personalizar as preferências no menu de configurações.",
    },
    {
      message:
        "Atingimos a marca de 1000 usuários ativos na plataforma! Obrigado por fazerem parte dessa jornada. Continuaremos trabalhando para oferecer a melhor experiência possível.",
    },
    {
      message:
        "Novos recursos de edição colaborativa foram adicionados. Agora é possível trabalhar em documentos simultaneamente com outros membros da equipe em tempo real.",
    },
    {
      message:
        "Lançamos um programa de feedback contínuo onde vocês podem sugerir melhorias e reportar problemas diretamente através do botão de feedback na barra lateral.",
    },
    {
      message:
        "Não percam nosso webinar sobre melhores práticas em gestão de equipes distribuídas. Será na próxima quinta-feira às 16h com especialistas renomados da área.",
    },
    {
      message:
        "Todos os dados da plataforma são automaticamente backupeados diariamente e criptografados. Nossa infraestrutura segue os mais altos padrões de segurança da indústria.",
    },
    {
      message:
        "Adicionamos 15 novos templates de projeto para diferentes áreas: marketing, desenvolvimento, vendas, RH e mais. Experimentem para acelerar a criação de seus projetos.",
    },
  ]

  let daysAgo
  let randomDate
  for (const announcement of announcementsData) {
    daysAgo = Math.floor(Math.random() * 90)
    randomDate = new Date()
    randomDate.setDate(randomDate.getDate() - daysAgo)
    randomDate.setHours(
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60),
      0,
      0
    )

    await db.insert(announcements).values({
      id: createNewId(),
      userId: adminUserId,
      message: announcement.message,
      createdAt: randomDate,
    })
  }

  console.log(`- Created ${announcementsData.length} announcements`)

  // Create 20 additional intentions
  const intentionsData = [
    {
      name: "João Silva",
      email: "joao.silva@empresa.com",
      company: "Tech Solutions",
      motivation:
        "Busco uma plataforma para organizar melhor nossa equipe de desenvolvimento.",
      status: "pending",
    },
    {
      name: "Maria Santos",
      email: "maria.santos@startup.com",
      company: "Startup Inovadora",
      motivation:
        "Precisamos de uma ferramenta colaborativa para nosso time distribuído.",
      status: "approved",
    },
    {
      name: "Pedro Oliveira",
      email: "pedro@consultoria.com",
      company: "Consultoria Alpha",
      motivation:
        "Queremos centralizar a comunicação entre diferentes projetos.",
      status: "pending",
    },
    {
      name: "Ana Costa",
      email: "ana.costa@empresa.com",
      company: "Empresa Beta",
      motivation: "Necessito gerenciar múltiplos grupos e suas atividades.",
      status: "rejected",
    },
    {
      name: "Carlos Pereira",
      email: "carlos.p@tech.com",
      company: "TechCorp",
      motivation:
        "Quero facilitar a colaboração entre equipes remotas e presenciais.",
      status: "approved",
    },
    {
      name: "Juliana Alves",
      email: "juliana@marketing.com",
      company: "Marketing Pro",
      motivation:
        "Buscamos uma solução para gerenciar campanhas em grupo de forma eficaz.",
      status: "pending",
    },
    {
      name: "Roberto Lima",
      email: "roberto.lima@finance.com",
      company: "Finance Group",
      motivation: "Precisamos organizar nossos comitês e grupos de trabalho.",
      status: "pending",
    },
    {
      name: "Fernanda Rocha",
      email: "fernanda@educacao.com",
      company: "Educação Online",
      motivation:
        "Queremos criar grupos de estudo e acompanhar o progresso dos alunos.",
      status: "approved",
    },
    {
      name: "Lucas Martins",
      email: "lucas.m@startup.io",
      company: "Startup XYZ",
      motivation:
        "Necessito de uma plataforma para coordenar sprints e equipes ágeis.",
      status: "pending",
    },
    {
      name: "Camila Souza",
      email: "camila@design.com",
      company: "Design Studio",
      motivation:
        "Busco uma ferramenta para gerenciar projetos criativos em equipe.",
      status: "rejected",
    },
    {
      name: "Rafael Barbosa",
      email: "rafael@logistica.com",
      company: "Logística Express",
      motivation: "Queremos organizar nossas equipes de operação e logística.",
      status: "pending",
    },
    {
      name: "Patricia Dias",
      email: "patricia@rh.com",
      company: "RH Solutions",
      motivation:
        "Precisamos gerenciar grupos de treinamento e desenvolvimento.",
      status: "approved",
    },
    {
      name: "Gustavo Ferreira",
      email: "gustavo@vendas.com",
      company: "Vendas Plus",
      motivation:
        "Quero coordenar equipes de vendas regionais de forma eficaz.",
      status: "pending",
    },
    {
      name: "Beatriz Cardoso",
      email: "beatriz@saude.com",
      company: "Saúde & Bem-estar",
      motivation:
        "Buscamos organizar grupos de atendimento e especialidades médicas.",
      status: "pending",
    },
    {
      name: "Thiago Gomes",
      email: "thiago@engenharia.com",
      company: "Engenharia Moderna",
      motivation: "Necessito gerenciar equipes de projetos de engenharia.",
      status: "approved",
    },
    {
      name: "Larissa Moreira",
      email: "larissa@eventos.com",
      company: "Eventos & Cia",
      motivation:
        "Queremos coordenar equipes de produção de eventos corporativos.",
      status: "pending",
    },
    {
      name: "Bruno Nascimento",
      email: "bruno@inovacao.com",
      company: "Inovação Digital",
      motivation: "Busco uma plataforma para gerenciar nosso lab de inovação.",
      status: "rejected",
    },
    {
      name: "Mariana Ribeiro",
      email: "mariana@qualidade.com",
      company: "Qualidade Total",
      motivation:
        "Precisamos organizar nossos grupos de auditoria e controle de qualidade.",
      status: "pending",
    },
    {
      name: "Daniel Castro",
      email: "daniel@ti.com",
      company: "TI Solutions",
      motivation:
        "Quero gerenciar equipes de suporte técnico em diferentes níveis.",
      status: "approved",
    },
    {
      name: "Isabela Monteiro",
      email: "isabela@comunicacao.com",
      company: "Comunicação & Mídia",
      motivation:
        "Buscamos coordenar equipes de redação, design e mídias sociais.",
      status: "pending",
    },
  ]

  for (const intention of intentionsData) {
    await db.insert(intentions).values({
      id: createNewId(),
      ...intention,
      status: intention.status as "pending" | "approved" | "rejected",
    })
  }

  console.log(`- Created ${intentionsData.length + 1} intentions`)
  console.log("Database seeding completed!")
  process.exit(0)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    console.log("Seed script finished")
  })
