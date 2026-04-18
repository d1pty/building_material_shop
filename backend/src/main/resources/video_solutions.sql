-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Сен 24 2024 г., 18:40
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `video_solutions`
--

-- --------------------------------------------------------

--
-- Структура таблицы `cart`
--

CREATE TABLE `cart` (
  `id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `cart`
--

INSERT INTO `cart` (`id`, `quantity`, `session_id`, `product_id`) VALUES
(39, 1, '1025f13d-1ef9-4f42-8da5-b86a9a3b6576', 11),
(40, 1, '1025f13d-1ef9-4f42-8da5-b86a9a3b6576', 12),
(41, 2, 'e1a1f357-f938-4038-9669-b9774e6f6fce', 4);

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `customer_address` varchar(255) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_message` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(255) DEFAULT NULL,
  `date_created` datetime(6) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `total_price` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `customer_address`, `customer_email`, `customer_message`, `customer_name`, `customer_phone`, `date_created`, `session_id`, `total_price`) VALUES
(16, 'Ленина 6', 'ivan@mail.ru', 'Можно скидку?', 'Иван Иванов ', '+78005553535', '2024-09-22 02:42:53.000000', '79af7431-2ac3-454a-bd40-ec7116942b0d', 17494),
(17, 'Алмазная', 'den182a.gg@mail.ru', 'Я точно не буду подглядывать', 'Денис', '978855467346', '2024-09-22 02:44:32.000000', '79af7431-2ac3-454a-bd40-ec7116942b0d', 21197),
(18, 'Дубай', 'panin@mail.ru', 'Хочу смотреть за собаками дома', 'Алексей', '8989899889', '2024-09-22 02:47:40.000000', '79af7431-2ac3-454a-bd40-ec7116942b0d', 11897),
(19, 'Москва ', 'prigohxin@gmail.ru', 'А вы можете управлять городскими камерами?', 'Евгений', '8200200200', '2024-09-22 02:49:01.000000', '79af7431-2ac3-454a-bd40-ec7116942b0d', 0),
(20, 'На улице живу', 'test@mail.ru', 'Почему нельзя посмотреть пример работы камер?', 'Тестер', '097789667', '2024-09-22 02:50:25.000000', '79af7431-2ac3-454a-bd40-ec7116942b0d', 0),
(21, 'Ленина 17 ', 'Dm@mail.ru', 'Нужно установить 23 сентября, могу доплатить за скорость!', 'Дмитрий', '89641283716', '2024-09-22 17:26:04.000000', '94e69d1f-82b0-4b16-b69b-283ab5dacb4f', 29393),
(22, 'hfhffg', 'jhgfghhf@mail.ru', 'fhfghh', 'gjhgf', 'fghhjfg', '2024-09-22 22:43:36.000000', '1025f13d-1ef9-4f42-8da5-b86a9a3b6576', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `order_items`
--

INSERT INTO `order_items` (`id`, `quantity`, `order_id`, `product_id`) VALUES
(14, 3, 16, 1),
(15, 1, 16, 11),
(16, 1, 16, 12),
(17, 1, 16, 16),
(18, 2, 17, 3),
(19, 1, 17, 2),
(20, 2, 18, 2),
(21, 1, 18, 1),
(22, 1, 21, 1),
(23, 3, 21, 4),
(24, 1, 21, 16),
(25, 1, 21, 19),
(26, 1, 21, 11);

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `imagine_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `category`, `description`, `imagine_url`, `name`, `price`) VALUES
(1, 'forHome', '1080p, угол обзора 120°, двусторонняя аудиосвязь, ночное видение 15 м.', '/uploads/home1.jpg', 'HomeGuard 1080', 3499),
(2, 'forHome', 'Компактная камера 2K, ночное видение 10 м, подключение к Wi-Fi, обнаружение движения.', '/uploads/home2.jpg', 'SecureEye Mini', 4199),
(3, 'outside', '4K, угол обзора 130°, ночное видение 50 м, защита IP67.', '/uploads/1.jpg', 'SafeView Outdoor', 8499),
(4, 'outside', '2K, угол обзора 120°, ночное видение 40 м, защита от влаги и пыли.', '/uploads/2.jpg', 'StormGuard 2K', 6099),
(5, 'outside', '1080p, инфракрасное ночное видение 30 м, двусторонняя связь, IP66.', '/uploads/3.jpg', 'NightHawk Pro HD', 5899),
(6, 'outside', '1080p, обзор 360°, ночное видение 35 м, защита от взлома.', '/uploads/5.jpg', 'SkyWatch 360', 7799),
(7, 'outside', '4K, угол 140°, HDR, ночное видение 45 м, IP67.', '/uploads/4.jpg', 'Guardian Ultra 4K', 9199),
(8, 'forHome', '720p, угол обзора 100°, ночное видение, встроенный микрофон и динамик.', '/uploads/home4.jpg', 'SafeHome Cam', 2799),
(9, 'outside', '1080p, ночное видение 25 м, угол обзора 110°, защита IP65.', '/uploads/9.jpg', 'SecureView Outdoor HD', 4499),
(10, 'outside', '2K, угол 130°, ночное видение 40 м, защита от влаги и пыли.', '/uploads/6.jpg', 'SafeZone Pro 2K', 6799),
(11, 'complect', 'Блок питания 12V/5A для камер видеонаблюдения, защита от перегрузок', '/uploads/complect1.jpg', 'PowerBox Pro', 1199),
(12, 'complect', 'Коаксиальный кабель 20 м для подключения камер, для защиты от помех.', '/uploads/complect2.jpg', 'SafeLink Cable 20m', 799),
(13, 'complect', 'Универсальное крепление для наружных камер, регулируемый угол поворота.', '/uploads/complect3.jpg', 'WallMount Bracket', 599),
(14, 'outside', '1080p, инфракрасное ночное видение 50 м, IP66, встроенный микрофон.', '/uploads/8.jpg', 'UltraVision IR', 6699),
(15, 'outside', '1080p, ночное видение 35 м, защита от экстремальных температур, IP68.', '/uploads/7.jpg', 'StealthCam Outdoor 1080', 6999),
(16, 'montage', 'Полная установка видеокамер', '/uploads/montage.jpg', 'Монтаж', 4999),
(17, 'repair', 'Цена зависит относительно тяжести ремонта', '/uploads/nofoto.jpg', 'Ремонт', 1),
(18, 'forHome', '1080p, обзор 360°, датчик движения, двусторонняя связь, интеграция с умным домом.', '/uploads/home3.jpg', 'VisionPro 360', 5999),
(19, 'complect', 'Защитный кожух для камер, защита от дождя и солнечного света, IP66.', '/uploads/complect4.jpg', 'WeatherShield Cover', 1399),
(20, 'complect', 'Адаптер PoE для питания камер через Ethernet-кабель, до 30 Вт.', '/uploads/complect5.jpg', 'UltraPoE Adapter', 1799),
(21, 'complect', 'Набор анкерных болтов для крепления камер на бетонных поверхностях.', '/uploads/complect6.jpg', 'StrongHold Anchor Kit', 399);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKpu4bcbluhsxagirmbdn7dilm5` (`product_id`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  ADD KEY `FKocimc7dtr037rh4ls4l95nlfi` (`product_id`);

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `cart`
--
ALTER TABLE `cart`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT для таблицы `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT для таблицы `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `FKpu4bcbluhsxagirmbdn7dilm5` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Ограничения внешнего ключа таблицы `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `FKocimc7dtr037rh4ls4l95nlfi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
