import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
          sizeClasses[size]
        )}
      />
    </div>
  );
};

export const LoadingDots: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
    </div>
  );
};

export const LoadingPulse: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex space-x-2", className)}>
      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-pulse delay-75"></div>
      <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full animate-pulse delay-150"></div>
    </div>
  );
};