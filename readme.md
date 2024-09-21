# Процесс и сложности

1. Перешёл на документацию https://docs.nestjs.com/recipes/prisma
2. Вместо глобальной установки `npm install -g @nestjs/cli` сделал `package.json`, установил локально и запустил `npx nest new project-name`
3. Снёс старый конфиг `eslint`, перешёл на доку https://typescript-eslint.io/getting-started и сделал, как там. Добавил правила стилистики
4. Удалил старые версии `prettier` и `eslint-config-prettier` и поставил новые. Конфиг не встал в `tseslint.config(`, поэтому пришлось выкрутиться через `[...tseslint.config(...), eslintConfigPrettier]`. Заменил `prettier` на свой
5. Не работала `npx prisma migrate dev --name init`, так как при подключении к Supabase стоял изначально метод pooling с портом 6543. Нужно либо в настройках выбрать метод session, либо поставить порт 5432
6. Для подготовки сидов нужно прописать в `package.json` поле `"prisma": { "seed": "..." }`
7.
