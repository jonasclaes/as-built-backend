import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedPermissionsTable1733305203680 implements MigrationInterface {
    name = 'CreatedPermissionsTable1733305203680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" integer, "tenantId" integer, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_eab26c6cc4b9cc604099bc32dff" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_866cc84ac2cdb0c362b4eb7ce3f" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_866cc84ac2cdb0c362b4eb7ce3f"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_eab26c6cc4b9cc604099bc32dff"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
