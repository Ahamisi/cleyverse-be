"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFormColumnsToEvents1760054600000 = void 0;
class AddFormColumnsToEvents1760054600000 {
    name = 'AddFormColumnsToEvents1760054600000';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "events" ADD "vendor_form_id" uuid`);
        await queryRunner.query(`ALTER TABLE "events" ADD "guest_form_id" uuid`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "guest_form_id"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "vendor_form_id"`);
    }
}
exports.AddFormColumnsToEvents1760054600000 = AddFormColumnsToEvents1760054600000;
//# sourceMappingURL=1760054600000-AddFormColumnsToEvents.js.map