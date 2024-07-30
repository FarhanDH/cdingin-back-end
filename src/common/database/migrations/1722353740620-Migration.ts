import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722353740620 implements MigrationInterface {
    name = 'Migration1722353740620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technicians" DROP CONSTRAINT "FK_cdaf03dffafa4a20a49c00b2bf0"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_6440bebb7c65d3b57b81ce23195"`);
        await queryRunner.query(`ALTER TABLE "technicians" RENAME COLUMN "contactId" TO "contact_id"`);
        await queryRunner.query(`ALTER TABLE "technicians" RENAME CONSTRAINT "UQ_cdaf03dffafa4a20a49c00b2bf0" TO "UQ_024f204d2e8db8c1b526f8edec2"`);
        await queryRunner.query(`ALTER TABLE "customers" RENAME COLUMN "contactId" TO "contact_id"`);
        await queryRunner.query(`ALTER TABLE "customers" RENAME CONSTRAINT "UQ_6440bebb7c65d3b57b81ce23195" TO "UQ_33b58dec36433e445e69354144d"`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD CONSTRAINT "FK_024f204d2e8db8c1b526f8edec2" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_33b58dec36433e445e69354144d" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_33b58dec36433e445e69354144d"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP CONSTRAINT "FK_024f204d2e8db8c1b526f8edec2"`);
        await queryRunner.query(`ALTER TABLE "customers" RENAME CONSTRAINT "UQ_33b58dec36433e445e69354144d" TO "UQ_6440bebb7c65d3b57b81ce23195"`);
        await queryRunner.query(`ALTER TABLE "customers" RENAME COLUMN "contact_id" TO "contactId"`);
        await queryRunner.query(`ALTER TABLE "technicians" RENAME CONSTRAINT "UQ_024f204d2e8db8c1b526f8edec2" TO "UQ_cdaf03dffafa4a20a49c00b2bf0"`);
        await queryRunner.query(`ALTER TABLE "technicians" RENAME COLUMN "contact_id" TO "contactId"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_6440bebb7c65d3b57b81ce23195" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD CONSTRAINT "FK_cdaf03dffafa4a20a49c00b2bf0" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
