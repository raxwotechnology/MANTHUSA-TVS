"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDrivesModule = void 0;
const common_1 = require("@nestjs/common");
const test_drives_controller_1 = require("./test-drives.controller");
const test_drives_service_1 = require("./test-drives.service");
const mongoose_1 = require("@nestjs/mongoose");
const test_drive_schema_1 = require("./schemas/test-drive.schema");
let TestDrivesModule = class TestDrivesModule {
};
exports.TestDrivesModule = TestDrivesModule;
exports.TestDrivesModule = TestDrivesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'TestDrive', schema: test_drive_schema_1.TestDriveSchema }])],
        controllers: [test_drives_controller_1.TestDrivesController],
        providers: [test_drives_service_1.TestDrivesService]
    })
], TestDrivesModule);
//# sourceMappingURL=test-drives.module.js.map