import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRevisionTableAndRelations1722848855395
  implements MigrationInterface
{
  name = 'CreateRevisionTableAndRelations1722848855395';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "revision" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "projectId" integer, CONSTRAINT "PK_f4767cdf0c0e78041514e5a94be" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "revision" ADD CONSTRAINT "FK_1b093c5fe3785d7aec280680e09" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "revision" DROP CONSTRAINT "FK_1b093c5fe3785d7aec280680e09"`,
    );
    await queryRunner.query(`DROP TABLE "revision"`);
  }
}
