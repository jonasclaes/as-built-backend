import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProjectClientRelationship1719835461083
  implements MigrationInterface
{
  name = 'UpdateProjectClientRelationship1719835461083';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" ADD "clientId" integer`);
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_816f608a9acf4a4314c9e1e9c66" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_816f608a9acf4a4314c9e1e9c66"`,
    );
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "clientId"`);
  }
}
