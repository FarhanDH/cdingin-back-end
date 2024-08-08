import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1723119918556 implements MigrationInterface {
    name = 'Migration1723119918556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technicians" ADD "date_of_birth" date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "date_of_birth"`);
    }

}
