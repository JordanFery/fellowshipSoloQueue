// import { PrismaClient } from '@prisma/client'
// import { PrismaPg } from '@prisma/adapter-pg'
// import pg from 'pg'

// const { Pool } = pg

// const globalForPrisma = globalThis

// if (!globalForPrisma.prisma) {
//     const pool = new Pool({
//         connectionString: process.env.DATABASE_URL,
//     })

//     const adapter = new PrismaPg(pool)

//     globalForPrisma.prisma = new PrismaClient({
//         adapter,
//         log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
//     })
// }

// const prisma = globalForPrisma.prisma

// export default prisma

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
