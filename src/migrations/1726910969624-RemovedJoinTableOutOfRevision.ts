import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedJoinTableOutOfRevision1726910969624 implements MigrationInterface {
    name = 'RemovedJoinTableOutOfRevision1726910969624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file_revisions" ("fileId" integer NOT NULL, "revisionId" integer NOT NULL, CONSTRAINT "PK_89d417f8ab3d5856f325a463393" PRIMARY KEY ("fileId", "revisionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6c8b723fa43ae5a6a81ea4d616" ON "file_revisions" ("fileId") `);
        await queryRunner.query(`CREATE INDEX "IDX_815ad9ecd6d7e2ec005ac5e21b" ON "file_revisions" ("revisionId") `);
        await queryRunner.query(`ALTER TABLE "file_revisions" ADD CONSTRAINT "FK_6c8b723fa43ae5a6a81ea4d616b" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "file_revisions" ADD CONSTRAINT "FK_815ad9ecd6d7e2ec005ac5e21b5" FOREIGN KEY ("revisionId") REFERENCES "revision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_revisions" DROP CONSTRAINT "FK_815ad9ecd6d7e2ec005ac5e21b5"`);
        await queryRunner.query(`ALTER TABLE "file_revisions" DROP CONSTRAINT "FK_6c8b723fa43ae5a6a81ea4d616b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_815ad9ecd6d7e2ec005ac5e21b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6c8b723fa43ae5a6a81ea4d616"`);
        await queryRunner.query(`DROP TABLE "file_revisions"`);
    }

}
