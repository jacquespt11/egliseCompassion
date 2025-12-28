import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock } from 'lucide-react';

interface TimeDisplayProps {
  date: Date | string;
  showDate?: boolean;
  showTime?: boolean;
  showIcon?: boolean;
  className?: string;
}

export function TimeDisplay({ 
  date, 
  showDate = true, 
  showTime = true,
  showIcon = true,
  className = ''
}: TimeDisplayProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  let displayText = '';
  
  if (showDate && showTime) {
    displayText = format(dateObj, "dd MMMM yyyy 'à' HH:mm", { locale: fr });
  } else if (showDate) {
    displayText = format(dateObj, 'dd MMMM yyyy', { locale: fr });
  } else if (showTime) {
    displayText = format(dateObj, 'HH:mm', { locale: fr });
  }

  const Icon = showDate && showTime ? Calendar : showDate ? Calendar : Clock;

  return (
    <div className={`flex items-center gap-2 text-white/70 ${className}`}>
      {showIcon && <Icon className="w-4 h-4" />}
      <span>{displayText}</span>
    </div>
  );
}