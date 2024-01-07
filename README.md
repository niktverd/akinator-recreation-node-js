This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Run DB

Установка с использованием Homebrew:

Сначала установите Homebrew, если у вас его еще нет. Он является менеджером пакетов для macOS и позволяет легко устанавливать и управлять программным обеспечением.

### Откройте терминал и выполните команду:

`brew install postgresql`

Это установит последнюю версию PostgreSQL.

### Запуск сервера PostgreSQL:

После установки вы можете запустить сервер PostgreSQL с помощью Homebrew. Для этого выполните:

`brew services start postgresql`

Эта команда запустит сервер PostgreSQL и настроит его на автоматический запуск при загрузке системы.

### Создание новой базы данных:

По умолчанию PostgreSQL создает пользователя с именем, совпадающим с вашим именем пользователя в системе. Вы можете создать новую базу данных, используя следующую команду:

`createdb akinator-db`

### Выполнение миграции:

Выполните миграцию, чтобы применить изменения к вашей базе данных:

`npx knex migrate:latest`

### Выполните команду отката миграции:

Чтобы откатить последнюю выполненную миграцию, используйте команду:

`npx knex migrate:rollback`

Эта команда откатит последнюю группу миграций, которая была применена к вашей базе данных. "Группа миграций" обычно соответствует одному вызову команды knex migrate:latest.

### Откат определенной миграции:

Если вам нужно откатить определенную миграцию, которая не является последней, вам придется последовательно откатывать все миграции до нужной. Это делается путем многократного выполнения команды 

`knex migrate:rollback.`

### Проверка статуса миграций:

Вы можете проверить статус всех миграций, используя команду:

`npx knex migrate:status`

Это покажет вам список всех миграций и их текущее состояние (выполнено или нет).

### Создание первой миграции:

Миграции используются для управления структурой базы данных. Для создания первой миграции выполните следующую команду, где create_table_name — это имя вашей первой миграции:

`npx knex migrate:make create_table_name`

Это создаст новый файл миграции в папке migrations в вашем проекте.

### Создание Seed файла:

Выполните следующую команду в терминале в корне вашего проекта для создания seed файла:

`npx knex seed:make seed_name`

Это создаст новый файл в директории seeds. Название файла будет начинаться с временной метки и вашего seed_name.

### Запуск Seed файла:

Запустите seed файл, чтобы вставить данные в базу данных. Для этого выполните команду:

`npx knex seed:run`

Эта команда выполнит все seed файлы, которые есть в вашем проекте.
