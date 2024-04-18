import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1713416298472 implements MigrationInterface {
    name = 'Migration1713416298472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "technicians" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" text NOT NULL, "last_name" text NOT NULL, "full_name" text NOT NULL, "phone_number" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "created_at" text NOT NULL DEFAULT now(), CONSTRAINT "UQ_4fe49df021fe3221620e0a2ed15" UNIQUE ("phone_number"), CONSTRAINT "UQ_b503f29dfad15b0481843cf2b4a" UNIQUE ("email"), CONSTRAINT "PK_b14514b23605f79475be53065b3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "technicians"`);
    }

}
