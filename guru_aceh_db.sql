-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 29, 2026 at 11:44 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `guru_aceh_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `guru`
--

CREATE TABLE `guru` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guru`
--

INSERT INTO `guru` (`id`, `nama`, `email`, `password_hash`, `created_at`) VALUES
(1, 'Budi Santoso', 'budi@sekolah.sch.id', '$2b$10$APK5Uwb3XW/9v2DbQW4VLuypcvdQKKoCkeRCR5ORLlJT850Lao5KG', '2026-07-26 15:44:21');

-- --------------------------------------------------------

--
-- Table structure for table `materi`
--

CREATE TABLE `materi` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `category` varchar(50) NOT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `materi_count` int(11) DEFAULT 1,
  `konten_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `materi`
--

INSERT INTO `materi` (`id`, `title`, `deskripsi`, `category`, `duration`, `materi_count`, `konten_url`, `created_at`) VALUES
(1, 'Pengenalan Budaya Aceh dalam Pembelajaran', 'Modul dasar mengenal kearifan lokal Aceh untuk konteks pembelajaran IPA.', 'budaya', '45 menit', 4, NULL, '2026-07-27 08:13:04'),
(2, 'Konsep HOTS dalam Soal IPA', 'Cara menyusun soal IPA berbasis Higher Order Thinking Skills.', 'hots', '60 menit', 5, NULL, '2026-07-27 08:13:04'),
(3, 'Integrasi Budaya Aceh & Sains', 'Menggabungkan kearifan budaya Aceh dengan konsep sains modern.', 'budaya', '30 menit', 3, NULL, '2026-07-27 08:13:04');

-- --------------------------------------------------------

--
-- Table structure for table `paket_soal`
--

CREATE TABLE `paket_soal` (
  `id` int(11) NOT NULL,
  `guru_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `grade` varchar(20) NOT NULL,
  `hots_level` varchar(5) NOT NULL,
  `stimulus` text NOT NULL,
  `wordwall_url` varchar(255) DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `paket_soal`
--

INSERT INTO `paket_soal` (`id`, `guru_id`, `title`, `subject`, `grade`, `hots_level`, `stimulus`, `wordwall_url`, `status`, `created_at`) VALUES
(1, 1, 'Kopi Gayo', 'Kimia', 'SMP', 'C4', 'Kopi Gayo yang tumbuh di dataran tinggi Aceh Tengah...', 'https://wordwall.net/resource/00000001/kopi-gayo', 'published', '2026-07-27 09:56:13'),
(2, 1, 'tes', 'Biologi', 'SMP', 'C4', 'adfadf', NULL, 'draft', '2026-07-27 09:58:36'),
(3, 1, 'tes lagi', 'Fisika', 'SMP', 'C6', 'weqeqweqwe', NULL, 'draft', '2026-07-28 17:17:50');

-- --------------------------------------------------------

--
-- Table structure for table `progress_materi`
--

CREATE TABLE `progress_materi` (
  `id` int(11) NOT NULL,
  `guru_id` int(11) NOT NULL,
  `materi_id` int(11) NOT NULL,
  `progress` int(11) DEFAULT 0,
  `last_opened` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `guru`
--
ALTER TABLE `guru`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `materi`
--
ALTER TABLE `materi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `paket_soal`
--
ALTER TABLE `paket_soal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guru_id` (`guru_id`);

--
-- Indexes for table `progress_materi`
--
ALTER TABLE `progress_materi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_guru_materi` (`guru_id`,`materi_id`),
  ADD KEY `materi_id` (`materi_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `guru`
--
ALTER TABLE `guru`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `materi`
--
ALTER TABLE `materi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `paket_soal`
--
ALTER TABLE `paket_soal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `progress_materi`
--
ALTER TABLE `progress_materi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `paket_soal`
--
ALTER TABLE `paket_soal`
  ADD CONSTRAINT `paket_soal_ibfk_1` FOREIGN KEY (`guru_id`) REFERENCES `guru` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `progress_materi`
--
ALTER TABLE `progress_materi`
  ADD CONSTRAINT `progress_materi_ibfk_1` FOREIGN KEY (`guru_id`) REFERENCES `guru` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `progress_materi_ibfk_2` FOREIGN KEY (`materi_id`) REFERENCES `materi` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
