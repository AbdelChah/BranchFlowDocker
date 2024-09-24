-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: branchflowdb
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch` (
  `BranchID` int NOT NULL AUTO_INCREMENT,
  `BranchName` varchar(100) NOT NULL,
  `BranchCode` varchar(2) NOT NULL,
  `CreationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ModificationDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `IsDisabled` tinyint(1) DEFAULT '0',
  `IsDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`BranchID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
INSERT INTO `branch` VALUES (1,'Dekweneh','03','2024-08-16 09:27:00',NULL,NULL,NULL);
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cash_tracking`
--

DROP TABLE IF EXISTS `cash_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_tracking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teller_id` int DEFAULT NULL,
  `TillID` int DEFAULT NULL,
  `sod_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `eod_time` timestamp NULL DEFAULT NULL,
  `usd_sod_total` decimal(10,2) DEFAULT '0.00',
  `usd_eod_total` decimal(10,2) DEFAULT '0.00',
  `lbp_sod_total` decimal(15,2) DEFAULT '0.00',
  `lbp_eod_total` decimal(15,2) DEFAULT '0.00',
  `usd_running_total` decimal(10,2) DEFAULT '0.00',
  `lbp_running_total` decimal(15,2) DEFAULT '0.00',
  `status` enum('SOD','EOD','Active') DEFAULT 'SOD',
  `usd_sod_denominations` json DEFAULT NULL,
  `lbp_sod_denominations` json DEFAULT NULL,
  `running_count_lbp` json DEFAULT NULL,
  `running_count_usd` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teller_id` (`teller_id`),
  KEY `TillID` (`TillID`),
  CONSTRAINT `cash_tracking_ibfk_1` FOREIGN KEY (`teller_id`) REFERENCES `user` (`UserID`),
  CONSTRAINT `cash_tracking_ibfk_2` FOREIGN KEY (`TillID`) REFERENCES `till` (`TillID`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_tracking`
--

