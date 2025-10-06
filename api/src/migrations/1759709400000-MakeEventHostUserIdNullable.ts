import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeEventHostUserIdNullable1759709400000 implements MigrationInterface {
    name = 'MakeEventHostUserIdNullable1759709400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_hosts" ALTER COLUMN "user_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_hosts" ALTER COLUMN "user_id" SET NOT NULL`);
    }
}
