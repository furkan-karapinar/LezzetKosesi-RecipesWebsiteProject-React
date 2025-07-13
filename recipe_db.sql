-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 13 Tem 2025, 17:51:17
-- Sunucu sürümü: 12.0.1-MariaDB
-- PHP Sürümü: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `recipe_db`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `badges`
--

CREATE TABLE `badges` (
  `id` int(11) NOT NULL,
  `badge_name` varchar(100) NOT NULL,
  `badge_icon_url` varchar(255) DEFAULT NULL,
  `badge_color` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `badges`
--

INSERT INTO `badges` (`id`, `badge_name`, `badge_icon_url`, `badge_color`) VALUES
(1, 'Yeni Üye', 'new.png', '#DC2525'),
(2, 'Aktif Kullanıcı', 'active.png', '#511D43'),
(3, 'Usta Şef', 'chef.png', '#901E3E');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `reading_time` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT 1,
  `image` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `like_count` int(11) DEFAULT 0,
  `comment_count` int(11) DEFAULT 0,
  `view_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `description`, `reading_time`, `user_id`, `category_id`, `image`, `content`, `is_deleted`, `created_at`, `updated_at`, `like_count`, `comment_count`, `view_count`) VALUES
(1, 'Sağlıklı Beslenme İpuçları', 'Günlük yaşamda sağlıklı beslenmenin püf noktaları.', 10, 2, 3, '1.jpg', 'Sağlıklı beslenmek için bol sebze tüketin...', 0, '2025-06-05 02:23:53', '2025-07-03 12:44:28', 1, 0, 1),
(2, 'Türkiye\'de En Güzel Tatil Yerleri', 'Gezilecek harika mekanlar.', 15, 1, 4, '2.jpg', 'Türkiye\'nin farklı bölgelerinde tatil önerileri...', 0, '2025-06-05 02:23:53', '2025-07-06 17:41:06', 0, 1, 0),
(3, 'Vegan Beslenme Başlangıç Rehberi', 'Veganlığa yeni başlayanlar için öneriler.', 12, 1, 4, '3.jpg', 'Et ve süt ürünlerinden nasıl uzak durulur, ne yenir?', 0, '2025-06-05 22:56:37', '2025-07-03 12:44:45', 2, 1, 1),
(4, 'Kahvaltılık Fikirler', 'Hafta içi pratik ve sağlıklı kahvaltılar.', 8, 1, 3, '4.jpg', 'Yumurta, avokado, yulaf gibi sağlıklı ürünlerle öneriler.', 0, '2025-06-05 22:56:37', '2025-07-03 12:44:52', 1, 0, 1),
(5, 'Glutensiz Tarifler', 'Gluten hassasiyeti olanlar için öneriler.', 6, 2, 5, '5.jpg', 'Badem unu ve pirinç unu ile yapılan sağlıklı tarifler.', 0, '2025-06-05 23:01:00', '2025-07-03 12:44:59', 3, 1, 4),
(6, 'Smoothie Tarifleri', 'Enerji veren meyveli smoothie karışımları.', 4, 1, 3, '6.jpg', 'Çilek, muz ve chia tohumlu serinletici tarifler.', 0, '2025-06-06 09:15:22', '2025-07-03 12:45:04', 2, 0, 6),
(7, 'Haftalık Yemek Planı', 'Daha verimli bir mutfak için haftalık plan önerisi.', 10, 2, 5, '7.jpg', 'Pazartesiden pazara pratik ve dengeli tarif önerileri.', 0, '2025-06-06 10:45:00', '2025-07-03 12:45:11', 5, 2, 10),
(8, 'Detoks Suları', 'Yaz için vücudu arındırıcı içecek tarifleri.', 3, 1, 4, '8.jpg', 'Salatalık, limon ve nane ile ferahlatıcı tarifler.', 0, '2025-06-06 11:05:45', '2025-07-03 12:45:17', 0, 0, 3),
(9, 'Vegan Akşam Yemekleri', 'Et tüketmeyenler için doyurucu tarifler.', 12, 2, 3, '9.jpg', 'Mercimek köftesi, nohut yemeği ve sebze kızartmaları.', 0, '2025-06-06 12:00:00', '2025-07-09 00:14:57', 8, 3, 12),
(10, 'Tatlı Krizlerine Hafif Çözümler', 'Az kalorili tatlı tarifleri.', 5, 1, 4, '10.jpg', 'Yoğurtlu meyveli kup, hurmalı enerji topları.', 0, '2025-06-06 14:10:00', '2025-07-03 12:45:29', 4, 0, 8),
(11, 'İftara Özel Menü', 'Ramazan için örnek iftar menüsü.', 9, 2, 5, '11.jpg', 'Çorba, ana yemek ve tatlı önerileriyle dolu menü.', 0, '2025-06-06 16:45:00', '2025-07-03 12:45:36', 6, 2, 9),
(12, 'Mutfak Alışveriş Listesi Hazırlama', 'Gereksiz harcamayı önleyen alışveriş listesi tüyoları.', 7, 1, 5, '12.jpg', 'Önceden planlama ve haftalık liste önerileri.', 0, '2025-06-06 18:20:00', '2025-07-03 12:45:42', 1, 0, 2),
(13, '5 Malzemeli Tarifler', 'Az malzemeyle lezzetli yemekler.', 6, 2, 4, '13.jpg', 'Yumurtalı ekmek, makarna salatası gibi tarifler.', 0, '2025-06-06 19:45:00', '2025-07-03 12:45:48', 3, 1, 5),
(14, 'Mevsim Sebzeleriyle Yemekler', 'Her mevsime uygun sebzeli tarifler.', 8, 1, 3, '14.jpg', 'Kabak, patlıcan, ıspanak gibi sebzelerle yapılan tarifler.', 0, '2025-06-07 09:00:00', '2025-07-03 12:45:54', 2, 0, 4),
(15, 'Evde Ekşi Maya Yapımı', 'Kendi ekşi mayanı üretmenin yolları.', 15, 2, 4, '15.jpg', 'Adım adım ekşi maya üretme rehberi.', 0, '2025-06-07 10:30:00', '2025-07-06 13:57:17', 10, 5, 15),
(16, 'Okula Giden Çocuklar İçin Öğle Yemeği Fikirleri', 'Besleyici ve pratik tarif önerileri.', 7, 1, 3, '16.jpg', 'Sandviç, meyve ve sağlıklı atıştırmalıklar. Sandviç, meyve ve sağlıklı atıştırmalıklar. Sandviç, meyve ve sağlıklı atıştırmalıklar. ', 0, '2025-06-07 13:00:00', '2025-07-06 01:49:11', 3, 1, 6),
(17, 'Fırınsız Tatlılar', 'Fırın kullanmadan yapılan pratik tatlılar.', 5, 2, 5, '17.jpg', 'Bisküvili pasta, mozaik kek gibi kolay tatlı tarifleri.', 0, '2025-06-07 15:00:00', '2025-07-03 12:46:12', 4, 0, 7),
(18, 'Yemek Sunumu Tüyoları', 'Yemeklerinizi daha estetik sunmak için ipuçları.', 4, 1, 4, '18.jpg', 'Tabak düzeni, renk uyumu ve süsleme önerileri.', 0, '2025-06-07 16:30:00', '2025-07-03 12:46:17', 1, 0, 2),
(19, 'merhaba bu bir deneme blog yazısıdır. ', 'merhaba bu bir deneme blog yazısıdır. ', 13, 2, 3, 'blog-1751234070665-615129814.jpg', 'merhaba bu bir deneme blog yazısıdır. merhaba bu bir deneme blog yazısıdır. merhaba bu bir deneme blog yazısıdır. merhaba bu bir deneme blog yazısıdır. ', 0, '2025-06-30 00:54:30', '2025-07-03 12:46:24', 0, 0, 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `bookmarks`
--

CREATE TABLE `bookmarks` (
  `id` int(11) NOT NULL,
  `recipe_or_blog_id` int(11) NOT NULL,
  `is_recipe` tinyint(1) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `bookmarks`
--

INSERT INTO `bookmarks` (`id`, `recipe_or_blog_id`, `is_recipe`, `user_id`, `created_at`) VALUES
(2, 2, 1, 3, '2025-06-05 02:23:53'),
(3, 1, 0, 2, '2025-06-05 02:23:53'),
(4, 3, 1, 2, '2025-06-05 22:56:37'),
(5, 5, 1, 1, '2025-06-05 22:56:37'),
(17, 1, 0, 1, '2025-06-16 14:23:01'),
(30, 13, 1, 1, '2025-07-04 19:00:24'),
(33, 1, 1, 1, '2025-07-06 01:47:14'),
(34, 7, 1, 1, '2025-07-06 01:50:36'),
(35, 4, 0, 1, '2025-07-06 01:50:43'),
(38, 15, 0, 1, '2025-07-06 13:57:19'),
(39, 2, 1, 1, '2025-07-06 14:00:30'),
(40, 1, 1, 26, '2025-07-09 00:14:51'),
(41, 9, 0, 26, '2025-07-09 00:14:58');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `category_type` enum('recipe','blog') NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `category_icon_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `categories`
--

INSERT INTO `categories` (`id`, `category_type`, `category_name`, `category_icon_path`) VALUES
(1, 'recipe', 'Tatlılar', 'dessert.png'),
(2, 'recipe', 'Ana Yemekler', 'main-course.png'),
(3, 'blog', 'Sağlıklı Yaşam', 'life.png'),
(4, 'blog', 'Seyahat', 'travel.png'),
(5, 'blog', 'Seyahat Plus', 'travel.png'),
(6, 'recipe', 'Atıştırmalıklar', 'cookies.png'),
(7, 'recipe', 'Çorbalar', 'soup.png');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `recipe_or_blog_id` int(11) NOT NULL,
  `is_recipe_comment` tinyint(1) NOT NULL,
  `is_reply` tinyint(1) DEFAULT 0,
  `replyed_comment_id` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `recipe_or_blog_id`, `is_recipe_comment`, `is_reply`, `replyed_comment_id`, `content`, `created_at`, `updated_at`, `is_deleted`) VALUES
