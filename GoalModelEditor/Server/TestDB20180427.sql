CREATE DATABASE  IF NOT EXISTS `GoalModel_Test` /*!40100 DEFAULT CHARACTER SET big5 */;
USE `GoalModel_Test`;
-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: GoalModel_Test
-- ------------------------------------------------------
-- Server version	8.0.11

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
  `ModelId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ModelName` varchar(45) NOT NULL,
  `ModelDescription` text,
  `URL` varchar(45) NOT NULL,
  `ProjectId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`ModelId`),
  KEY `MtoP_idx` (`ProjectId`),
  CONSTRAINT `MtoP` FOREIGN KEY (`ProjectId`) REFERENCES `project` (`ProjectId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GoalModel`
--

LOCK TABLES `GoalModel` WRITE;
/*!40000 ALTER TABLE `GoalModel` DISABLE KEYS */;
INSERT INTO `GoalModel` VALUES (1,'GoalModel1','test model','/gm/1',1),(2,'GM2','another test model','/gm/2',1);
/*!40000 ALTER TABLE `GoalModel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Project`
--

DROP TABLE IF EXISTS `Project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Project` (
  `ProjectId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ProjectName` varchar(45) NOT NULL,
  `ProjectDescription` varchar(45) DEFAULT NULL,
  `LastModified` datetime NOT NULL,
  `Size` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ProjectId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Project`
--

LOCK TABLES `Project` WRITE;
/*!40000 ALTER TABLE `Project` DISABLE KEYS */;
INSERT INTO `Project` VALUES (1,'Project 1','A test Project','1000-01-01 00:00:00',5);
/*!40000 ALTER TABLE `Project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `UserId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `Email` varchar(45) NOT NULL,
  `FirstName` varchar(45) NOT NULL,
  `LastName` varchar(45) NOT NULL,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `UserId_UNIQUE` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'111@123.com','User','One'),(2,'xinda.yu@outlook.com','Xinda','Yu'),(3,'aaa@123.com','Aa','Bb');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_Auth`
--

DROP TABLE IF EXISTS `User_Auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User_Auth` (
  `UserId` int(11) unsigned NOT NULL,
  `password` varchar(16) NOT NULL,
  `SignupTime` datetime NOT NULL,
  `LastLogin` datetime NOT NULL,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `UserId_UNIQUE` (`UserId`),
  CONSTRAINT `UserId` FOREIGN KEY (`UserId`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_Auth`
--

LOCK TABLES `User_Auth` WRITE;
/*!40000 ALTER TABLE `User_Auth` DISABLE KEYS */;
INSERT INTO `User_Auth` VALUES (3,'123456','1000-01-01 00:00:00','1000-01-01 00:00:00');
/*!40000 ALTER TABLE `User_Auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_Project`
--

DROP TABLE IF EXISTS `User_Project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User_Project` (
  `ProjectId` int(11) unsigned NOT NULL,
  `UserId` int(11) unsigned NOT NULL,
  `Priority` enum('OWN','EDIT','READ') NOT NULL,
  PRIMARY KEY (`ProjectId`,`UserId`),
  KEY `UserId_idx` (`UserId`),
  CONSTRAINT `PtoU` FOREIGN KEY (`UserId`) REFERENCES `user` (`userid`),
  CONSTRAINT `UtoP` FOREIGN KEY (`ProjectId`) REFERENCES `project` (`projectid`)
) ENGINE=InnoDB DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_Project`
--

LOCK TABLES `User_Project` WRITE;
/*!40000 ALTER TABLE `User_Project` DISABLE KEYS */;
INSERT INTO `User_Project` VALUES (1,1,'READ'),(1,2,'EDIT'),(1,3,'OWN');
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

-- Dump completed on 2018-04-27 11:18:35
