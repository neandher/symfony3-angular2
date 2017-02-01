<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20170201002238 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user ADD first_name VARCHAR(255) NOT NULL, ADD last_name VARCHAR(255) NOT NULL, ADD email_canonical VARCHAR(255) NOT NULL, ADD username VARCHAR(255) DEFAULT NULL, ADD avatar_image_name VARCHAR(255) DEFAULT NULL, ADD is_enabled TINYINT(1) NOT NULL, ADD salt VARCHAR(255) NOT NULL, ADD last_login_at DATETIME DEFAULT NULL, ADD is_locked TINYINT(1) NOT NULL, ADD is_expired TINYINT(1) NOT NULL, ADD expires_at DATETIME DEFAULT NULL, ADD confirmation_token VARCHAR(255) DEFAULT NULL, ADD password_requested_at DATETIME DEFAULT NULL, ADD roles LONGTEXT NOT NULL COMMENT \'(DC2Type:array)\', ADD is_credentials_expired TINYINT(1) NOT NULL, ADD credentials_expire_at DATETIME DEFAULT NULL, DROP name, DROP surname, DROP role, DROP image, DROP created_at');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON user (email)');
        $this->addSql('ALTER TABLE video CHANGE status status VARCHAR(255) NOT NULL');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP INDEX UNIQ_8D93D649E7927C74 ON user');
        $this->addSql('ALTER TABLE user ADD name VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci, ADD surname VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci, ADD role VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci, ADD image VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci, ADD created_at DATETIME NOT NULL, DROP first_name, DROP last_name, DROP email_canonical, DROP username, DROP avatar_image_name, DROP is_enabled, DROP salt, DROP last_login_at, DROP is_locked, DROP is_expired, DROP expires_at, DROP confirmation_token, DROP password_requested_at, DROP roles, DROP is_credentials_expired, DROP credentials_expire_at');
        $this->addSql('ALTER TABLE video CHANGE status status VARCHAR(20) NOT NULL COLLATE utf8_unicode_ci');
    }
}
