import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1721573441748 implements MigrationInterface {
    name = 'Migration1721573441748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "full_name"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP CONSTRAINT "UQ_4fe49df021fe3221620e0a2ed15"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "phone" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD CONSTRAINT "UQ_48bcd862120c37c3f3fb70ba70f" UNIQUE ("phone")`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "date_modified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP CONSTRAINT "UQ_b503f29dfad15b0481843cf2b4a"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "email" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD CONSTRAINT "UQ_b503f29dfad15b0481843cf2b4a" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "password" character varying(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "password" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP CONSTRAINT "UQ_b503f29dfad15b0481843cf2b4a"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "email" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD CONSTRAINT "UQ_b503f29dfad15b0481843cf2b4a" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "date_modified"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "date_created"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP CONSTRAINT "UQ_48bcd862120c37c3f3fb70ba70f"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "created_at" text NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "phone_number" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD CONSTRAINT "UQ_4fe49df021fe3221620e0a2ed15" UNIQUE ("phone_number")`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "full_name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "last_name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "first_name" text NOT NULL`);
    }

}
