"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeEventHostUserIdNullable1759709400000 = void 0;
class MakeEventHostUserIdNullable1759709400000 {
    name = 'MakeEventHostUserIdNullable1759709400000';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "event_hosts" ALTER COLUMN "user_id" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "event_hosts" ALTER COLUMN "user_id" SET NOT NULL`);
    }
}
exports.MakeEventHostUserIdNullable1759709400000 = MakeEventHostUserIdNullable1759709400000;
//# sourceMappingURL=1759709400000-MakeEventHostUserIdNullable.js.map