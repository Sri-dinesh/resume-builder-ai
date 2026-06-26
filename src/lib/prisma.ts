import { PrismaClient } from "@prisma/client";
import { env } from "@/env";

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasourceUrl: env.POSTGRES_PRISMA_URL,
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
