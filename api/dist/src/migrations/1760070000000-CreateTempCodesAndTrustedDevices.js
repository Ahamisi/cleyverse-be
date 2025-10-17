"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTempCodesAndTrustedDevices1760070000000 = void 0;
class CreateTempCodesAndTrustedDevices1760070000000 {
    name = 'CreateTempCodesAndTrustedDevices1760070000000';
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TYPE "public"."temp_codes_reason_enum" AS ENUM('new_device', 'forgot_password', 'onboarding')
        `);
        await queryRunner.query(`
            CREATE TABLE "temp_codes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "code" character varying(6) NOT NULL,
                "reason" "public"."temp_codes_reason_enum" NOT NULL,
                "expires_at" TIMESTAMP NOT NULL,
                "is_used" boolean NOT NULL DEFAULT false,
                "used_at" TIMESTAMP,
                "attempts" integer NOT NULL DEFAULT 0,
                "ip_address" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_temp_codes" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_temp_codes_user_id" ON "temp_codes" ("user_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_temp_codes_code" ON "temp_codes" ("code")
        `);
        await queryRunner.query(`
            CREATE TABLE "trusted_devices" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "device_fingerprint" character varying NOT NULL,
                "device_name" character varying,
                "device_type" character varying,
                "browser" character varying,
                "os" character varying,
                "ip_address" character varying,
                "last_used_at" TIMESTAMP NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_trusted_devices" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_trusted_devices_user_id" ON "trusted_devices" ("user_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_trusted_devices_fingerprint" ON "trusted_devices" ("device_fingerprint")
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_trusted_devices_user_fingerprint" ON "trusted_devices" ("user_id", "device_fingerprint")
        `);
        await queryRunner.query(`
            ALTER TABLE "temp_codes" ADD CONSTRAINT "FK_temp_codes_user" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "trusted_devices" ADD CONSTRAINT "FK_trusted_devices_user" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "trusted_devices" DROP CONSTRAINT "FK_trusted_devices_user"`);
        await queryRunner.query(`ALTER TABLE "temp_codes" DROP CONSTRAINT "FK_temp_codes_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_trusted_devices_user_fingerprint"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_trusted_devices_fingerprint"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_trusted_devices_user_id"`);
        await queryRunner.query(`DROP TABLE "trusted_devices"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_temp_codes_code"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_temp_codes_user_id"`);
        await queryRunner.query(`DROP TABLE "temp_codes"`);
        await queryRunner.query(`DROP TYPE "public"."temp_codes_reason_enum"`);
    }
}
exports.CreateTempCodesAndTrustedDevices1760070000000 = CreateTempCodesAndTrustedDevices1760070000000;
//# sourceMappingURL=1760070000000-CreateTempCodesAndTrustedDevices.js.map