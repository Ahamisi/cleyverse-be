"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakePasswordNullable1760060000000 = void 0;
class MakePasswordNullable1760060000000 {
    name = 'MakePasswordNullable1760060000000';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
    }
}
exports.MakePasswordNullable1760060000000 = MakePasswordNullable1760060000000;
//# sourceMappingURL=1760060000000-MakePasswordNullable.js.map