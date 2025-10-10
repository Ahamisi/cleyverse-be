"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddEventContextToForms1760055000000 = void 0;
class AddEventContextToForms1760055000000 {
    name = 'AddEventContextToForms1760055000000';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "forms" ADD "event_context" jsonb`);
        await queryRunner.query(`ALTER TYPE "public"."forms_type_enum" ADD VALUE 'event_registration'`);
        await queryRunner.query(`ALTER TYPE "public"."forms_type_enum" ADD VALUE 'vendor_application'`);
        await queryRunner.query(`ALTER TYPE "public"."forms_type_enum" ADD VALUE 'guest_registration'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "forms" DROP COLUMN "event_context"`);
    }
}
exports.AddEventContextToForms1760055000000 = AddEventContextToForms1760055000000;
//# sourceMappingURL=1760055000000-AddEventContextToForms.js.map