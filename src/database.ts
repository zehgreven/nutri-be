import { PrismaClient } from '@src/generated/client';

const prismaClient = new PrismaClient({
  log: ['error', 'info', 'query', 'warn'],
  errorFormat: 'minimal',
});

export const connect = async (): Promise<void> => await prismaClient.$connect();

export const close = async (): Promise<void> =>
  await prismaClient.$disconnect();

export { prismaClient };
