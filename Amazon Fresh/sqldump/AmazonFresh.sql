DROP DATABASE IF EXISTS `amazondb`;
CREATE DATABASE `amazondb`;

USE `amazondb`;

#DROP USER 'amazondbadmin'@'localhost';

#CREATE USER 'amazondbadmin'@'%' IDENTIFIED BY 'marias@1234';
#GRANT ALL PRIVILEGES on amazondb.* TO 'amazondbadmin'@'%';

####
# Structure for table Users
####
CREATE TABLE `Users`(
`puid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
`email` VARCHAR(50) NOT NULL,
`password` VARCHAR(128) NOT NULL,
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`puid`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `Users` AUTO_INCREMENT = 100000;

####
# Structure for table User_profiles
####
CREATE TABLE `User_profiles`(
`puid` INT(10) UNSIGNED NOT NULL,
`first_name` VARCHAR(128) NOT NULL,
`last_name` VARCHAR(128) NOT NULL,
`birthday` DATE,
`address` VARCHAR(256) NOT NULL,
`location` VARCHAR(128) NOT NULL,
`state` VARCHAR(128) NOT NULL,
`zipcode` VARCHAR(10) NOT NULL,
`phone` VARCHAR(10) NOT NULL,
`role` ENUM('farmer','admin','customer'),
`status` ENUM('active','pending','blocked'),
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`puid`),
FOREIGN KEY (`puid`) REFERENCES `Users`(`puid`) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

####
# Structure for table ProductCategory
####
CREATE TABLE `ProductCategory`(
`category_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
`name` VARCHAR(64) NOT NULL,
`description` VARCHAR(128) NOT NULL,
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`category_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

####
# Structure for table ProductSubCategory
####
CREATE TABLE `ProductSubCategory`(
`category_id` INT(10) UNSIGNED NOT NULL,
`subcategory_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
`name` VARCHAR(64) NOT NULL,
`description` VARCHAR(128) NOT NULL,
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`subcategory_id`),
FOREIGN KEY (`category_id`) REFERENCES `ProductCategory`(`category_id`) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

####
# Structure for table Products
####
CREATE TABLE `Products`(
`product_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
`puid` INT(10) UNSIGNED NOT NULL,
`product_name` VARCHAR(128) NOT NULL,
`quantity` INT(10) NOT NULL,
`price` VARCHAR(10) NOT NULL,
`description` VARCHAR(256),
`status` ENUM('approved','pending','blocked'),
`category_id` INT(10) UNSIGNED NOT NULL,
`subcategory_id` INT(10) UNSIGNED NOT NULL,
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`product_id`, `puid`),
FOREIGN KEY (`puid`) REFERENCES `Users`(`puid`) ON DELETE CASCADE,
FOREIGN KEY (`category_id`) REFERENCES `ProductCategory`(`category_id`) ON DELETE CASCADE,
FOREIGN KEY (`subcategory_id`) REFERENCES `ProductSubCategory`(`subcategory_id`) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

####
# Structure for table Ratings
####
CREATE TABLE `Ratings`(
`rating_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
`product_id` INT(10) UNSIGNED NOT NULL,
`rating` ENUM('1', '2', '3', '4', '5'),
`reviews` VARCHAR(1024) NOT NULL,
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`rating_id`),
FOREIGN KEY (`product_id`) REFERENCES `Products`(`product_id`) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

####
# Structure for table Drivers
####
CREATE TABLE `Drivers`(
`driver_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
`name` VARCHAR(128) NOT NULL,
`phone` INT(10) UNSIGNED NOT NULL,
`status` ENUM('available', 'in_delivery'),
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`driver_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

####
# Structure for table DeliverySlots
####
CREATE TABLE `DeliverySlots`(
`delivery_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
`delivery_slot` VARCHAR(64) NOT NULL,
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`delivery_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

####
# Structure for table Billing
####
CREATE TABLE `Billing`(
`billing_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
`customer_id` INT(10) UNSIGNED NOT NULL,
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`address` VARCHAR(256) NOT NULL,
`location` VARCHAR(128) NOT NULL,
`state` VARCHAR(128) NOT NULL,
`zipcode` VARCHAR(10) NOT NULL,
`phone` VARCHAR(10) NOT NULL,
`total_price` INT(10) UNSIGNED NOT NULL,
`delivery_date` DATE NOT NULL,
`delivery_id` INT(10) UNSIGNED NOT NULL,
`driver_id` INT(10) UNSIGNED,
`status` ENUM('placed', 'packing', 'transit', 'delivered'),
`current_location` VARCHAR(512),
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`billing_id`),
FOREIGN KEY (`delivery_id`) REFERENCES `DeliverySlots`(`delivery_id`),
FOREIGN KEY (`driver_id`) REFERENCES `Drivers`(`driver_id`),
FOREIGN KEY (`customer_id`) REFERENCES `Users`(`puid`) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

####
# Structure for table BillingInfo
####
CREATE TABLE `BillingInfo`(
`billing_id` INT(10) UNSIGNED NOT NULL,
`product_id` INT(10) UNSIGNED NOT NULL,
`quantity` INT(10) UNSIGNED NOT NULL,
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`billing_id`, `product_id`),
FOREIGN KEY (`billing_id`) REFERENCES `Billing`(`billing_id`) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

####
# Structure for table Trucks
####
CREATE TABLE `Trucks`(
`truck_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
`truck_no` VARCHAR(20) NOT NULL,
`name` VARCHAR(128) NOT NULL,
`status` ENUM('available', 'in_delivery'),
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`truck_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

####
# Structure for table Trips

####
CREATE TABLE `Trips`(
`trip_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
`driver_id` INT(10) UNSIGNED NOT NULL,
`truck_id` INT(10) UNSIGNED NOT NULL,
`truck_location` VARCHAR(512) NOT NULL,
`admin_id` INT(10) UNSIGNED NOT NULL,
`comments` VARCHAR(128) NOT NULL,
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`trip_id`),
FOREIGN KEY (`admin_id`) REFERENCES `Users`(`puid`),
FOREIGN KEY (`driver_id`) REFERENCES `Drivers`(`driver_id`),
FOREIGN KEY (`truck_id`) REFERENCES `Trucks`(`truck_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

####
# Structure for table TripInfo
####
CREATE TABLE `TripInfo`(
`trip_id` INT(10) UNSIGNED NOT NULL,
`billing_id` INT(10) UNSIGNED NOT NULL,
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`trip_id`,`billing_id`),
FOREIGN KEY (`trip_id`) REFERENCES `Trips`(`trip_id`) ON DELETE CASCADE,
FOREIGN KEY (`billing_id`) REFERENCES `Billing`(`billing_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
#  Trigger to Auto-update a billing record info for every location update until delivered
#
DELIMITER $$
CREATE TRIGGER on_trip_location_update_create
AFTER UPDATE 
ON Trips FOR EACH ROW 
BEGIN #Auto-update a billing record info for every location update until delivered
   UPDATE Billing SET current_location = concat(current_location, '#', New.truck_location) where billing_id in (select billing_id
   from TripInfo where trip_id = New.trip_id) and status != 'delivered';
END $$

###
# This enables us to update or delete records without specifying a key (ex. primary key) in the where clause.
###
SET SQL_SAFE_UPDATES = 0;