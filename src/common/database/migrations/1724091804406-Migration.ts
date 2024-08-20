import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724091804406 implements MigrationInterface {
    name = 'Migration1724091804406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'taken', 'to_location', 'in_progress', 'completed')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_latitude" numeric(9,6) NOT NULL, "customer_longitude" numeric(9,6) NOT NULL, "detail_location" character varying(255), "number_of_units" integer NOT NULL, "building_floor_location" character varying(2) NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending', "date_service" date NOT NULL, "total_price" numeric(10,2), "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_modified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "customerId" uuid, "technicianId" uuid, "problemTypeId" integer, "acTypeId" integer, "buildingTypeId" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_e5de51ca888d8b1f5ac25799dd1" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_1de74120eac3dfddb4b8e8f6a9b" FOREIGN KEY ("technicianId") REFERENCES "technicians"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_b0d2ae520491ea31df08cb06b1b" FOREIGN KEY ("problemTypeId") REFERENCES "problem_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_09d63a05d7c982ab61afc64f79f" FOREIGN KEY ("acTypeId") REFERENCES "ac_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_08820a9b89f50740562432272b2" FOREIGN KEY ("buildingTypeId") REFERENCES "building_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_08820a9b89f50740562432272b2"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_09d63a05d7c982ab61afc64f79f"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_b0d2ae520491ea31df08cb06b1b"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_1de74120eac3dfddb4b8e8f6a9b"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_e5de51ca888d8b1f5ac25799dd1"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    }

}
