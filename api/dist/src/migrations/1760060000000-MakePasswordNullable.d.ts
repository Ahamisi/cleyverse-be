import { MigrationInterface, QueryRunner } from "typeorm";
export declare class MakePasswordNullable1760060000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
