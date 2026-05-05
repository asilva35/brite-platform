import { OrderStatus, UserRole } from '@prisma/client';

// Map of allowed transitions (Current State -> Next States)
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.QUOTE]: [OrderStatus.REMEASURE, OrderStatus.CANCELLED],
    [OrderStatus.REMEASURE]: [OrderStatus.PROD_REVIEW, OrderStatus.CANCELLED],
    [OrderStatus.PROD_REVIEW]: [OrderStatus.READY_FOR_PROD, OrderStatus.QUOTE], // Can return to quote if there is an error
    [OrderStatus.READY_FOR_PROD]: [OrderStatus.IN_PRODUCTION],
    [OrderStatus.IN_PRODUCTION]: [OrderStatus.READY_TO_SHIP],
    [OrderStatus.READY_TO_SHIP]: [OrderStatus.OUT_FOR_INST],
    [OrderStatus.OUT_FOR_INST]: [OrderStatus.INSTALLED],
    [OrderStatus.INSTALLED]: [], // Final state
    [OrderStatus.CANCELLED]: [OrderStatus.QUOTE] // Allows restarting a cancelled order
};

// Permissions by Role (Who can move to which state)
export const ROLE_PERMISSIONS: Record<OrderStatus, UserRole[]> = {
    [OrderStatus.QUOTE]: [UserRole.SALES_REP, UserRole.ADMIN],
    [OrderStatus.REMEASURE]: [UserRole.SALES_REP, UserRole.ADMIN],
    [OrderStatus.PROD_REVIEW]: [UserRole.PM, UserRole.ADMIN],
    [OrderStatus.READY_FOR_PROD]: [UserRole.PRODUCTION, UserRole.ADMIN],
    [OrderStatus.IN_PRODUCTION]: [UserRole.PRODUCTION, UserRole.ADMIN],
    [OrderStatus.READY_TO_SHIP]: [UserRole.PRODUCTION, UserRole.ADMIN],
    [OrderStatus.OUT_FOR_INST]: [UserRole.PRODUCTION, UserRole.ADMIN],
    [OrderStatus.INSTALLED]: [UserRole.ADMIN, UserRole.PM],
    [OrderStatus.CANCELLED]: [UserRole.ADMIN, UserRole.SALES_REP]
};

export function canTransition(
    currentStatus: OrderStatus,
    nextStatus: OrderStatus,
    userRole: UserRole
): { success: boolean; error?: string } {

    const possibleNextStates = ALLOWED_TRANSITIONS[currentStatus];
    if (!possibleNextStates?.includes(nextStatus)) {
        return { success: false, error: `Invalid transition from ${currentStatus} to ${nextStatus}.` };
    }

    const allowedRoles = ROLE_PERMISSIONS[nextStatus];
    if (!allowedRoles?.includes(userRole)) {
        return { success: false, error: "Your role does not have permission to authorize this state change." };
    }

    return { success: true };
}