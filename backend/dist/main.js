"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, express_1.json)({ limit: '20mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '20mb' }));
    const rawOrigin = process.env.FRONTEND_ORIGIN;
    const allowedOrigins = rawOrigin
        ? rawOrigin.split(',').map((o) => o.trim().replace(/\/$/, ''))
        : ['http://localhost:3000'];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (!rawOrigin ||
                rawOrigin === '*' ||
                allowedOrigins.includes(origin) ||
                origin.endsWith('.vercel.app')) {
                return callback(null, true);
            }
            return callback(null, true);
        },
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const port = Number(process.env.PORT) || 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`Backend is running on http://0.0.0.0:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map