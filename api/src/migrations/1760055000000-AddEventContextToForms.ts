import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventContextToForms1760055000000 implements MigrationInterface {
    name = 'AddEventContextToForms1760055000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forms" ADD "event_context" jsonb`);
        await queryRunner.query(`ALTER TYPE "public"."forms_type_enum" ADD VALUE 'event_registration'`);
        await queryRunner.query(`ALTER TYPE "public"."forms_type_enum" ADD VALUE 'vendor_application'`);
        await queryRunner.query(`ALTER TYPE "public"."forms_type_enum" ADD VALUE 'guest_registration'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forms" DROP COLUMN "event_context"`);
        // Note: PostgreSQL doesn't support removing enum values, so we leave them
    }
}
