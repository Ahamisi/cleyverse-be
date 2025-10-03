"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    migrationsTableName: 'migrations',
});
//# sourceMappingURL=ormconfig.js.map