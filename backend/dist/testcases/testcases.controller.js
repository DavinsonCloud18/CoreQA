var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put, Query, Patch } from '@nestjs/common';
import { TestcasesService } from './testcases.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
let TestcasesController = class TestcasesController {
    testcasesService;
    constructor(testcasesService) {
        this.testcasesService = testcasesService;
    }
    async create(req, createTestcaseDto) {
        return { data: await this.testcasesService.create(req.user.id, createTestcaseDto) };
    }
    async findAll(query) {
        return { data: await this.testcasesService.findAll(query) };
    }
    async getNotifications(req) {
        return { data: await this.testcasesService.getNotifications(req.user.id) };
    }
    async markNotificationRead(id) {
        return { data: await this.testcasesService.markNotificationRead(id) };
    }
    async findOne(id) {
        return { data: await this.testcasesService.findOne(id) };
    }
    async update(req, id, updateTestcaseDto) {
        return { data: await this.testcasesService.update(req.user.id, id, updateTestcaseDto) };
    }
    async remove(req, id) {
        return { data: await this.testcasesService.remove(req.user.id, req.user.role, id) };
    }
    async revive(req, id) {
        return { data: await this.testcasesService.revive(req.user.id, id) };
    }
};
__decorate([
    Post(),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TestcasesController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestcasesController.prototype, "findAll", null);
__decorate([
    Get('notifications'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestcasesController.prototype, "getNotifications", null);
__decorate([
    Patch('notifications/:id/read'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestcasesController.prototype, "markNotificationRead", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestcasesController.prototype, "findOne", null);
__decorate([
    Put(':id'),
    __param(0, Request()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TestcasesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Request()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TestcasesController.prototype, "remove", null);
__decorate([
    Post(':id/revive'),
    __param(0, Request()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TestcasesController.prototype, "revive", null);
TestcasesController = __decorate([
    Controller('testcases'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [TestcasesService])
], TestcasesController);
export { TestcasesController };
//# sourceMappingURL=testcases.controller.js.map