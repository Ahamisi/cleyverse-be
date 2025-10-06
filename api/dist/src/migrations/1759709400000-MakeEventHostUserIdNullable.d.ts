import { MigrationInterface, QueryRunner } from "typeorm";
export declare class MakeEventHostUserIdNullable1759709400000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
