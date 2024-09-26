import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatedFileTableAndRelations1727245857047
  implements MigrationInterface
{
  name = 'CreatedFileTableAndRelations1727245857047';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
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
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
