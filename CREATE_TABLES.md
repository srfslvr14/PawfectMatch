CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(512) DEFAULT NULL,
  `email` varchar(512) DEFAULT NULL,
  `password` varchar(512) DEFAULT NULL,
  `first_name` varchar(512) DEFAULT NULL,
  `last_name` varchar(512) DEFAULT NULL,
  `sso_id` varchar(512) DEFAULT NULL,
  `action_token` varchar(512) DEFAULT NULL,
  `last_password_change` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  `past_passwords_hash` text DEFAULT NULL,
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `dbuser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `auth` int(11) NOT NULL, FOREIGN KEY (`auth`) REFERENCES `dbuser` (`id`) ON DELETE CASCADE,
  `email` varchar(512) DEFAULT NULL,
  `first_name` varchar(512) DEFAULT NULL,
  `last_name` varchar(512) DEFAULT NULL,
  `curr_dog_index` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user_pref` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_owned` int(11), FOREIGN KEY (`user_owned`) REFERENCES `dbuser` (`id`) ON DELETE CASCADE,
  `breed` varchar(512) DEFAULT NULL,
  `size` varchar(512) DEFAULT NULL,
  `fur_color` varchar(512) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `house_trained` int(11) DEFAULT NULL,
  `kid_safe` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `curr_dogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_owned` int(11) NOT NULL, FOREIGN KEY (`dog_index`) REFERENCES `dbuser` (`id`) ON DELETE CASCADE,
  `dog_index` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `dog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `list_in` int(11) NOT NULL, FOREIGN KEY (`list_in`) REFERENCES `curr_dogs` (`id`) ON DELETE CASCADE,
  `dog_id` int(11) NOT NULL DEFAULT 0,
  `dog_name` varchar(512) DEFAULT NULL,
  `dog_breed` varchar(512) DEFAULT NULL,
  `dog_age` varchar(512) DEFAULT NULL,
  `dog_gender` varchar(512) DEFAULT NULL,
  `dog_size` varchar(512) DEFAULT NULL,
  `dog_fur` varchar(512) DEFAULT NULL,
  `dog_potty` varchar(512) DEFAULT NULL,
  `dog_kid` varchar(512) DEFAULT NULL,
  `dog_location` varchar(512) DEFAULT NULL,
  `dog_desc` varchar(512) DEFAULT NULL,
  `dog_url` varchar(512) DEFAULT NULL,
  `dog_compscore` int(11) DEFAULT 0,
  `dog_photos` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `recent_matches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_owned` int(11), FOREIGN KEY (`user_owned`) REFERENCES `dbuser` (`id`) ON DELETE CASCADE,
  `dog_index` int(11) NOT NULL DEFAULT 0,
  `dog_name` varchar(512) DEFAULT NULL,
  `dog_images` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `auth_user_tag_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(512) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `record_id_fk` (`record_id`),
  CONSTRAINT `record_id_fk` FOREIGN KEY (`record_id`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `py4web_session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rkey` varchar(512) DEFAULT NULL,
  `rvalue` text,
  `expiration` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `expires_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rkey__idx` (`rkey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;