/*
  Warnings:

  - Added the required column `property_type` to the `new_launch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `new_launch` ADD COLUMN `property_link` VARCHAR(191) NULL,
    ADD COLUMN `property_type` VARCHAR(191) NOT NULL;
