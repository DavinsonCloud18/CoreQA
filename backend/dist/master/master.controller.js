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
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { MasterService } from './master.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
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
    async createStatus(data) {
        const result = await this.masterService.createStatus(data);
        return { data: result };
    }
    async updateStatus(id, data) {
        const result = await this.masterService.updateStatus(Number(id), data);
        return { data: result };
    }
    async deleteStatus(id) {
        const result = await this.masterService.deleteStatus(Number(id));
        return { data: result };
    }
    async getModules() {
        const data = await this.masterService.getModules();
        return { data };
    }
    async getUsers() {
        const data = await this.masterService.getUsers();
        return { data };
    }
    async createUser(data, req) {
        if (req.user.roleName === 'Leader') {
            const roles = await this.masterService.getRoles();
            const qaRole = roles.find((r) => r.name === 'QA Member');
            if (!qaRole || Number(data.roleId) !== qaRole.id) {
                throw new ForbiddenException('Leaders can only create QA Member');
            }
        }
        const result = await this.masterService.createUser(data);
        return { data: result };
    }
    async updateUser(id, data, req) {
        let allowedData = data;
        if (req.user.roleName === 'Leader') {
            const targetRole = await this.masterService.getUserRole(id);
            if (targetRole !== 'QA Member') {
                throw new ForbiddenException('Leaders can only edit QA Member');
            }
            allowedData = { isActive: data.isActive };
        }
        const result = await this.masterService.updateUser(id, allowedData);
        return { data: result };
    }
    async deleteUser(id, req) {
        if (req.user.roleName === 'Leader') {
            const targetRole = await this.masterService.getUserRole(id);
            if (targetRole !== 'QA Member') {
                throw new ForbiddenException('Leaders can only delete QA Member');
            }
        }
        const result = await this.masterService.deleteUser(id);
        return { data: result };
    }
    async getRoles() {
        const data = await this.masterService.getRoles();
        return { data };
    }
    async createRole(data) {
        const result = await this.masterService.createRole(data);
        return { data: result };
    }
    async updateRole(id, data) {
        const result = await this.masterService.updateRole(Number(id), data);
        return { data: result };
    }
    async deleteRole(id) {
        const result = await this.masterService.deleteRole(Number(id));
        return { data: result };
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
    Roles('Admin'),
    Post('statuses'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "createStatus", null);
__decorate([
    Roles('Admin'),
    Put('statuses/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "updateStatus", null);
__decorate([
    Roles('Admin'),
    Delete('statuses/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "deleteStatus", null);
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
__decorate([
    Roles('Admin', 'Leader'),
    Post('users'),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "createUser", null);
__decorate([
    Roles('Admin', 'Leader'),
    Put('users/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "updateUser", null);
__decorate([
    Roles('Admin', 'Leader'),
    Delete('users/:id'),
    __param(0, Param('id')),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "deleteUser", null);
__decorate([
    Get('roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "getRoles", null);
__decorate([
    Roles('Admin'),
    Post('roles'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "createRole", null);
__decorate([
    Roles('Admin'),
    Put('roles/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "updateRole", null);
__decorate([
    Roles('Admin'),
    Delete('roles/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "deleteRole", null);
MasterController = __decorate([
    Controller('master'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [MasterService])
], MasterController);
export { MasterController };
//# sourceMappingURL=master.controller.js.map