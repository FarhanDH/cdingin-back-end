import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1723437877929 implements MigrationInterface {
    name = 'Migration1723437877929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ac_types" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(100) NOT NULL, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_7c68113c89f2179e832f16e6f28" UNIQUE ("name"), CONSTRAINT "PK_a5c95934a6003006131a31ac8e5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ac_types"`);
    }

}
