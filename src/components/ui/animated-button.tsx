import React from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  gradient?: boolean;
  glow?: boolean;
  float?: boolean;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, gradient = false, glow = false, float = false, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "transition-all duration-300 transform",
          gradient && "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
          glow && "shadow-lg hover:shadow-xl",
          float && "hover:-translate-y-1",
          "hover:scale-105 group",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";