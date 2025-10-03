import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFormFieldTypeEnum1759476608788 implements MigrationInterface {
    name = 'UpdateFormFieldTypeEnum1759476608788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new enum values to form_fields_type_enum
        await queryRunner.query(`ALTER TYPE "form_fields_type_enum" ADD VALUE 'textarea'`);
        await queryRunner.query(`ALTER TYPE "form_fields_type_enum" ADD VALUE 'multiple_choice'`);
        
        // Update email_verifications default
        await queryRunner.query(`ALTER TABLE "email_verifications" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Note: PostgreSQL doesn't support removing enum values directly
        // This would require recreating the enum type, which is complex
        // For now, we'll just revert the email_verifications change
        await queryRunner.query(`ALTER TABLE "email_verifications" ALTER COLUMN "expires_at" SET DEFAULT (now() + '24:00:00')`);
    }

}
