"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
            'http://localhost:3004',
            'http://localhost:3005',
            'http://localhost:4000',
            'http://localhost:4001',
            'http://localhost:5000',
            'http://localhost:5001',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:8080',
            'http://localhost:8081',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:8080',
            process.env.FRONTEND_URL || 'http://localhost:3000'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'Cache-Control',
            'Pragma'
        ],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
    }));
    await app.listen(process.env.PORT ?? 3000);
    console.log(`🚀 API Server running on: http://localhost:${process.env.PORT ?? 3000}`);
    console.log(`🌐 CORS enabled for local development`);
}
bootstrap();
//# sourceMappingURL=main.js.map