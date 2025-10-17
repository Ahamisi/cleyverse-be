import { MigrationInterface, QueryRunner } from "typeorm";

export class MakePasswordNullable1760060000000 implements MigrationInterface {
    name = 'MakePasswordNullable1760060000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
    }
}
