import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1723171230730 implements MigrationInterface {
    name = 'Migration1723171230730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technicians" DROP CONSTRAINT "FK_024f204d2e8db8c1b526f8edec2"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_33b58dec36433e445e69354144d"`);
        await queryRunner.query(`ALTER TABLE "technicians" ALTER COLUMN "license_plate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD CONSTRAINT "FK_024f204d2e8db8c1b526f8edec2" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_33b58dec36433e445e69354144d" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_33b58dec36433e445e69354144d"`);
        await queryRunner.query(`ALTER TABLE "technicians" DROP CONSTRAINT "FK_024f204d2e8db8c1b526f8edec2"`);
        await queryRunner.query(`ALTER TABLE "technicians" ALTER COLUMN "license_plate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_33b58dec36433e445e69354144d" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "technicians" ADD CONSTRAINT "FK_024f204d2e8db8c1b526f8edec2" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
