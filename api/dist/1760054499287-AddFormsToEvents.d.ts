import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddFormsToEvents1760054499287 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
