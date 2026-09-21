var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Get } from '@nestjs/common';
import { MasterService } from './master.service.js';
let MasterController = class MasterController {
    masterService;
    constructor(masterService) {
        this.masterService = masterService;
    }
    async getEnvironments() {
        const data = await this.masterService.getEnvironments();
        return { data };
    }
    async getStatuses() {
        const data = await this.masterService.getStatuses();
        return { data };
    }
    async getModules() {
        const data = await this.masterService.getModules();
        return { data };
    }
    async getUsers() {
        const data = await this.masterService.getUsers();
        return { data };
    }
};
__decorate([
    Get('environments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "getEnvironments", null);
__decorate([
    Get('statuses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "getStatuses", null);
__decorate([
    Get('modules'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "getModules", null);
__decorate([
    Get('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "getUsers", null);
MasterController = __decorate([
    Controller('master'),
    __metadata("design:paramtypes", [MasterService])
], MasterController);
export { MasterController };
//# sourceMappingURL=master.controller.js.map