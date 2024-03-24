import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// const dbStatusFindFirstProxy = new Proxy(db.status.findFirst, {
//   apply: async (target, thisArg, argumentsList) => {
//     console.log(target, thisArg, argumentsList);
//     return target.apply(thisArg, argumentsList);
//   },
// })
// })(() => {
//   db.status.findFirst = async (
//     args: Prisma.SelectSubset<T, Prisma.StatusFindFirstArgs<DefaultArgs>> | undefined,
//   ) => {
//     const status = await db.status.findFirst(args);
//   };
// })();

export default db;
