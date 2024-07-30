import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722343743734 implements MigrationInterface {
    name = 'Migration1722343743734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contacts" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP COLUMN "user_type"`);
        await queryRunner.query(`DROP TYPE "public"."contacts_user_type_enum"`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD "contactId" uuid`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD CONSTRAINT "UQ_cdaf03dffafa4a20a49c00b2bf0" UNIQUE ("contactId")`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "contactId" uuid`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "UQ_6440bebb7c65d3b57b81ce23195" UNIQUE ("contactId")`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "UQ_84cae51c485079bdd8cdf1d828f" UNIQUE ("phone")`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "UQ_752866c5247ddd34fd05559537d" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD CONSTRAINT "FK_cdaf03dffafa4a20a49c00b2bf0" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_6440bebb7c65d3b57b81ce23195" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_6440bebb7c65d3b57b81ce23195"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP CONSTRAINT "FK_cdaf03dffafa4a20a49c00b2bf0"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "UQ_752866c5247ddd34fd05559537d"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "UQ_84cae51c485079bdd8cdf1d828f"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "UQ_6440bebb7c65d3b57b81ce23195"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "contactId"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP CONSTRAINT "UQ_cdaf03dffafa4a20a49c00b2bf0"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP COLUMN "contactId"`);
        await queryRunner.query(`CREATE TYPE "public"."contacts_user_type_enum" AS ENUM('customer', 'technician')`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD "user_type" "public"."contacts_user_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD "user_id" uuid NOT NULL`);
    }

}
