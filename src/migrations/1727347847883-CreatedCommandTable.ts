import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatedCommandTable1727347847883 implements MigrationInterface {
  name = 'CreatedCommandTable1727347847883';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comments_revisions" ("commentId" integer NOT NULL, "revisionId" integer NOT NULL, CONSTRAINT "PK_a6b603ecc555c45b83bb364f594" PRIMARY KEY ("commentId", "revisionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4ca1ca5939ca41d507f3eba680" ON "comments_revisions" ("commentId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_68c731636e18232a2519b06335" ON "comments_revisions" ("revisionId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "comments_revisions" ADD CONSTRAINT "FK_4ca1ca5939ca41d507f3eba680c" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments_revisions" ADD CONSTRAINT "FK_68c731636e18232a2519b063352" FOREIGN KEY ("revisionId") REFERENCES "revision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments_revisions" DROP CONSTRAINT "FK_68c731636e18232a2519b063352"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments_revisions" DROP CONSTRAINT "FK_4ca1ca5939ca41d507f3eba680c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_68c731636e18232a2519b06335"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4ca1ca5939ca41d507f3eba680"`,
    );
    await queryRunner.query(`DROP TABLE "comments_revisions"`);
    await queryRunner.query(`DROP TABLE "comment"`);
  }
}
