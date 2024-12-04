import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedManyToManyRelation1733301602995 implements MigrationInterface {
    name = 'CreatedManyToManyRelation1733301602995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tenants_users" ("tenantId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_07030d3820e6e1c99da70cdbd8d" PRIMARY KEY ("tenantId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_33fc0a3b0b438602c4bb5f53b0" ON "tenants_users" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_56b6a9344f493804a9cecaf0e8" ON "tenants_users" ("userId") `);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "ownerUid" character varying`);
        await queryRunner.query(`ALTER TABLE "tenants_users" ADD CONSTRAINT "FK_33fc0a3b0b438602c4bb5f53b0b" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tenants_users" ADD CONSTRAINT "FK_56b6a9344f493804a9cecaf0e87" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenants_users" DROP CONSTRAINT "FK_56b6a9344f493804a9cecaf0e87"`);
        await queryRunner.query(`ALTER TABLE "tenants_users" DROP CONSTRAINT "FK_33fc0a3b0b438602c4bb5f53b0b"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "ownerUid"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_56b6a9344f493804a9cecaf0e8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33fc0a3b0b438602c4bb5f53b0"`);
        await queryRunner.query(`DROP TABLE "tenants_users"`);
    }

}
