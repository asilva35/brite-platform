import { describe, it, expect } from 'vitest';
import { canTransition } from './transitions';
import { OrderStatus, UserRole } from '@prisma/client';

describe('Workflow State Machine', () => {
    it('should allow a PM to move from QUOTE to REMEASURE', () => {
        const result = canTransition(OrderStatus.QUOTE, OrderStatus.REMEASURE, UserRole.PM);
        expect(result.success).toBe(true);
    });

    it('should not allow a SALES_REP to approve for production', () => {
        const result = canTransition(OrderStatus.PROD_REVIEW, OrderStatus.READY_FOR_PROD, UserRole.SALES_REP);
        expect(result.success).toBe(false);
        expect(result.error).toContain('permission');
    });

    it('should allow an ADMIN to move from OUT_FOR_INST to INSTALLED', () => {
        const result = canTransition(OrderStatus.OUT_FOR_INST, OrderStatus.INSTALLED, UserRole.ADMIN);
        expect(result.success).toBe(true);
    });

    it('should not allow an invalid transition', () => {
        const result = canTransition(OrderStatus.INSTALLED, OrderStatus.QUOTE, UserRole.ADMIN);
        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid transition');
    });
});