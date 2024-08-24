import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724507752713 implements MigrationInterface {
    name = 'Migration1724507752713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "body" text NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "customerId" uuid, "technicianId" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_c0c710fa8182fe57bf0fd9d6104" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_47c4c31c3cd815d2d8f357ff84f" FOREIGN KEY ("technicianId") REFERENCES "technicians"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_47c4c31c3cd815d2d8f357ff84f"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_c0c710fa8182fe57bf0fd9d6104"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
