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
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ForbiddenException, Put, Query } from '@nestjs/common';
import { ModulesService } from './modules.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
let ModulesController = class ModulesController {
    modulesService;
    constructor(modulesService) {
        this.modulesService = modulesService;
    }
    async create(req, createModuleDto) {
        if (req.user.role === 'QA Member')
            throw new ForbiddenException('Only Admin or Leader can create modules');
        return { data: await this.modulesService.create(createModuleDto) };
    }
    async findAll(page, limit, search) {
        const query = {
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 50,
            search
        };
        const result = await this.modulesService.findAll(query);
        return { data: result.data, metadata: result.metadata };
    }
    async findOne(id) {
        return { data: await this.modulesService.findOne(id) };
    }
    async update(req, id, updateModuleDto) {
        if (req.user.role === 'QA Member')
            throw new ForbiddenException('Only Admin or Leader can update modules');
        return { data: await this.modulesService.update(id, updateModuleDto) };
    }
    async remove(req, id) {
        if (req.user.role === 'QA Member')
            throw new ForbiddenException('Only Admin or Leader can delete modules');
        return { data: await this.modulesService.remove(id) };
    }
};
__decorate([
    Post(),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __param(2, Query('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "findOne", null);
__decorate([
    Put(':id'),
    __param(0, Request()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Request()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "remove", null);
ModulesController = __decorate([
    Controller('modules'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [ModulesService])
], ModulesController);
export { ModulesController };
//# sourceMappingURL=modules.controller.js.map