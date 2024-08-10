import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1723280468146 implements MigrationInterface {
    name = 'Migration1723280468146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "problem_types" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(100) NOT NULL, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_bef4471651baf4f19de13c17e9c" UNIQUE ("name"), CONSTRAINT "PK_19150d03794e97a00d8bc5ba861" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "problem_types"`);
    }

}
