import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1723553421930 implements MigrationInterface {
    name = 'Migration1723553421930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "building_types" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_modified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_59a1db89ebd081596fd861f7ace" UNIQUE ("name"), CONSTRAINT "PK_7fe9b63a2e5a344c346511dc198" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "building_types"`);
    }

}
