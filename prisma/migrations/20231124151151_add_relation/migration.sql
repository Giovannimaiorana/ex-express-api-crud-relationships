/*
  Warnings:

  - You are about to drop the column `title` on the `tags` table. All the data in the column will be lost.
  - Added the required column `titleT` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tags` DROP COLUMN `title`,
    ADD COLUMN `titleT` VARCHAR(50) NOT NULL;
