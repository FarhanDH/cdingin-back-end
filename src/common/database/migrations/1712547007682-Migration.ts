import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1712547007682 implements MigrationInterface {
    name = 'Migration1712547007682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" text NOT NULL, "last_name" text NOT NULL, "full_name" text NOT NULL, "phone_number" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "created_at" text NOT NULL DEFAULT now(), CONSTRAINT "UQ_46c5f573cb24bdc6e81b8ef2504" UNIQUE ("phone_number"), CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
