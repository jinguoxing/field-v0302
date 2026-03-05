CREATE DATABASE IF NOT EXISTS semantic_config DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE semantic_config;

CREATE TABLE IF NOT EXISTS semantic_config_version (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(128) NOT NULL,
  status VARCHAR(16) NOT NULL,
  base_version_id BIGINT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uk_name (name),
  KEY idx_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS semantic_type_group (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  version_id BIGINT NOT NULL,
  code VARCHAR(64) NOT NULL,
  name_zh VARCHAR(128) NOT NULL,
  sort INT NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uk_ver_code (version_id, code),
  KEY idx_ver (version_id),
  CONSTRAINT fk_type_group_ver FOREIGN KEY (version_id) REFERENCES semantic_config_version(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS semantic_type (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  version_id BIGINT NOT NULL,
  code VARCHAR(64) NOT NULL,
  name_zh VARCHAR(128) NOT NULL,
  group_code VARCHAR(64) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  advanced TINYINT(1) NOT NULL DEFAULT 0,
  bias DOUBLE NOT NULL DEFAULT 0,
  sort INT NOT NULL DEFAULT 0,
  tooltip TEXT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uk_ver_code (version_id, code),
  KEY idx_ver_group (version_id, group_code),
  CONSTRAINT fk_type_ver FOREIGN KEY (version_id) REFERENCES semantic_config_version(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS semantic_type_alias (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  version_id BIGINT NOT NULL,
  type_code VARCHAR(64) NOT NULL,
  alias VARCHAR(128) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uk_ver_type_alias (version_id, type_code, alias),
  KEY idx_ver_type (version_id, type_code),
  CONSTRAINT fk_type_alias_ver FOREIGN KEY (version_id) REFERENCES semantic_config_version(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS semantic_role_group (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  version_id BIGINT NOT NULL,
  code VARCHAR(64) NOT NULL,
  name_zh VARCHAR(128) NOT NULL,
  sort INT NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uk_ver_code (version_id, code),
  KEY idx_ver (version_id),
  CONSTRAINT fk_role_group_ver FOREIGN KEY (version_id) REFERENCES semantic_config_version(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS semantic_role (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  version_id BIGINT NOT NULL,
  code VARCHAR(64) NOT NULL,
  name_zh VARCHAR(128) NOT NULL,
  group_code VARCHAR(64) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  advanced TINYINT(1) NOT NULL DEFAULT 0,
  bias DOUBLE NOT NULL DEFAULT 0,
  sort INT NOT NULL DEFAULT 0,
  tooltip TEXT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uk_ver_code (version_id, code),
  KEY idx_ver_group (version_id, group_code),
  CONSTRAINT fk_role_ver FOREIGN KEY (version_id) REFERENCES semantic_config_version(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS semantic_naming_rule (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  version_id BIGINT NOT NULL,
  rule_id VARCHAR(64) NOT NULL,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  priority INT NOT NULL DEFAULT 0,
  scope VARCHAR(16) NOT NULL DEFAULT 'FIELD',
  regex VARCHAR(512) NOT NULL,
  title VARCHAR(256) NOT NULL,
  summary VARCHAR(512) NULL,
  type_delta JSON NOT NULL,
  role_delta JSON NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uk_ver_rule (version_id, rule_id),
  KEY idx_ver (version_id),
  CONSTRAINT fk_rule_ver FOREIGN KEY (version_id) REFERENCES semantic_config_version(id)
) ENGINE=InnoDB;

INSERT INTO semantic_config_version (name, status) VALUES ('default-draft', 'DRAFT')
ON DUPLICATE KEY UPDATE updated_at = updated_at;
