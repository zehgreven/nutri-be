import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient({
  log: ['error', 'info', 'query', 'warn'],
});

export const connect = async (): Promise<void> => await prismaClient.$connect();

export const close = async (): Promise<void> =>
  await prismaClient.$disconnect();

export { prismaClient };
