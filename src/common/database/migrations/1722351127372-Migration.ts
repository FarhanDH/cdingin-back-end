import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722351127372 implements MigrationInterface {
    name = 'Migration1722351127372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technicians" RENAME COLUMN "available" TO "is_available"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technicians" RENAME COLUMN "is_available" TO "available"`);
    }

}
