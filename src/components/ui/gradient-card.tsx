import React from 'react';
import { Card, CardProps } from './card';
import { cn } from '@/lib/utils';

interface GradientCardProps extends CardProps {
  gradient?: 'blue' | 'purple' | 'emerald' | 'orange' | 'red' | 'yellow';
  hover?: boolean;
}

const gradientClasses = {
  blue: "bg-gradient-to-br from-white to-blue-50/30 hover:from-blue-50/50 hover:to-purple-50/30",
  purple: "bg-gradient-to-br from-white to-purple-50/30 hover:from-purple-50/50 hover:to-indigo-50/30",
  emerald: "bg-gradient-to-br from-white to-emerald-50/30 hover:from-emerald-50/50 hover:to-teal-50/30",
  orange: "bg-gradient-to-br from-white to-orange-50/30 hover:from-orange-50/50 hover:to-amber-50/30",
  red: "bg-gradient-to-br from-white to-red-50/30 hover:from-red-50/50 hover:to-rose-50/30",
  yellow: "bg-gradient-to-br from-white to-yellow-50/30 hover:from-yellow-50/50 hover:to-amber-50/30",
};

export const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient = 'blue', hover = true, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "border-0 transition-all duration-500",
          gradient && gradientClasses[gradient],
          hover && "group hover:shadow-2xl transform hover:-translate-y-2",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

GradientCard.displayName = "GradientCard";