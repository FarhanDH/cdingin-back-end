import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722337694900 implements MigrationInterface {
    name = 'Migration1722337694900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technicians" DROP CONSTRAINT "UQ_48bcd862120c37c3f3fb70ba70f"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP CONSTRAINT "UQ_b503f29dfad15b0481843cf2b4a"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "image_key" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "image_url" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "license_plate" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "available" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "available"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "license_plate"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "image_url"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "image_key"`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "email" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD CONSTRAINT "UQ_b503f29dfad15b0481843cf2b4a" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "phone" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD CONSTRAINT "UQ_48bcd862120c37c3f3fb70ba70f" UNIQUE ("phone")`);
    }

}
