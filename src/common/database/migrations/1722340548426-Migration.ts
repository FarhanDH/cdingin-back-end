import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722340548426 implements MigrationInterface {
    name = 'Migration1722340548426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contacts_user_type_enum" AS ENUM('customer', 'technician')`);
        await queryRunner.query(`CREATE TABLE "contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "phone" character varying(15) NOT NULL, "email" character varying(100), "user_type" "public"."contacts_user_type_enum" NOT NULL, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_modified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "technicians" ALTER COLUMN "available" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technicians" ALTER COLUMN "available" SET DEFAULT false`);
        await queryRunner.query(`DROP TABLE "contacts"`);
        await queryRunner.query(`DROP TYPE "public"."contacts_user_type_enum"`);
    }

}
