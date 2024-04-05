import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1712387348147 implements MigrationInterface {
  name = 'Migration1712387348147';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "no_hp" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "full_name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6640e1c148f4c78f05d9709f0c6" UNIQUE ("no_hp"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
