import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileImageGradientToUsers1760065000000 implements MigrationInterface {
    name = 'AddProfileImageGradientToUsers1760065000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "profile_image_gradient" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_image_gradient"`);
    }
}

