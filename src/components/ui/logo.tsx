import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'white' | 'dark';
  showIcon?: boolean;
  href?: string;
  className?: string;
}

const sizeClasses = {
  sm: {
    icon: 'w-6 h-6',
    iconContainer: 'w-8 h-8',
    text: 'text-lg',
    spacing: 'space-x-2'
  },
  md: {
    icon: 'w-6 h-6',
    iconContainer: 'w-10 h-10',
    text: 'text-2xl',
    spacing: 'space-x-3'
  },
  lg: {
    icon: 'w-7 h-7',
    iconContainer: 'w-12 h-12',
    text: 'text-3xl',
    spacing: 'space-x-3'
  }
};

const variantClasses = {
  default: {
    iconContainer: 'bg-gradient-to-br from-blue-600 to-purple-600',
    icon: 'text-white',
    text: 'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'
  },
  white: {
    iconContainer: 'bg-white/20 backdrop-blur-sm',
    icon: 'text-white',
    text: 'text-white'
  },
  dark: {
    iconContainer: 'bg-gradient-to-br from-blue-600 to-purple-600',
    icon: 'text-white',
    text: 'text-gray-900'
  }
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'default',
  showIcon = true,
  href = '/',
  className
}) => {
  const sizeConfig = sizeClasses[size];
  const variantConfig = variantClasses[variant];

  const logoContent = (
    <div className={cn('flex items-center', sizeConfig.spacing, className)}>
      {showIcon && (
        <div className={cn(
          sizeConfig.iconContainer,
          'rounded-xl flex items-center justify-center shadow-lg',
          variantConfig.iconContainer
        )}>
          <Sparkles className={cn(sizeConfig.icon, variantConfig.icon)} />
        </div>
      )}
      <h1 className={cn(
        sizeConfig.text,
        'font-bold',
        variantConfig.text
      )}>
        Kallcast
      </h1>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo;