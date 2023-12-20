import { type Prisma, type PrismaClient } from '@prisma/client'

export type Database = PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>
