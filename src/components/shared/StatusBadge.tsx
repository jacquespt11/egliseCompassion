//import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'pending' | 
                        'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 
                        'EN_ATTENTE' | 'APPROUVEE' | 'REFUSEE' | 'ANNULEE';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ 
  status, 
  label, 
  showIcon = true, 
  size = 'md' 
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  // Mapper les différents types de statuts
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'success':
      case 'APPROUVEE':
      case 'ACTIVE':
        return {
          bg: 'bg-emerald-500/20',
          text: 'text-emerald-300',
          border: 'border-emerald-500/30',
          icon: CheckCircle
        };
      case 'error':
      case 'REFUSEE':
      case 'INACTIVE':
        return {
          bg: 'bg-rose-500/20',
          text: 'text-rose-300',
          border: 'border-rose-500/30',
          icon: XCircle
        };
      case 'warning':
      case 'MAINTENANCE':
      case 'ANNULEE':
        return {
          bg: 'bg-amber-500/20',
          text: 'text-amber-300',
          border: 'border-amber-500/30',
          icon: AlertCircle
        };
      case 'pending':
      case 'EN_ATTENTE':
        return {
          bg: 'bg-purple-500/20',
          text: 'text-purple-300',
          border: 'border-purple-500/30',
          icon: Clock
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-500/20',
          text: 'text-blue-300',
          border: 'border-blue-500/30',
          icon: AlertCircle
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`
      ${sizeClasses[size]} 
      ${config.bg} 
      ${config.text}
      border ${config.border}
      rounded-full inline-flex items-center gap-2 font-medium
    `}>
      {showIcon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </div>
  );
}