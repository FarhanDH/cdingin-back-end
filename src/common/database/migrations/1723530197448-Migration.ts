import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1723530197448 implements MigrationInterface {
    name = 'Migration1723530197448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problem_types" ADD "date_modified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ac_types" ADD "date_modified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ac_types" DROP COLUMN "date_modified"`);
        await queryRunner.query(`ALTER TABLE "problem_types" DROP COLUMN "date_modified"`);
    }

}
