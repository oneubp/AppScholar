/*
  Warnings:

  - A unique constraint covering the columns `[alunoId]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[professorId]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Disciplina" DROP CONSTRAINT "Disciplina_professorId_fkey";

-- AlterTable
ALTER TABLE "Disciplina" ALTER COLUMN "professorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "alunoId" INTEGER,
ADD COLUMN     "professorId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_alunoId_key" ON "Usuario"("alunoId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_professorId_key" ON "Usuario"("professorId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disciplina" ADD CONSTRAINT "Disciplina_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
