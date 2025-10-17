"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProfileImageGradientToUsers1760065000000 = void 0;
class AddProfileImageGradientToUsers1760065000000 {
    name = 'AddProfileImageGradientToUsers1760065000000';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "profile_image_gradient" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_image_gradient"`);
    }
}
exports.AddProfileImageGradientToUsers1760065000000 = AddProfileImageGradientToUsers1760065000000;
//# sourceMappingURL=1760065000000-AddProfileImageGradientToUsers.js.map