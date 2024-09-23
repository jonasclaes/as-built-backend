import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamedManyToManyTable1727079925680 implements MigrationInterface {
  name = 'RenamedManyToManyTable1727079925680';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "files_revisions" ("fileId" integer NOT NULL, "revisionId" integer NOT NULL, CONSTRAINT "PK_d9d56fb1c90de319b3e4f368cdf" PRIMARY KEY ("fileId", "revisionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d5fffd080ffde1afa91cf772d0" ON "files_revisions" ("fileId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_75fc7ca85003ba956d81bfa4b4" ON "files_revisions" ("revisionId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "files_revisions" ADD CONSTRAINT "FK_d5fffd080ffde1afa91cf772d08" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "files_revisions" ADD CONSTRAINT "FK_75fc7ca85003ba956d81bfa4b49" FOREIGN KEY ("revisionId") REFERENCES "revision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files_revisions" DROP CONSTRAINT "FK_75fc7ca85003ba956d81bfa4b49"`,
    );
    await queryRunner.query(
      `ALTER TABLE "files_revisions" DROP CONSTRAINT "FK_d5fffd080ffde1afa91cf772d08"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_75fc7ca85003ba956d81bfa4b4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d5fffd080ffde1afa91cf772d0"`,
    );
    await queryRunner.query(`DROP TABLE "files_revisions"`);
  }
}
