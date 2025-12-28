-- CreateTable
CREATE TABLE `new_launch` (
    `p_id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_name` VARCHAR(191) NOT NULL,
    `property_desc` VARCHAR(191) NOT NULL,
    `property_photo` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`p_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
