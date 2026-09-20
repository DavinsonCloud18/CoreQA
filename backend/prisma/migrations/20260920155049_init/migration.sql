-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "environments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statuses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_testcases" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "expectedResult" TEXT,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_testcases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "environmentId" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_modules" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "session_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_executions" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "testcaseId" TEXT NOT NULL,
    "statusId" INTEGER NOT NULL,
    "executedById" TEXT,
    "notes" TEXT,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_histories" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "claimedById" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_roleId_idx" ON "users"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "environments_name_key" ON "environments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "statuses_name_key" ON "statuses"("name");

-- CreateIndex
CREATE INDEX "master_testcases_moduleId_idx" ON "master_testcases"("moduleId");

-- CreateIndex
CREATE INDEX "sessions_environmentId_idx" ON "sessions"("environmentId");

-- CreateIndex
CREATE INDEX "sessions_isOpen_idx" ON "sessions"("isOpen");

-- CreateIndex
CREATE INDEX "session_modules_sessionId_idx" ON "session_modules"("sessionId");

-- CreateIndex
CREATE INDEX "session_modules_moduleId_idx" ON "session_modules"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "session_modules_sessionId_moduleId_key" ON "session_modules"("sessionId", "moduleId");

-- CreateIndex
CREATE INDEX "session_executions_sessionId_idx" ON "session_executions"("sessionId");

-- CreateIndex
CREATE INDEX "session_executions_testcaseId_idx" ON "session_executions"("testcaseId");

-- CreateIndex
CREATE INDEX "session_executions_statusId_idx" ON "session_executions"("statusId");

-- CreateIndex
CREATE INDEX "session_executions_executedById_idx" ON "session_executions"("executedById");

-- CreateIndex
CREATE UNIQUE INDEX "session_executions_sessionId_testcaseId_key" ON "session_executions"("sessionId", "testcaseId");

-- CreateIndex
CREATE INDEX "claim_histories_sessionId_idx" ON "claim_histories"("sessionId");

-- CreateIndex
CREATE INDEX "claim_histories_moduleId_idx" ON "claim_histories"("moduleId");

-- CreateIndex
CREATE INDEX "claim_histories_claimedById_idx" ON "claim_histories"("claimedById");

-- CreateIndex
CREATE INDEX "claim_histories_sessionId_moduleId_isActive_idx" ON "claim_histories"("sessionId", "moduleId", "isActive");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_testcases" ADD CONSTRAINT "master_testcases_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "environments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_modules" ADD CONSTRAINT "session_modules_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_modules" ADD CONSTRAINT "session_modules_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_executions" ADD CONSTRAINT "session_executions_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_executions" ADD CONSTRAINT "session_executions_testcaseId_fkey" FOREIGN KEY ("testcaseId") REFERENCES "master_testcases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_executions" ADD CONSTRAINT "session_executions_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_executions" ADD CONSTRAINT "session_executions_executedById_fkey" FOREIGN KEY ("executedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_histories" ADD CONSTRAINT "claim_histories_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_histories" ADD CONSTRAINT "claim_histories_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_histories" ADD CONSTRAINT "claim_histories_claimedById_fkey" FOREIGN KEY ("claimedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
