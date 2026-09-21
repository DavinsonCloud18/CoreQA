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
import { Controller, Get, Post, Patch, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ExecutionService } from './execution.service.js';
import { GetTestcasesQueryDto, UpdateExecutionStatusDto } from './execution.dto.js';
let ExecutionController = class ExecutionController {
    executionService;
    constructor(executionService) {
        this.executionService = executionService;
    }
    async getExecutions(sessionId, query) {
        return await this.executionService.getSessionExecutions(sessionId, query);
    }
    async claimModule(sessionId, moduleId, userId) {
        const claim = await this.executionService.claimModule(sessionId, moduleId, userId);
        return { message: 'Module berhasil diklaim', data: claim };
    }
    async updateStatus(sessionId, testcaseId, dto, userId) {
        const result = await this.executionService.updateExecutionStatus(sessionId, testcaseId, userId, dto);
        return { message: 'Status eksekusi berhasil diupdate', data: result };
    }
    async updateStepStatus(sessionId, testcaseId, stepId, dto, userId) {
        const result = await this.executionService.updateStepExecutionStatus(sessionId, testcaseId, stepId, userId, dto);
        return { message: 'Status step berhasil diupdate', data: result };
    }
};
__decorate([
    Get('testcases'),
    __param(0, Param('sessionId')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, GetTestcasesQueryDto]),
    __metadata("design:returntype", Promise)
], ExecutionController.prototype, "getExecutions", null);
__decorate([
    Post('modules/:moduleId/claim'),
    HttpCode(HttpStatus.OK),
    __param(0, Param('sessionId')),
    __param(1, Param('moduleId')),
    __param(2, Body('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ExecutionController.prototype, "claimModule", null);
__decorate([
    Patch('testcases/:testcaseId/status'),
    __param(0, Param('sessionId')),
    __param(1, Param('testcaseId')),
    __param(2, Body()),
    __param(3, Body('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, UpdateExecutionStatusDto, String]),
    __metadata("design:returntype", Promise)
], ExecutionController.prototype, "updateStatus", null);
__decorate([
    Patch('testcases/:testcaseId/steps/:stepId/status'),
    __param(0, Param('sessionId')),
    __param(1, Param('testcaseId')),
    __param(2, Param('stepId')),
    __param(3, Body()),
    __param(4, Body('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, UpdateExecutionStatusDto, String]),
    __metadata("design:returntype", Promise)
], ExecutionController.prototype, "updateStepStatus", null);
ExecutionController = __decorate([
    Controller('sessions/:sessionId'),
    __metadata("design:paramtypes", [ExecutionService])
], ExecutionController);
export { ExecutionController };
//# sourceMappingURL=execution.controller.js.map