LOCK TABLES `cash_tracking` WRITE;
/*!40000 ALTER TABLE `cash_tracking` DISABLE KEYS */;
INSERT INTO `cash_tracking` VALUES (16,1,1,'2024-09-18 12:18:22',NULL,24670.00,0.00,588000.00,0.00,24670.00,588000.00,'SOD','{\"1\": 765, \"5\": 7, \"10\": 765, \"20\": 76, \"50\": 98, \"100\": 98}','{\"1000\": 98, \"5000\": 98, \"10000\": 0, \"20000\": 0, \"50000\": 0, \"100000\": 0}',NULL,NULL),(17,1,1,'2024-09-20 06:34:21',NULL,0.00,0.00,0.00,0.00,0.00,0.00,'SOD','{\"1\": 0, \"5\": 0, \"10\": 0, \"20\": 0, \"50\": 0, \"100\": 0}','{\"1000\": 0, \"5000\": 0, \"10000\": 0, \"20000\": 0, \"50000\": 0, \"100000\": 0}',NULL,NULL),(18,1,1,'2024-09-21 14:24:52',NULL,0.00,0.00,0.00,0.00,0.00,0.00,'SOD','{\"1\": 0, \"5\": 0, \"10\": 0, \"20\": 0, \"50\": 0, \"100\": 0}','{\"1000\": 0, \"5000\": 0, \"10000\": 0, \"20000\": 0, \"50000\": 0, \"100000\": 0}',NULL,NULL);
/*!40000 ALTER TABLE `cash_tracking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `LogID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `TillID` int DEFAULT NULL,
  `EventType` enum('INSERT','UPDATE','DELETE','LOGIN','LOGOUT','ETC') NOT NULL,
  `Description` text,
  `EventDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`LogID`),
  KEY `UserID` (`UserID`),
  KEY `TillID` (`TillID`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `logs_ibfk_2` FOREIGN KEY (`TillID`) REFERENCES `till` (`TillID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `MenuID` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(100) DEFAULT NULL,
  `URL` varchar(255) DEFAULT NULL,
  `CreationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ModificationDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `IsDisabled` tinyint(1) DEFAULT '0',
  `IsDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`MenuID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `PermissionsID` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(100) DEFAULT NULL,
  `MenuID` int DEFAULT NULL,
  `CreationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ModificationDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PermissionsID`),
  KEY `MenuID` (`MenuID`),
  CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`MenuID`) REFERENCES `menu` (`MenuID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `RoleID` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(100) DEFAULT NULL,
  `CreationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ModificationDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`RoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rolepermission`
--

DROP TABLE IF EXISTS `rolepermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rolepermission` (
  `RolePermissionID` int NOT NULL AUTO_INCREMENT,
  `RoleID` int DEFAULT NULL,
  `PermissionsID` int DEFAULT NULL,
  `CreationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ModificationDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`RolePermissionID`),
  KEY `RoleID` (`RoleID`),
  KEY `PermissionsID` (`PermissionsID`),
  CONSTRAINT `rolepermission_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`),
  CONSTRAINT `rolepermission_ibfk_2` FOREIGN KEY (`PermissionsID`) REFERENCES `permissions` (`PermissionsID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rolepermission`
--

LOCK TABLES `rolepermission` WRITE;
/*!40000 ALTER TABLE `rolepermission` DISABLE KEYS */;
/*!40000 ALTER TABLE `rolepermission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service` (
  `ServiceID` int NOT NULL AUTO_INCREMENT,
  `ServiceProviderLookupID` int DEFAULT NULL,
  `ProductName` varchar(100) NOT NULL,
  `TransferType` varchar(10) NOT NULL,
  `CreationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ModificationDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Description` text,
  PRIMARY KEY (`ServiceID`),
  KEY `ServiceProviderLookupID` (`ServiceProviderLookupID`),
  CONSTRAINT `service_ibfk_1` FOREIGN KEY (`ServiceProviderLookupID`) REFERENCES `serviceproviderlookup` (`ServiceProviderLookupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `serviceentries`
--

DROP TABLE IF EXISTS `serviceentries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `serviceentries` (
  `ServiceEntriesID` int NOT NULL AUTO_INCREMENT,
  `ServiceID` int DEFAULT NULL,
  `Description` text,
  `Book` varchar(50) DEFAULT NULL,
  `ValueDate` datetime DEFAULT NULL,
  `DebitAccount` varchar(50) DEFAULT NULL,
  `CreditAccount` varchar(50) DEFAULT NULL,
  `AmountField` decimal(10,2) DEFAULT NULL,
  `CreationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ModificationDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ServiceEntriesID`),
  KEY `ServiceID` (`ServiceID`),
  CONSTRAINT `serviceentries_ibfk_1` FOREIGN KEY (`ServiceID`) REFERENCES `service` (`ServiceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serviceentries`
--

LOCK TABLES `serviceentries` WRITE;
/*!40000 ALTER TABLE `serviceentries` DISABLE KEYS */;
/*!40000 ALTER TABLE `serviceentries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicelookup`
--

DROP TABLE IF EXISTS `servicelookup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicelookup` (
  `ServiceLookupID` int NOT NULL AUTO_INCREMENT,
  `ServiceName` varchar(100) NOT NULL,
  PRIMARY KEY (`ServiceLookupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicelookup`
--

LOCK TABLES `servicelookup` WRITE;
/*!40000 ALTER TABLE `servicelookup` DISABLE KEYS */;
/*!40000 ALTER TABLE `servicelookup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `serviceproviderlookup`
--

DROP TABLE IF EXISTS `serviceproviderlookup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `serviceproviderlookup` (
  `ServiceProviderLookupID` int NOT NULL AUTO_INCREMENT,
  `ServiceProviderName` varchar(100) NOT NULL,
  `ServiceLookupID` int DEFAULT NULL,
  PRIMARY KEY (`ServiceProviderLookupID`),
  KEY `ServiceLookupID` (`ServiceLookupID`),
  CONSTRAINT `serviceproviderlookup_ibfk_1` FOREIGN KEY (`ServiceLookupID`) REFERENCES `servicelookup` (`ServiceLookupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serviceproviderlookup`
--

LOCK TABLES `serviceproviderlookup` WRITE;
/*!40000 ALTER TABLE `serviceproviderlookup` DISABLE KEYS */;
/*!40000 ALTER TABLE `serviceproviderlookup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `CreditAccount` json DEFAULT NULL,
  `DebitAccount` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (26,'MTC Touch','MTC Touch','/images/1723626314322-280343789.png','2024-08-14 09:05:14',NULL,NULL),(27,'Alfa','Alfa','/images/1723626370729-414856611.png','2024-08-14 09:06:10',NULL,NULL),(28,'Riaaya','Riaaya','/images/1723626403405-143673067.png','2024-08-14 09:06:43',NULL,NULL),(29,'Areeba','Areeba','/images/1723626416798-467683461.png','2024-08-14 09:06:56',NULL,NULL),(30,'Bet Arabia','Bet Arabia','/images/1723626428901-744769446.png','2024-08-14 09:07:08',NULL,NULL),(31,'Conservatoir','Conservatoir','/images/1723626447507-50886126.png','2024-08-14 09:07:27',NULL,NULL),(32,'BoB App','BoB App','/images/1723626467091-141919684.png','2024-08-14 09:07:47',NULL,NULL),(33,'ISV','ISV','/images/1723626480987-342009961.png','2024-08-14 09:08:00',NULL,NULL),(34,'Ogero','Ogero','/images/1723626498438-269377496.png','2024-08-14 09:08:18',NULL,NULL),(35,'Municipality Beirut','Municipality Beirut','/images/1723626518423-809276564.png','2024-08-14 09:08:38',NULL,NULL),(36,'POS','POS','/images/1723626571956-137124379.png','2024-08-14 09:09:31',NULL,NULL),(37,'Wedding List','Wedding List','/images/1723626600656-452081635.png','2024-08-14 09:10:00',NULL,NULL),(38,'LAU','LAU','/images/1723626610694-627847306.png','2024-08-14 09:10:10',NULL,NULL),(39,'TBO','TBO','/images/1723626623720-15164949.png','2024-08-14 09:10:23',NULL,NULL),(40,'Test','Mario Test','/images/1723635500836-834096725.png','2024-08-14 11:38:20','123','321'),(41,'Mojo','Mojo','/images/1723663552315-608629978.png','2024-08-14 19:25:52','123','321'),(42,'MOF','MOF','/images/1723663782589-326299681.png','2024-08-14 19:29:42','123','321'),(50,'Test','Testing Accounts','/images/1724048629566-259846156.png','2024-08-19 06:23:49','\"[\\\"123\\\",\\\"345\\\"]\"','\"[\\\"321\\\",\\\"543\\\"]\"');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `till`
--

DROP TABLE IF EXISTS `till`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `till` (
  `TillID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `BranchID` int DEFAULT NULL,
  `AccountNumber` varchar(20) DEFAULT NULL,
  `Description` text,
  `CreationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ModificationDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ExpirationDate` datetime DEFAULT NULL,
  `IsDisabled` tinyint(1) DEFAULT '0',
  `IsDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`TillID`),
  KEY `UserID` (`UserID`),
  KEY `BranchID` (`BranchID`),
  CONSTRAINT `till_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `till_ibfk_2` FOREIGN KEY (`BranchID`) REFERENCES `branch` (`BranchID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `till`
--

LOCK TABLES `till` WRITE;
/*!40000 ALTER TABLE `till` DISABLE KEYS */;
INSERT INTO `till` VALUES (1,1,1,'3208471634','Abed\'s Till','2024-08-16 09:30:21',NULL,NULL,NULL,NULL),(2,2,1,'321942109','Ziad\'s Till','2024-08-19 08:37:08',NULL,NULL,NULL,NULL),(3,3,1,'324124213','Mario\'s Till','2024-08-21 13:13:34',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `till` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactionentries`
--

DROP TABLE IF EXISTS `transactionentries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactionentries` (
  `TransactionEntriesID` int NOT NULL AUTO_INCREMENT,
  `TransactionID` int DEFAULT NULL,
  `ServiceEntriesID` int DEFAULT NULL,
  `Description` text,
  `DebitAccount` varchar(50) DEFAULT NULL,
  `CreditAccount` varchar(50) DEFAULT NULL,
  `AmountValue` decimal(10,2) DEFAULT NULL,
  `CreationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ModificationDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`TransactionEntriesID`),
  KEY `TransactionID` (`TransactionID`),
  KEY `ServiceEntriesID` (`ServiceEntriesID`),
  CONSTRAINT `transactionentries_ibfk_1` FOREIGN KEY (`TransactionID`) REFERENCES `transactions` (`TransactionID`),
  CONSTRAINT `transactionentries_ibfk_2` FOREIGN KEY (`ServiceEntriesID`) REFERENCES `serviceentries` (`ServiceEntriesID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactionentries`
--

LOCK TABLES `transactionentries` WRITE;
/*!40000 ALTER TABLE `transactionentries` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactionentries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactionlogs`
--

DROP TABLE IF EXISTS `transactionlogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactionlogs` (
  `TransactionLogID` int NOT NULL AUTO_INCREMENT,
  `TransactionID` int DEFAULT NULL,
  `OperationType` varchar(10) DEFAULT NULL,
  `OldValue` text,
  `NewValue` text,
  `ChangedBy` int DEFAULT NULL,
  `OperationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`TransactionLogID`),
  KEY `TransactionID` (`TransactionID`),
  KEY `ChangedBy` (`ChangedBy`),
  CONSTRAINT `transactionlogs_ibfk_1` FOREIGN KEY (`TransactionID`) REFERENCES `transactions` (`TransactionID`),
  CONSTRAINT `transactionlogs_ibfk_2` FOREIGN KEY (`ChangedBy`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactionlogs`
--

LOCK TABLES `transactionlogs` WRITE;
/*!40000 ALTER TABLE `transactionlogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactionlogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `TransactionID` int NOT NULL AUTO_INCREMENT,
  `ReferenceNumber` varchar(100) DEFAULT NULL,
  `CreationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ModificationDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ServiceID` int DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `Commission` decimal(10,2) DEFAULT NULL,
  `Rounding` decimal(10,2) DEFAULT NULL,
  `TotalAmount` decimal(10,2) DEFAULT NULL,
  `Currency` varchar(10) DEFAULT NULL,
  `TillID` int DEFAULT NULL,
  `IsCancelled` tinyint(1) DEFAULT '0',
  `OriginalTransID` int DEFAULT NULL,
  `FirstName` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`TransactionID`),
  KEY `TillID` (`TillID`),
  KEY `transactions_ibfk_1` (`ServiceID`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`ServiceID`) REFERENCES `services` (`id`),
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`TillID`) REFERENCES `till` (`TillID`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (61,'12345','2024-09-18 14:02:00','2024-09-18 14:02:00',32,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe'),(63,'12345','2024-09-18 14:08:57','2024-09-18 14:08:57',32,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe'),(64,'12345','2024-09-18 14:11:31','2024-09-18 14:11:31',33,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe'),(65,'12345','2024-09-18 14:12:37','2024-09-18 14:12:37',31,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe'),(66,'12345','2024-09-18 14:15:05','2024-09-18 14:15:05',31,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe'),(67,'12345','2024-09-18 14:20:19','2024-09-18 14:20:19',39,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe'),(68,'12345','2024-09-18 14:22:25','2024-09-18 14:22:25',41,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe'),(69,'12345','2024-09-18 14:23:40','2024-09-18 14:23:40',41,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe'),(70,'12345','2024-09-18 14:26:49','2024-09-18 14:26:49',41,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe'),(71,'12345','2024-09-18 15:16:25','2024-09-18 15:16:25',31,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe'),(72,'12345','2024-09-18 15:17:20','2024-09-18 15:17:20',27,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe'),(73,'12345','2024-09-18 15:31:48','2024-09-18 15:31:48',30,541000.00,10820.00,0.00,551820.00,'LBP',2,0,NULL,'John','Doe'),(74,'12345','2024-09-18 15:32:00','2024-09-18 15:32:00',27,541000.00,10820.00,0.00,551820.00,'LBP',2,0,NULL,'John','Doe'),(75,'12345','2024-09-18 20:49:12','2024-09-18 20:49:12',27,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe'),(76,'12345','2024-09-20 09:49:18','2024-09-20 09:49:18',26,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe'),(77,'12345','2024-09-20 09:49:48','2024-09-20 09:49:48',27,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe'),(78,'12345','2024-09-21 17:25:43','2024-09-21 17:25:43',26,541000.00,10820.00,0.00,551820.00,'LBP',1,0,NULL,'John','Doe');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_transaction_count` AFTER INSERT ON `transactions` FOR EACH ROW BEGIN
    DECLARE user_id INT;

    -- Find the UserID associated with the TillID used in the transaction
    SELECT UserID INTO user_id
    FROM till
    WHERE TillID = NEW.TillID;

    -- Update the transaction count for the corresponding user
    IF user_id IS NOT NULL THEN
        UPDATE user
        SET transaction_count = transaction_count + 0
        WHERE UserID = user_id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `CreationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ModificationDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `RoleID` int DEFAULT NULL,
  `Lastlogin` datetime DEFAULT NULL,
  `Lastlogout` datetime DEFAULT NULL,
  `goal` int DEFAULT '0',
  `transaction_count` int DEFAULT '0',
  PRIMARY KEY (`UserID`),
  KEY `RoleID` (`RoleID`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Achahbaz','Abc123456','Abdel','Chahbaz','2024-08-09 09:11:28','2024-09-23 09:57:19',NULL,'2024-09-23 09:57:19','2024-09-20 14:30:50',600,24),(2,'ZBou','Abc123456','Ziad','BouChacra','2024-08-16 12:39:12','2024-09-18 19:31:40',NULL,'2024-09-18 15:24:30','2024-09-18 19:31:40',2,2),(3,'MarioA','Abc123456','Mario','Atallah','2024-08-21 13:11:18','2024-09-16 16:09:24',NULL,NULL,'2024-09-16 16:09:24',0,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-23 16:40:09
