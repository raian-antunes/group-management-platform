import "dotenv/config"
import { hash } from "bcrypt"
import { db } from "./config"
import { v4 as uuidv4 } from "uuid"
import { announcements, intentions, invites, users } from "./schema"

async function seed() {
  console.log("Starting database seeding...")

  // Clean up existing data
  await db.delete(announcements)
  await db.delete(invites)
  await db.delete(intentions)
  await db.delete(users)

  // Create demo users
  const demoPassword = await hash("teste123", 10)

  const adminUserId = uuidv4()
  const memberUserId = uuidv4()

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

  await db
    .insert(intentions)
    .values({
      id: uuidv4(),
      name: "Usuário Admin",
      email: "user@user.com",
      company: "Empresa Admin",
      motivation: "Quero gerenciar meu grupo de forma eficiente.",
      status: "pending",
    })
    .returning()
    .then((rows) => rows[0])

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
      id: uuidv4(),
      ...intention,
      status: intention.status as "pending" | "approved" | "rejected",
    })
  }

  console.log(`- Total: ${intentionsData.length + 1} intentions created`)
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
