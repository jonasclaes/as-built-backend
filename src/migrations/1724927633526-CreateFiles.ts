import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFiles1724927633526 implements MigrationInterface {
  name = 'CreateFiles1724927633526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "s3Key" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file_revisions_revision" ("fileId" integer NOT NULL, "revisionId" integer NOT NULL, CONSTRAINT "PK_897d870624f4240131faac3f958" PRIMARY KEY ("fileId", "revisionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cdacfe7c7f985fd3024d82b145" ON "file_revisions_revision" ("fileId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7aa3a54a3b902e8c1a56d33f0d" ON "file_revisions_revision" ("revisionId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "revision_files_file" ("revisionId" integer NOT NULL, "fileId" integer NOT NULL, CONSTRAINT "PK_8188a67ee8ed7d07004e47a2336" PRIMARY KEY ("revisionId", "fileId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f5bb0ee1c9246fe8c3fc43418" ON "revision_files_file" ("revisionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_caf41667898912545a192a0dd2" ON "revision_files_file" ("fileId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "file_revisions_revision" ADD CONSTRAINT "FK_cdacfe7c7f985fd3024d82b1455" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_revisions_revision" ADD CONSTRAINT "FK_7aa3a54a3b902e8c1a56d33f0de" FOREIGN KEY ("revisionId") REFERENCES "revision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "revision_files_file" ADD CONSTRAINT "FK_1f5bb0ee1c9246fe8c3fc434182" FOREIGN KEY ("revisionId") REFERENCES "revision"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "revision_files_file" ADD CONSTRAINT "FK_caf41667898912545a192a0dd22" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "revision_files_file" DROP CONSTRAINT "FK_caf41667898912545a192a0dd22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "revision_files_file" DROP CONSTRAINT "FK_1f5bb0ee1c9246fe8c3fc434182"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_revisions_revision" DROP CONSTRAINT "FK_7aa3a54a3b902e8c1a56d33f0de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_revisions_revision" DROP CONSTRAINT "FK_cdacfe7c7f985fd3024d82b1455"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_caf41667898912545a192a0dd2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1f5bb0ee1c9246fe8c3fc43418"`,
    );
    await queryRunner.query(`DROP TABLE "revision_files_file"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7aa3a54a3b902e8c1a56d33f0d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cdacfe7c7f985fd3024d82b145"`,
    );
    await queryRunner.query(`DROP TABLE "file_revisions_revision"`);
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
