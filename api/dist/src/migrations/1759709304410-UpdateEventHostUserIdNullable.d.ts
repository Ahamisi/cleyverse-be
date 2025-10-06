import { MigrationInterface, QueryRunner } from "typeorm";
export declare class UpdateEventHostUserIdNullable1759709304410 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
