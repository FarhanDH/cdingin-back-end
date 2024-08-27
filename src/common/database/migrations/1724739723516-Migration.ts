import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724739723516 implements MigrationInterface {
    name = 'Migration1724739723516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone" character varying(15) NOT NULL, "email" character varying(100), "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_modified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_84cae51c485079bdd8cdf1d828f" UNIQUE ("phone"), CONSTRAINT "UQ_752866c5247ddd34fd05559537d" UNIQUE ("email"), CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ac_types" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(100) NOT NULL, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_modified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_7c68113c89f2179e832f16e6f28" UNIQUE ("name"), CONSTRAINT "PK_a5c95934a6003006131a31ac8e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "building_types" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_modified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_59a1db89ebd081596fd861f7ace" UNIQUE ("name"), CONSTRAINT "PK_7fe9b63a2e5a344c346511dc198" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "body" text NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "customerId" uuid, "technicianId" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_modified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "contact_id" uuid, CONSTRAINT "REL_33b58dec36433e445e69354144" UNIQUE ("contact_id"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "problem_types" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(100) NOT NULL, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_modified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_bef4471651baf4f19de13c17e9c" UNIQUE ("name"), CONSTRAINT "PK_19150d03794e97a00d8bc5ba861" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'taken', 'to_location', 'in_progress', 'completed')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_latitude" numeric(9,6) NOT NULL, "customer_longitude" numeric(9,6) NOT NULL, "detail_location" character varying(255), "number_of_units" integer NOT NULL, "building_floor_location" character varying(2) NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending', "date_service" date NOT NULL, "total_price" numeric(10,2), "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_modified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "customerId" uuid, "technicianId" uuid, "problemTypeId" integer, "acTypeId" integer, "buildingTypeId" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "technicians" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "date_of_birth" date NOT NULL, "image_key" character varying(100), "image_url" character varying(100), "license_plate" character varying(10) NOT NULL, "is_available" boolean NOT NULL DEFAULT true, "password" character varying(100) NOT NULL, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_modified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "contact_id" uuid, CONSTRAINT "UQ_4120d429d507984d252ffb5276a" UNIQUE ("license_plate"), CONSTRAINT "REL_024f204d2e8db8c1b526f8edec" UNIQUE ("contact_id"), CONSTRAINT "PK_b14514b23605f79475be53065b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_c0c710fa8182fe57bf0fd9d6104" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_47c4c31c3cd815d2d8f357ff84f" FOREIGN KEY ("technicianId") REFERENCES "technicians"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_33b58dec36433e445e69354144d" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_e5de51ca888d8b1f5ac25799dd1" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_1de74120eac3dfddb4b8e8f6a9b" FOREIGN KEY ("technicianId") REFERENCES "technicians"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_b0d2ae520491ea31df08cb06b1b" FOREIGN KEY ("problemTypeId") REFERENCES "problem_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_09d63a05d7c982ab61afc64f79f" FOREIGN KEY ("acTypeId") REFERENCES "ac_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_08820a9b89f50740562432272b2" FOREIGN KEY ("buildingTypeId") REFERENCES "building_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD CONSTRAINT "FK_024f204d2e8db8c1b526f8edec2" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technicians" DROP CONSTRAINT "FK_024f204d2e8db8c1b526f8edec2"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_08820a9b89f50740562432272b2"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_09d63a05d7c982ab61afc64f79f"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_b0d2ae520491ea31df08cb06b1b"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_1de74120eac3dfddb4b8e8f6a9b"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_e5de51ca888d8b1f5ac25799dd1"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_33b58dec36433e445e69354144d"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_47c4c31c3cd815d2d8f357ff84f"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_c0c710fa8182fe57bf0fd9d6104"`);
        await queryRunner.query(`DROP TABLE "technicians"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "problem_types"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "building_types"`);
        await queryRunner.query(`DROP TABLE "ac_types"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
    }

}
