import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFormColumnsToEvents1760054600000 implements MigrationInterface {
    name = 'AddFormColumnsToEvents1760054600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "vendor_form_id" uuid`);
        await queryRunner.query(`ALTER TABLE "events" ADD "guest_form_id" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "guest_form_id"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "vendor_form_id"`);
    }
}
