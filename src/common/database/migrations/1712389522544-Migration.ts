import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1712389522544 implements MigrationInterface {
  name = 'Migration1712389522544';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "password" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "password"`);
  }
}
