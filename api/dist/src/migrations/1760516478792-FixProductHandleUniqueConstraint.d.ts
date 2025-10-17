import { MigrationInterface, QueryRunner } from "typeorm";
export declare class FixProductHandleUniqueConstraint1760516478792 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
