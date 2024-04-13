<h1 align="center">
    <img alt="NLW Unite logo, orange background with black closed HTML tag" title="#NLW-Unite-logo" src=".github/logo.svg" width="250px" />
</h1>

O pass.in é uma aplicação de **gestão de participantes em eventos presenciais**.

A ferramenta permite que o organizador cadastre um evento e abra uma página pública de inscrição.

Os participantes inscritos podem emitir uma credencial para check-in no dia do evento.

O sistema fará um scan da credencial do participante para permitir a entrada no evento.

## Requisitos

### Requisitos funcionais

- [ ✔ ] O organizador deve poder cadastrar um novo evento;
- [ ✔ ] O organizador deve poder visualizar dados de um evento;
- [ ✔ ] O organizador deve poder visualizar a lista de participantes;
- [ ✔ ] O organizador deve poder se inscrever em um evento;
- [ ✔ ] O organizador deve poder visualizar seu crachá de inscrição;
- [ ✔ ] O organizador deve poder realizar check-in no evento;

### Regras de negócio

- [ ✔ ] O participante só pode se inscrever em um evento uma única vez;
- [ ✔ ] O participante só pode se inscrever em eventos com vagas disponíveis;
- [ ✔ ] O participante só pode realizar check-in em um evento uma única vez;

### Requisitos não-funcionais

- [ ✔ ] O check-in no evento será realizado através de um QRCode;

## Comandos de execução

### Seed

npx prisma seed

### Executar em modo de desenvolvimento

npm run dev

### Executar em modo de produção

- 01 - npm run build (Para gerar a aplicação e converter para Javascript)
- 02 - npm start (Para rodar a aplicação gerada)

### Executar migrations

npm run db:migrate

### Executar o Prisma Studio

npm run db:studio

### Documentação API

- Para documentação da api, foi usado o swagger, uma ferramenta open source, que gera documentações automaticamente.
- Com a aplicação rodando localmente, execute http://localhost:3333/docs

### Diagrama ERD

<img src=".github/erd.svg" width="600" alt="Diagrama ERD do banco de dados" />

### Estrutura do banco (SQL)

```sql
-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "slug" TEXT NOT NULL,
    "maximum_attendees" INTEGER
);

-- CreateTable
CREATE TABLE "attendees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendeeId" INTEGER NOT NULL,
    CONSTRAINT "check_ins_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "attendees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "attendees_event_id_email_key" ON "attendees"("event_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_attendeeId_key" ON "check_ins"("attendeeId");
```
