import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1723174374854 implements MigrationInterface {
    name = 'Migration1723174374854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technicians" ADD CONSTRAINT "UQ_4120d429d507984d252ffb5276a" UNIQUE ("license_plate")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technicians" DROP CONSTRAINT "UQ_4120d429d507984d252ffb5276a"`);
    }

}
