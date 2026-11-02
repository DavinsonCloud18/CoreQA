import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ExecutionService } from './execution.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('ExecutionService', () => {
  let service: ExecutionService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue({ id: 'user-1', role: { name: 'QA Member' } }),
      },
      session: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      status: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
      },
      masterTestcase: {
        findUnique: vi.fn(),
      },
      claimHistory: {
        findFirst: vi.fn(),
        updateMany: vi.fn(),
        create: vi.fn(),
      },
      sessionExecution: {
        upsert: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        findMany: vi.fn(),
      },
      sessionStepExecution: {
        upsert: vi.fn(),
        findMany: vi.fn(),
      },
      $transaction: vi.fn((cb: any) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExecutionService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ExecutionService>(ExecutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateExecutionStatus - PASSED WITH NOTES validation', () => {
    const sessionId = 'session-1';
    const testcaseId = 'tc-1';
    const userId = 'user-1';

    beforeEach(() => {
      // Mock session active and open
      prisma.session.findUnique.mockResolvedValue({ id: sessionId, status: 'On Progress', isOpen: true });
      // Mock valid claim
      prisma.masterTestcase.findUnique.mockResolvedValue({ id: testcaseId, moduleId: 'mod-1', steps: [] });
      prisma.claimHistory.findFirst.mockResolvedValue({ sessionId, moduleId: 'mod-1', claimedById: userId, isActive: true });
      prisma.sessionExecution.findMany.mockResolvedValue([]);
    });

    it('should throw BadRequestException when status is PASSED WITH NOTES and notes is empty string', async () => {
      prisma.status.findUnique.mockResolvedValue({ id: 3, name: 'PASSED WITH NOTES' });

      await expect(
        service.updateExecutionStatus(sessionId, testcaseId, userId, { statusId: 3, notes: '' })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when status is PASSED WITH NOTES and notes is whitespace only', async () => {
      prisma.status.findUnique.mockResolvedValue({ id: 3, name: 'PASSED WITH NOTES' });

      await expect(
        service.updateExecutionStatus(sessionId, testcaseId, userId, { statusId: 3, notes: '   ' })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when status is PASSED WITH NOTES and notes is undefined', async () => {
      prisma.status.findUnique.mockResolvedValue({ id: 3, name: 'PASSED WITH NOTES' });

      await expect(
        service.updateExecutionStatus(sessionId, testcaseId, userId, { statusId: 3 })
      ).rejects.toThrow(BadRequestException);
    });

    it('should succeed when status is PASSED WITH NOTES and notes has valid reason', async () => {
      prisma.status.findUnique.mockResolvedValue({ id: 3, name: 'PASSED WITH NOTES' });
      prisma.sessionExecution.upsert.mockResolvedValue({ id: 'exec-1', statusId: 3, notes: 'Button is misaligned' });

      const result = await service.updateExecutionStatus(sessionId, testcaseId, userId, { 
        statusId: 3, 
        notes: 'Button is misaligned' 
      });

      expect(prisma.sessionExecution.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({ notes: 'Button is misaligned' }),
          create: expect.objectContaining({ notes: 'Button is misaligned' }),
        })
      );
      expect(result).toBeDefined();
    });

    it('should NOT require notes when status is PASSED (does not break other statuses)', async () => {
      prisma.status.findUnique.mockResolvedValue({ id: 1, name: 'PASSED' });
      prisma.sessionExecution.upsert.mockResolvedValue({ id: 'exec-1', statusId: 1, notes: null });

      const result = await service.updateExecutionStatus(sessionId, testcaseId, userId, { statusId: 1 });
      expect(result).toBeDefined();
    });

    it('should NOT require notes when status is FAILED (does not break other statuses)', async () => {
      prisma.status.findUnique.mockResolvedValue({ id: 2, name: 'FAILED' });
      prisma.sessionExecution.upsert.mockResolvedValue({ id: 'exec-1', statusId: 2, notes: null });

      const result = await service.updateExecutionStatus(sessionId, testcaseId, userId, { statusId: 2 });
      expect(result).toBeDefined();
    });

    it('should NOT require notes when status is DROPPED (does not break other statuses)', async () => {
      prisma.status.findUnique.mockResolvedValue({ id: 5, name: 'DROPPED' });
      prisma.sessionExecution.upsert.mockResolvedValue({ id: 'exec-1', statusId: 5, notes: null });

      const result = await service.updateExecutionStatus(sessionId, testcaseId, userId, { statusId: 5 });
      expect(result).toBeDefined();
    });
  });

  describe('updateStepExecutionStatus - PASSED WITH NOTES validation', () => {
    const sessionId = 'session-1';
    const testcaseId = 'tc-1';
    const stepId = 'step-1';
    const userId = 'user-1';

    beforeEach(() => {
      prisma.session.findUnique.mockResolvedValue({ id: sessionId, status: 'On Progress', isOpen: true });
      prisma.masterTestcase.findUnique.mockResolvedValue({ id: testcaseId, moduleId: 'mod-1', steps: [] });
      prisma.claimHistory.findFirst.mockResolvedValue({ sessionId, moduleId: 'mod-1', claimedById: userId, isActive: true });
      prisma.sessionExecution.findUnique.mockResolvedValue({ id: 'exec-1' });
      prisma.sessionStepExecution.upsert.mockResolvedValue({ id: 'step-exec-1' });
      prisma.sessionStepExecution.findMany.mockResolvedValue([]);
      prisma.sessionExecution.findMany.mockResolvedValue([]);
    });

    it('should throw BadRequestException when step status is PASSED WITH NOTES and notes is empty', async () => {
      prisma.status.findUnique.mockResolvedValue({ id: 3, name: 'PASSED WITH NOTES' });

      await expect(
        service.updateStepExecutionStatus(sessionId, testcaseId, stepId, userId, { statusId: 3, notes: '' })
      ).rejects.toThrow(BadRequestException);
    });

    it('should succeed when step status is PASSED WITH NOTES and notes is provided', async () => {
      prisma.status.findUnique.mockResolvedValue({ id: 3, name: 'PASSED WITH NOTES' });
      prisma.sessionExecution.update.mockResolvedValue({});

      const result = await service.updateStepExecutionStatus(sessionId, testcaseId, stepId, userId, { 
        statusId: 3, 
        notes: 'Step took too long to load' 
      });

      expect(prisma.sessionStepExecution.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({ notes: 'Step took too long to load' }),
        })
      );
      expect(result).toBeDefined();
    });
  });

  describe('Super Admin restrictions', () => {
    const sessionId = 'session-1';
    const moduleId = 'mod-1';
    const testcaseId = 'tc-1';
    const adminUserId = 'admin-user-id';

    it('should throw BadRequestException when Admin attempts to claim a module', async () => {
      prisma.session.findUnique.mockResolvedValue({ id: sessionId, isOpen: true });
      prisma.user.findUnique.mockResolvedValue({ id: adminUserId, role: { name: 'Admin' } });

      await expect(
        service.claimModule(sessionId, moduleId, adminUserId)
      ).rejects.toThrow('Super Admin tidak dapat melakukan claim module atau testcase.');
    });

    it('should throw BadRequestException when Super Admin attempts to claim a module', async () => {
      prisma.session.findUnique.mockResolvedValue({ id: sessionId, isOpen: true });
      prisma.user.findUnique.mockResolvedValue({ id: adminUserId, role: { name: 'Super Admin' } });

      await expect(
        service.claimModule(sessionId, moduleId, adminUserId)
      ).rejects.toThrow('Super Admin tidak dapat melakukan claim module atau testcase.');
    });

    it('should throw BadRequestException when Admin attempts to execute a testcase', async () => {
      prisma.session.findUnique.mockResolvedValue({ id: sessionId, status: 'On Progress', isOpen: true });
      prisma.user.findUnique.mockResolvedValue({ id: adminUserId, role: { name: 'Admin' } });

      await expect(
        service.updateExecutionStatus(sessionId, testcaseId, adminUserId, { statusId: 1 })
      ).rejects.toThrow('Super Admin tidak dapat melakukan claim atau mengeksekusi testcase.');
    });
  });
});
