import { PrismaClient } from '@prisma/client';
import { studentStatuses } from '../src/studentStatuses/studentStatus.schema';
import seedGroupsFromDataFolder from './groupSeeds/seedGroupByName';
// import fs from 'fs/promises';
const prisma = new PrismaClient();

async function main() {
  await prisma.status.createMany({
    data: studentStatuses.map(({ text }) => ({ text })),
  });

  await seedGroupsFromDataFolder(prisma);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
