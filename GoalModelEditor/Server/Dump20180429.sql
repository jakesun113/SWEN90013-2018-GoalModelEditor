CREATE DATABASE  IF NOT EXISTS `GoalModel_A` /*!40100 DEFAULT CHARACTER SET big5 */;
USE `GoalModel_A`;
-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: GoalModel_Test
-- ------------------------------------------------------
-- Server version	5.7.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `GoalModel`
--

DROP TABLE IF EXISTS `GoalModel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GoalModel` (
  `ModelId` varchar(64) NOT NULL,
  `ModelName` varchar(45) NOT NULL,
  `ModelDescription` text,
  `URL` varchar(45) NOT NULL,
  `ProjectId` varchar(64) NOT NULL,
  PRIMARY KEY (`ModelId`),
  UNIQUE KEY `ProjectId_UNIQUE` (`ProjectId`),
  CONSTRAINT `ProjectId_GM` FOREIGN KEY (`ProjectId`) REFERENCES `Project` (`ProjectId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GoalModel`
--

LOCK TABLES `GoalModel` WRITE;
/*!40000 ALTER TABLE `GoalModel` DISABLE KEYS */;
/*!40000 ALTER TABLE `GoalModel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Project`
--

DROP TABLE IF EXISTS `Project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Project` (
  `ProjectId` varchar(64) NOT NULL,
  `ProjectName` varchar(45) NOT NULL,
  `ProjectDescription` varchar(45) DEFAULT NULL,
  `LastModified` datetime NOT NULL,
  `Size` int(10) NOT NULL,
  PRIMARY KEY (`ProjectId`),
  UNIQUE KEY `ProjectId_UNIQUE` (`ProjectId`)
) ENGINE=InnoDB DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Project`
--

LOCK TABLES `Project` WRITE;
/*!40000 ALTER TABLE `Project` DISABLE KEYS */;
/*!40000 ALTER TABLE `Project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `UserId` varchar(64) NOT NULL,
  `UserName` varchar(45) NOT NULL,
  `Password` varchar(16) NOT NULL,
  `Email` varchar(45) NOT NULL,
  `FirstName` varchar(45) NOT NULL,
  `LastName` varchar(45) NOT NULL,
  `SignupTime` datetime NOT NULL,
  `LastLogin` datetime NOT NULL,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `UserId_UNIQUE` (`UserId`),
  UNIQUE KEY `UserName_UNIQUE` (`UserName`)
) ENGINE=InnoDB DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_Project`
--

DROP TABLE IF EXISTS `User_Project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User_Project` (
  `ProjectId` varchar(64) NOT NULL,
  `UserId` varchar(64) NOT NULL,
  `Priority` enum('OWN','EDIT','READ') NOT NULL,
  PRIMARY KEY (`ProjectId`,`UserId`),
  UNIQUE KEY `ProjectId_UNIQUE` (`ProjectId`),
  UNIQUE KEY `UserId_UNIQUE` (`UserId`),
  KEY `UserId_Proj_idx` (`UserId`),
  CONSTRAINT `ProjectId_Proj` FOREIGN KEY (`ProjectId`) REFERENCES `Project` (`ProjectId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `UserId_Proj` FOREIGN KEY (`UserId`) REFERENCES `User` (`UserId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_Project`
--

LOCK TABLES `User_Project` WRITE;
/*!40000 ALTER TABLE `User_Project` DISABLE KEYS */;
/*!40000 ALTER TABLE `User_Project` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-27 15:32:28