(1, 2, 1, 1, 0, NULL, 'Bu tarifi denedim, çok güzel oldu!', '2025-06-05 02:23:53', '2025-06-05 02:23:53', 0),
(2, 3, 1, 1, 1, 1, 'Katılıyorum, gerçekten çok lezzetli!', '2025-06-05 02:23:53', '2025-06-05 02:23:53', 0),
(3, 1, 2, 0, 0, NULL, 'Harika bir blog yazısı, teşekkürler!', '2025-06-05 02:23:53', '2025-06-05 02:23:53', 0),
(4, 5, 4, 1, 0, NULL, 'Çorbanın kıvamı harika oldu, teşekkürler!', '2025-06-05 22:56:37', '2025-06-05 22:56:37', 0),
(5, 1, 4, 1, 1, 4, 'Evet ben de çok beğendim!', '2025-06-05 22:56:37', '2025-06-05 22:56:37', 0),
(6, 4, 3, 0, 0, NULL, 'Vegan rehber çok işime yaradı, ellerinize sağlık.', '2025-06-05 22:56:37', '2025-06-05 22:56:37', 0);

--
-- Tetikleyiciler `comments`
--
DELIMITER $$
CREATE TRIGGER `trg_comment_delete` AFTER DELETE ON `comments` FOR EACH ROW BEGIN
  IF OLD.is_recipe_comment = TRUE THEN
    UPDATE recipes SET comment_count = comment_count - 1 WHERE id = OLD.recipe_or_blog_id;
  ELSE
    UPDATE blogs SET comment_count = comment_count - 1 WHERE id = OLD.recipe_or_blog_id;
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_comment_insert` AFTER INSERT ON `comments` FOR EACH ROW BEGIN
  IF NEW.is_recipe_comment = TRUE THEN
    UPDATE recipes SET comment_count = comment_count + 1 WHERE id = NEW.recipe_or_blog_id;
  ELSE
    UPDATE blogs SET comment_count = comment_count + 1 WHERE id = NEW.recipe_or_blog_id;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `recipe_or_blog_id` int(11) NOT NULL,
  `is_recipe` tinyint(1) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `likes`
--

INSERT INTO `likes` (`id`, `recipe_or_blog_id`, `is_recipe`, `user_id`, `created_at`) VALUES
(1, 1, 1, 2, '2025-06-05 02:23:53'),
(2, 1, 1, 3, '2025-06-05 02:23:53'),
(5, 3, 1, 4, '2025-06-05 22:56:37'),
(6, 4, 1, 1, '2025-06-05 22:56:37'),
(7, 3, 0, 4, '2025-06-05 22:56:37'),
(8, 5, 1, 2, '2025-06-05 22:56:37'),
(21, 6, 1, 1, '2025-06-16 00:02:02'),
(65, 4, 0, 1, '2025-06-16 14:22:09'),
(66, 7, 1, 1, '2025-06-16 14:52:59'),
(69, 13, 1, 1, '2025-06-16 19:26:04'),
(90, 15, 1, 1, '2025-06-17 00:40:49'),
(91, 1, 0, 1, '2025-06-17 00:49:59'),
(101, 3, 0, 1, '2025-06-17 02:01:35'),
(103, 28, 1, 1, '2025-07-01 23:12:43'),
(107, 1, 1, 1, '2025-07-06 01:48:59'),
(108, 16, 0, 1, '2025-07-06 01:49:11'),
(114, 15, 0, 1, '2025-07-06 13:57:17'),
(115, 2, 1, 1, '2025-07-06 14:00:26'),
(116, 23, 1, 26, '2025-07-09 00:14:38'),
(117, 9, 0, 26, '2025-07-09 00:14:57');

--
-- Tetikleyiciler `likes`
--
DELIMITER $$
CREATE TRIGGER `trg_like_delete` AFTER DELETE ON `likes` FOR EACH ROW BEGIN
  IF OLD.is_recipe = TRUE THEN
    UPDATE recipes SET like_count = like_count - 1 WHERE id = OLD.recipe_or_blog_id;
  ELSE
    UPDATE blogs SET like_count = like_count - 1 WHERE id = OLD.recipe_or_blog_id;
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_like_insert` AFTER INSERT ON `likes` FOR EACH ROW BEGIN
  IF NEW.is_recipe = TRUE THEN
    UPDATE recipes SET like_count = like_count + 1 WHERE id = NEW.recipe_or_blog_id;
  ELSE
    UPDATE blogs SET like_count = like_count + 1 WHERE id = NEW.recipe_or_blog_id;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `score` tinyint(4) DEFAULT NULL CHECK (`score` between 1 and 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `ratings`
--

INSERT INTO `ratings` (`id`, `recipe_id`, `user_id`, `score`) VALUES
(1, 1, 2, 4),
(2, 1, 3, 5),
(3, 2, 1, 3),
(4, 3, 4, 5),
(5, 4, 1, 4),
(6, 5, 5, 5);

--
-- Tetikleyiciler `ratings`
--
DELIMITER $$
CREATE TRIGGER `trg_rating_delete` AFTER DELETE ON `ratings` FOR EACH ROW BEGIN
  UPDATE recipes
  SET average_rating = (
    SELECT IFNULL(ROUND(AVG(score), 2), 0)
    FROM ratings
    WHERE recipe_id = OLD.recipe_id
  )
  WHERE id = OLD.recipe_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_rating_insert` AFTER INSERT ON `ratings` FOR EACH ROW BEGIN
  UPDATE recipes
  SET average_rating = (
    SELECT ROUND(AVG(score), 2)
    FROM ratings
    WHERE recipe_id = NEW.recipe_id
  )
  WHERE id = NEW.recipe_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_rating_update` AFTER UPDATE ON `ratings` FOR EACH ROW BEGIN
  UPDATE recipes
  SET average_rating = (
    SELECT ROUND(AVG(score), 2)
    FROM ratings
    WHERE recipe_id = NEW.recipe_id
  )
  WHERE id = NEW.recipe_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `recipes`
--

CREATE TABLE `recipes` (
  `id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `reading_time` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `difficulty` varchar(50) DEFAULT NULL,
  `servings` varchar(50) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `chef` varchar(100) DEFAULT NULL,
  `ingredients` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `like_count` int(11) DEFAULT 0,
  `comment_count` int(11) DEFAULT 0,
  `view_count` int(11) DEFAULT 0,
  `average_rating` decimal(3,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `recipes`
--

INSERT INTO `recipes` (`id`, `title`, `description`, `image`, `reading_time`, `user_id`, `difficulty`, `servings`, `category_id`, `chef`, `ingredients`, `content`, `is_deleted`, `created_at`, `updated_at`, `like_count`, `comment_count`, `view_count`, `average_rating`) VALUES
(1, 'Fırında Tavuk', 'Lezzetli ve pratik fırında tavuk tarifi.', 'firinda-tavuk.jpg', 45, 1, 'Orta', '4', 2, 'Ahmet Yılmaz', 'Tavuk, baharatlar, zeytinyağı', 'Tavuğu baharatlarla marine edin, fırında pişirin.', 0, '2025-06-05 02:23:53', '2025-07-13 18:27:52', 8094, 2, 6515, 4.50),
(2, 'Çikolatalı Kek', 'Klasik ve nemli çikolatalı kek.', 'cikolatali-kek.jpg', 60, 2, 'Kolay', '8', 1, 'Elif Demir', 'Un, kakao, şeker, yumurta, süt', 'Malzemeleri karıştırıp fırında pişirin.', 0, '2025-06-05 02:23:53', '2025-07-13 18:27:52', 5585, 0, 4607, 3.00),
(3, 'Mercimek Çorbası', 'Klasik Türk usulü mercimek çorbası.', 'mercimek.jpg', 30, 4, 'Kolay', '4', 7, 'Zeynep Sarı', 'Kırmızı mercimek, soğan, havuç, patates, tuz', 'Tüm malzemeleri haşlayıp blenderdan geçirin.', 0, '2025-06-05 22:55:17', '2025-07-13 18:27:52', 3393, 0, 10489, 5.00),
(4, 'Sebzeli Kuskus', 'Sağlıklı ve lezzetli bir vegan tarif.', 'sebzeli-kuskus.jpg', 25, 4, 'Orta', '3', 2, 'Zeynep Sarı', 'Kuskus, kabak, havuç, zeytinyağı', 'Sebzeleri doğrayıp kavurun, kuskusla karıştırın.', 0, '2025-06-05 22:55:17', '2025-07-13 18:27:52', 9960, 2, 5628, 4.00),
(5, 'Fırın Mücver', 'Yağsız fırında yapılan sebzeli mücver.', 'mucver.jpg', 35, 2, 'Kolay', '5', 1, 'Elif Demir', 'Kabak, yumurta, un, peynir', 'Tüm malzemeleri karıştır, tepsiye dök ve fırına ver.', 0, '2025-06-05 22:55:17', '2025-07-13 18:27:52', 9371, 0, 3673, 5.00),
(6, 'Tavuklu Sebzeli Güveç', 'Fırında ağır ağır pişen enfes bir yemek.', 'tavuklu-guvec.jpg', 60, 3, 'Orta', '4', 2, 'Şef Ayşe', 'Tavuk, patates, havuç, domates, biber', 'Tüm malzemeleri doğrayıp güveç kabına yerleştirin ve 180 derece fırında 1 saat pişirin.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 6727, 0, 8481, 0.00),
(7, 'Zeytinyağlı Yaprak Sarma', 'Geleneksel Türk mutfağından eşsiz bir tat.', 'yaprak-sarma.jpg', 90, 5, 'Zor', '6', 2, 'Şef Fatma', 'Asma yaprağı, pirinç, soğan, zeytinyağı, baharatlar', 'İç harcı hazırlayıp yapraklara sarın, tencereye dizip zeytinyağı ve limonla pişirin.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 5272, 0, 8385, 0.00),
(8, 'Fırında Makarna', 'Kolay ve lezzetli bir öğün.', 'firinda-makarna.jpg', 35, 2, 'Kolay', '6', 1, 'Şef Ahmet', 'Makarna, kaşar peyniri, süt, yumurta', 'Makarnayı haşlayın, karışıma ekleyin ve fırında kızartın.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 5931, 0, 3484, 0.00),
(9, 'Mercimek Köftesi', 'Çay saatlerinin vazgeçilmezi.', 'mercimek-koftesi.jpg', 45, 6, 'Kolay', '5', 2, 'Şef Emine', 'Kırmızı mercimek, bulgur, soğan, salça, baharatlar', 'Mercimeği haşlayıp bulgurla karıştırın. Şekil verin ve yeşillikle servis edin.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 3588, 0, 9265, 0.00),
(10, 'Izgara Somon', 'Sağlıklı ve pratik bir balık yemeği.', 'izgara-somon.jpg', 25, 4, 'Kolay', '2', 1, 'Şef Berk', 'Somon fileto, limon, zeytinyağı, tuz, karabiber', 'Somonları marine edip ızgarada pişirin.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 9896, 0, 12872, 0.00),
(11, 'Karnıyarık', 'Kıymalı patlıcan dolması.', 'karniyarik.jpg', 50, 7, 'Orta', '4', 2, 'Şef Elif', 'Patlıcan, kıyma, soğan, domates, biber', 'Patlıcanları kızartın, içini doldurun ve fırında pişirin.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 8468, 0, 3568, 0.00),
(12, 'Yoğurtlu Kabak Salatası', 'Hafif ve serinletici bir meze.', 'yogurtlu-kabak-salatasi.jpg', 20, 9, 'Kolay', '3', 1, 'Şef Zeynep', 'Kabak, yoğurt, sarımsak, dereotu', 'Kabakları rendeleyip soteleyin, yoğurtla karıştırın.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 2402, 0, 6225, 0.00),
(13, 'Çikolatalı Sufle', 'İçi akışkan enfes bir tatlı.', 'cikolatali-sufle.jpg', 30, 1, 'Zor', '2', 1, 'Şef Mehmet', 'Bitter çikolata, tereyağı, yumurta, un, şeker', 'Tüm malzemeleri karıştırın, fırında kısa sürede pişirin.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 6355, 0, 7422, 0.00),
(14, 'Kuru Fasulye', 'Klasik Türk yemeği.', 'kuru-fasulye.jpg', 60, 3, 'Orta', '6', 2, 'Şef Hakan', 'Kuru fasulye, soğan, domates salçası, yağ', 'Fasulyeyi haşlayıp diğer malzemelerle pişirin.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 4320, 0, 5436, 0.00),
(15, 'Bulgur Pilavı', 'Neredeyse her yemeğin yanına yakışır.', 'bulgur-pilavi.jpg', 25, 1, 'Kolay', '4', 2, 'Şef Sevil', 'Bulgur, domates, soğan, biber, yağ', 'Soğan ve biberi kavurun, domates ve bulguru ekleyin, pişirin.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 2287, 0, 11913, 0.00),
(16, 'Mantı', 'Hamur işi sevenlere özel.', 'manti.jpg', 90, 5, 'Zor', '5', 2, 'Şef Ayla', 'Hamur, kıyma, yoğurt, sarımsak, salça', 'Hamuru açın, içini doldurun, haşlayın, sosla servis edin.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 8223, 0, 10258, 0.00),
(17, 'Sebzeli Kuskus', 'Renkli ve doyurucu bir tarif.', 'sebzeli-kuskus.jpg', 35, 8, 'Kolay', '4', 1, 'Şef Gökhan', 'Kuskus, havuç, kabak, bezelye, yağ', 'Sebzeleri soteleyip kuskusla karıştırın.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 4005, 0, 12553, 0.00),
(18, 'Yoğurt Çorbası', 'İlk kaşıkta huzur.', 'yogurt-corbasi.jpg', 30, 6, 'Kolay', '5', 7, 'Şef Hatice', 'Yoğurt, pirinç, yumurta, un, nane', 'Malzemeleri karıştırarak pişirin, nane ile süsleyin.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 5107, 0, 8991, 0.00),
(19, 'Etli Nohut', 'Bol proteinli ev yemeği.', 'etli-nohut.jpg', 50, 7, 'Orta', '4', 2, 'Şef Sadi', 'Kuşbaşı et, nohut, soğan, salça, yağ', 'Nohut ve eti pişirip birleştirin.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 3270, 0, 4298, 0.00),
(20, 'Kısır', 'Geleneksel bulgurlu salata.', 'kisir.jpg', 20, 1, 'Kolay', '6', 6, 'Şef Neşe', 'İnce bulgur, domates salçası, maydanoz, yeşillik', 'Bulguru ıslatın, malzemelerle yoğurun.', 0, '2025-06-05 23:08:13', '2025-07-13 18:27:52', 779, 0, 11516, 0.00),
(23, 'Ayıcık ve Tavşan Kurabiye', 'Çocuklar için yapması kolay bir tatlı', 'recipe-1751060217060-64481515.jpg', 90, 1, 'Kolay', '3-4', 1, NULL, '100 g tereyağı, 1 çay bardağı pudra şekeri, 1 adet yumurta, 1 çay kaşığı ucu ile kabartma tozu, 1,5 su bardağı un, 1 yemek kaşığı kakao', 'Kurabiye hamuru için yoğurma kabına oda sıcaklığında tereyağı, yumurta, pudra şekeri, kabartma tozu ve unun bir kısmını (yaklaşık 1 su bardağı + 1 yemek kaşığı) alarak yoğuralım.\r\n\r\nToparladığımız kurabiye hamurunu ikiye bölelim ve yarısına kakao, diğer yarısına da kalan unu ekleyerek tekrar yoğuralım.\r\n\r\nKurabiye hamurlarımızı un serptiğimiz tezgahta çok ince olmayacak şekilde açalım.\r\nAyıcık, tavşan ve kalp şeklindeki kalıplarla hamurumuzu keselim.\r\n\r\nOrtalarına kuruyemiş, kuru meyveler veya kalp şeklinde kestiğimiz küçük hamurlardan yerleştirerek kolları ile saralım.\r\n\r\nKurabiyelerimizi önceden ısıttığımız 170 °C fırında, alt üst fansız ayarda 9 dakika pişmeye bırakalım.\r\n\r\nSürenin sonunda pişen kurabiyelerimiz servise hazır. Afiyet olsun!', 0, '2025-06-28 00:36:57', '2025-07-13 18:27:52', 3836, 0, 11686, 0.00);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT 'default-avatar.png',
  `fullname` varchar(100) DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `about` text DEFAULT NULL,
  `badge_level_id` int(11) DEFAULT NULL,
  `passwd` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  `token` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `phone`, `address`, `city`, `country`, `avatar`, `fullname`, `gender`, `about`, `badge_level_id`, `passwd`, `created_at`, `updated_at`, `is_deleted`, `token`) VALUES
(1, 'guldn123', 'guldn123@example.com', '05551234567', 'Atatürk Cad. No:12', 'Malatya', 'Türkiye', 'avatar-16654654164.jpg', 'Gülden Ulusoy', 'female', 'Yemek yapmayı seven biri.', 3, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 02:23:53', '2025-07-13 17:57:16', 0, ''),
(2, 'elife', 'elif@example.com', '05559876543', 'Cumhuriyet Mah. 45', 'Ankara', 'Türkiye', 'avatar-1752018388425-288508009.jpg', 'Elif Demir', 'female', 'Blog yazarı ve yemek tutkunu.', 2, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 02:23:53', '2025-07-13 17:57:43', 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImVsaWZAZXhhbXBsZS5jb20iLCJpYXQiOjE3NTI0MTg2NjN9.xKmTnjIkXXvrPGMk1pcyugOFXhOMowMatFJPaaykjfs'),
(3, 'murat78', 'murat@example.com', '05553456789', 'Ataköy Sok. 10', 'İzmir', 'Türkiye', 'default-avatar.png', 'Murat Kaya', 'male', 'Deneyimli aşçı.', 3, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 02:23:53', '2025-07-13 17:56:31', 0, ''),
(4, 'mehmetk', 'mehmet.kaya@example.com', '05531234567', 'Atatürk Cd. No:45', 'İstanbul', 'Türkiye', 'default-avatar.png', 'Mehmet Kaya', 'male', 'Yemek yapmayı severim.', 1, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(5, 'ayse_d', 'ayse.dogan@example.com', '05539874512', 'Barbaros Blv. No:12', 'Ankara', 'Türkiye', 'default-avatar.png', 'Ayşe Doğan', 'female', 'Ev yemekleri konusunda iyiyim.', 2, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(6, 'ahmets', 'ahmet.sari@example.com', '05324567890', 'İnönü Cd. No:88', 'İzmir', 'Türkiye', 'default-avatar.png', 'Ahmet Sarı', 'male', 'Deniz mahsulleri favorimdir.', 1, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(7, 'elifb', 'elif.bulut@example.com', '05437894561', 'Cumhuriyet Mh. No:23', 'Bursa', 'Türkiye', 'default-avatar.png', 'Elif Bulut', 'female', 'Tatlı tarifleri paylaşmayı severim.', 3, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(8, 'muratc', 'murat.can@example.com', '05001239876', 'Yıldız Sk. No:34', 'Antalya', 'Türkiye', 'default-avatar.png', 'Murat Can', 'male', 'Kahvaltı tarifleri uzmanıyım.', 2, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(9, 'seleng', 'selen.gunes@example.com', '05554321098', 'Güneş Cd. No:11', 'Adana', 'Türkiye', 'default-avatar.png', 'Selen Güneş', 'female', 'Vegan tarifler paylaşırım.', 3, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(10, 'yakupk', 'yakup.kurt@example.com', '05440001122', 'Kartal Sk. No:77', 'Samsun', 'Türkiye', 'default-avatar.png', 'Yakup Kurt', 'male', 'Et yemeklerini severim.', 1, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(11, 'melis_t', 'melis.tuna@example.com', '05330004455', 'Balıkçı Sk. No:2', 'Mersin', 'Türkiye', 'default-avatar.png', 'Melis Tuna', 'female', 'Balık tariflerinde uzmanım.', 2, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(12, 'fatihy', 'fatih.yilmaz@example.com', '05059998877', 'Şehir Cd. No:56', 'Kayseri', 'Türkiye', 'default-avatar.png', 'Fatih Yılmaz', 'male', 'Fırın yemeklerini severim.', 2, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(13, 'zeynepb', 'zeynep.bora@example.com', '05443334422', 'Yemek Sk. No:10', 'Konya', 'Türkiye', 'avatar10.png', 'Zeynep Bora', 'female', 'Hamur işi tariflerinde iyiyim.', 1, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(14, 'canano', 'can.anil@example.com', '05220000111', 'Lezzet Cd. No:6', 'Gaziantep', 'Türkiye', 'avatar11.png', 'Can Anıl', 'male', 'Acı sevenler için tarifler yaparım.', 3, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(15, 'hilalc', 'hilal.cetin@example.com', '05007778899', 'Tatlı Sk. No:29', 'Denizli', 'Türkiye', 'avatar12.png', 'Hilal Çetin', 'female', 'Tatlı tariflerinde uzmanım.', 2, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(16, 'barisk', 'baris.koc@example.com', '05115556677', 'Mutfak Sk. No:17', 'Trabzon', 'Türkiye', 'avatar13.png', 'Barış Koç', 'male', 'Karadeniz yemekleri favorimdir.', 1, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(17, 'aylink', 'aylin.kurt@example.com', '05553336600', 'Sebze Sk. No:48', 'Erzurum', 'Türkiye', 'avatar14.png', 'Aylin Kurt', 'female', 'Sağlıklı tarifler paylaşırım.', 3, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(18, 'tugce_d', 'tugce.dogan@example.com', '05336668899', 'Meyve Cd. No:5', 'Eskişehir', 'Türkiye', 'avatar15.png', 'Tuğçe Doğan', 'female', 'Smoothie tariflerinde iyiyim.', 2, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(19, 'cemalb', 'cemal.boz@example.com', '05001110022', 'Tat Sk. No:80', 'Malatya', 'Türkiye', 'avatar16.png', 'Cemal Boz', 'male', 'Kuruyemişli tarifler favorim.', 1, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(20, 'nazlise', 'nazli.sevgi@example.com', '05551119900', 'Ana Sk. No:21', 'Çanakkale', 'Türkiye', 'avatar17.png', 'Nazlı Sevgi', 'female', 'Geleneksel mutfakları severim.', 3, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(21, 'onur_o', 'onur.orhan@example.com', '05330004567', 'Deniz Sk. No:3', 'Balıkesir', 'Türkiye', 'avatar18.png', 'Onur Orhan', 'male', 'Deniz ürünlerine ilgim var.', 2, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(22, 'esmay', 'esma.yildiz@example.com', '05442223344', 'Zeytin Sk. No:13', 'Manisa', 'Türkiye', 'avatar19.png', 'Esma Yıldız', 'female', 'Mezeler konusunda deneyimliyim.', 2, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(23, 'enes_t', 'enes.toprak@example.com', '05557778899', 'Baharat Sk. No:90', 'Van', 'Türkiye', 'avatar20.png', 'Enes Toprak', 'male', 'Baharatlı tarifleri severim.', 1, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-06-05 22:35:02', '2025-07-13 17:56:31', 0, ''),
(26, 'alikilic', 'ali@mail.com', '05398452153', 'aaaa', 'İzmir', 'Türkiye', 'avatar-1752019369350-40928625.png', 'Ali Kılıç', 'male', 'dfdfd', 1, '$2b$10$Kj3NqhUIAy6m32pTNSKzi.AGlSi4nfHLQKsKgCjtM7ROY8koqWAuK', '2025-07-08 16:08:38', '2025-07-13 17:54:10', 0, '');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `views`
--

CREATE TABLE `views` (
  `id` int(11) NOT NULL,
  `recipe_or_blog_id` int(11) NOT NULL,
  `is_recipe` tinyint(1) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `views`
--

INSERT INTO `views` (`id`, `recipe_or_blog_id`, `is_recipe`, `created_at`) VALUES
(1, 1, 1, '2025-06-05 02:23:53'),
(2, 1, 1, '2025-06-05 02:23:53'),
(3, 2, 1, '2025-06-05 02:23:53'),
(4, 1, 0, '2025-06-05 02:23:53'),
(5, 3, 1, '2025-06-05 22:56:37'),
(6, 4, 1, '2025-06-05 22:56:37'),
(7, 5, 1, '2025-06-05 22:56:37'),
(8, 3, 0, '2025-06-05 22:56:37'),
(9, 4, 0, '2025-06-05 22:56:37');

--
-- Tetikleyiciler `views`
--
DELIMITER $$
CREATE TRIGGER `trg_view_insert` AFTER INSERT ON `views` FOR EACH ROW BEGIN
  IF NEW.is_recipe = TRUE THEN
    UPDATE recipes SET view_count = view_count + 1 WHERE id = NEW.recipe_or_blog_id;
  ELSE
    UPDATE blogs SET view_count = view_count + 1 WHERE id = NEW.recipe_or_blog_id;
  END IF;
END
$$
DELIMITER ;

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `badges`
--
ALTER TABLE `badges`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `bc` (`category_id`);

--
-- Tablo için indeksler `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Tablo için indeksler `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `replyed_comment_id` (`replyed_comment_id`);

--
-- Tablo için indeksler `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Tablo için indeksler `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recipe_id` (`recipe_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Tablo için indeksler `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `badge_level_id` (`badge_level_id`);

--
-- Tablo için indeksler `views`
--
ALTER TABLE `views`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `badges`
--
ALTER TABLE `badges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Tablo için AUTO_INCREMENT değeri `bookmarks`
--
ALTER TABLE `bookmarks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Tablo için AUTO_INCREMENT değeri `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Tablo için AUTO_INCREMENT değeri `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Tablo için AUTO_INCREMENT değeri `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- Tablo için AUTO_INCREMENT değeri `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Tablo için AUTO_INCREMENT değeri `views`
--
ALTER TABLE `views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blog_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD CONSTRAINT `bookmarks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`replyed_comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recipes_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`badge_level_id`) REFERENCES `badges` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
