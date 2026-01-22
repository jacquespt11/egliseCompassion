// src/types/api.ts

export const UserRole = {
  MEMBER: 'Member',
  RESPONSIBLE: 'Responsible',
  PASTOR: 'Pastor',
  ADMIN: 'Admin'
} as const;

export const ReservationStatus = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed'
} as const;

export const RecurrenceFrequency = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  BIWEEKLY: 'BIWEEKLY',
  MONTHLY: 'MONTHLY'
} as const;

export const RecurrenceEndType = {
  DATE: 'date',
  COUNT: 'count',
  OCCURRENCES: 'occurrences'
} as const;

// Types d'interfaces (pas d'enums)
export interface RecurrencePattern {
  frequency: string;
  interval?: number;
  daysOfWeek?: number[];
  endType: string;
  endDate?: string;
  occurrencesCount?: number;
}

export interface CreateReservationRequest {
  roomId: number;
  title: string;
  description?: string;
  attendees: number;
  startTime: string;
  endTime: string;
  isRecurrent?: boolean;
  recurrence?: RecurrencePattern;
}