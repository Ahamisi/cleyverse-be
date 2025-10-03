"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFormFieldTypeEnum1759476608788 = void 0;
class UpdateFormFieldTypeEnum1759476608788 {
    name = 'UpdateFormFieldTypeEnum1759476608788';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TYPE "form_fields_type_enum" ADD VALUE 'textarea'`);
        await queryRunner.query(`ALTER TYPE "form_fields_type_enum" ADD VALUE 'multiple_choice'`);
        await queryRunner.query(`ALTER TABLE "email_verifications" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "email_verifications" ALTER COLUMN "expires_at" SET DEFAULT (now() + '24:00:00')`);
    }
}
exports.UpdateFormFieldTypeEnum1759476608788 = UpdateFormFieldTypeEnum1759476608788;
//# sourceMappingURL=1759476608788-UpdateFormFieldTypeEnum.js.map