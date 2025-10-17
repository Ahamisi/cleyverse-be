import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateTempCodesAndTrustedDevices1760070000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
