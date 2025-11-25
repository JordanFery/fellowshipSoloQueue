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
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

const globalForPrisma = globalThis

if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set')
    }

    const pool = new Pool({
        connectionString,
        max: 1, // Important pour Vercel
    })

    const adapter = new PrismaPg(pool)

    globalForPrisma.prisma = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
}

const prisma = globalForPrisma.prisma

export default prisma
