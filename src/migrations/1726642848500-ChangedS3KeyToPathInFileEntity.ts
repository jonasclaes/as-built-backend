import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedS3KeyToPathInFileEntity1726642848500 implements MigrationInterface {
    name = 'ChangedS3KeyToPathInFileEntity1726642848500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" RENAME COLUMN "s3Key" TO "path"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" RENAME COLUMN "path" TO "s3Key"`);
    }

}
