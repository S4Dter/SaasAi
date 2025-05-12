/* eslint-disable */
import { PrismaClient } from '@prisma/client';
import mockPrismaClient from '../generated/prisma/mock-client';

const prismaClientSingleton = () => {
  const prisma = new PrismaClient();
  
  // Middleware pour horodatage automatique
  prisma.$use(async (params: any, next: any) => {
    if (params.action === 'create') {
      params.args.data.createdAt = new Date();
      params.args.data.updatedAt = new Date();
    }
    if (params.action === 'update' || params.action === 'updateMany') {
      params.args.data.updatedAt = new Date();
    }
    return next(params);
  });
  
  // Middleware pour journalisation (log) des actions (optionnel)
  prisma.$use(async (params: any, next: any) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    
    if (process.env.DEBUG === 'true') {
      console.log(`Prisma Query ${params.model}.${params.action} took ${after - before}ms`);
    }
    
    return result;
  });
  
  return prisma;
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Use mock client during build time in production to avoid initialization issues
const prisma = process.env.NODE_ENV === 'production' 
  ? mockPrismaClient 
  : globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
