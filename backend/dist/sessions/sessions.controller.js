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
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SessionsService } from './sessions.service.js';
import { CreateSessionDto } from './sessions.dto.js';
let SessionsController = class SessionsController {
    sessionsService;
    constructor(sessionsService) {
        this.sessionsService = sessionsService;
    }
    async createSession(dto) {
        const data = await this.sessionsService.createSession(dto);
        return { message: 'Session created successfully', data };
    }
    async getSessions() {
        const data = await this.sessionsService.getSessions();
        return { data };
    }
    async getSessionModules(sessionId) {
        const data = await this.sessionsService.getSessionModules(sessionId);
        return { data };
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSessionDto]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "createSession", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "getSessions", null);
__decorate([
    Get(':sessionId/modules'),
    __param(0, Param('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "getSessionModules", null);
SessionsController = __decorate([
    Controller('sessions'),
    __metadata("design:paramtypes", [SessionsService])
], SessionsController);
export { SessionsController };
//# sourceMappingURL=sessions.controller.js.map