import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductModify1654002575040 implements MigrationInterface {
    name = 'ProductModify1654002575040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`fee\` decimal(3,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`price\` decimal(12,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`price\` bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`fee\``);
    }

}
