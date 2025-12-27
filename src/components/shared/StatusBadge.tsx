// components/shared/StatusBadge.tsx
import { ROOM_STATUS, RESERVATION_STATUS } from '../../utils/constants';

interface StatusBadgeProps {
  status: keyof typeof ROOM_STATUS | keyof typeof RESERVATION_STATUS;
  type?: 'room' | 'reservation';
  className?: string;
}

export function StatusBadge({ status, type = 'room', className = '' }: StatusBadgeProps) {
  const statusConfig = type === 'room' 
    ? ROOM_STATUS[status as keyof typeof ROOM_STATUS]
    : RESERVATION_STATUS[status as keyof typeof RESERVATION_STATUS];

  if (!statusConfig) return null;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color} ${className}`}>
      {statusConfig.label}
    </span>
  );
}