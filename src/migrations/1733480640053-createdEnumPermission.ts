import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedEnumPermission1733480640053 implements MigrationInterface {
    name = 'CreatedEnumPermission1733480640053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant" ADD "ownerId" integer`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD CONSTRAINT "FK_feb05384c4e856435ed00355df3" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant" DROP CONSTRAINT "FK_feb05384c4e856435ed00355df3"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "ownerId"`);
    }

}
