'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  showIconOnly?: boolean;
  className?: string;
  href?: string;
}

const sizeClasses = {
  sm: {
    container: 'h-8',
    image: { width: 100, height: 32 }
  },
  md: {
    container: 'h-10',
    image: { width: 125, height: 40 }
  },
  lg: {
    container: 'h-12',
    image: { width: 150, height: 48 }
  },
  xl: {
    container: 'h-16',
    image: { width: 200, height: 64 }
  }
};

const iconSizeClasses = {
  sm: {
    container: 'h-8 w-8',
    image: { width: 32, height: 32 }
  },
  md: {
    container: 'h-10 w-10',
    image: { width: 40, height: 40 }
  },
  lg: {
    container: 'h-12 w-12',
    image: { width: 48, height: 48 }
  },
  xl: {
    container: 'h-16 w-16',
    image: { width: 64, height: 64 }
  }
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showIconOnly = false,
  className,
  href = '/',
}) => {
  const config = showIconOnly ? iconSizeClasses[size] : sizeClasses[size];
  const src = showIconOnly ? '/icon.png' : '/logo.png';

  const logoContent = (
    <div className={cn('relative flex items-center', config.container, className)}>
      <Image
        src={src}
        alt="Kallcast Logo"
        width={config.image.width}
        height={config.image.height}
        className="object-contain"
        priority
      />
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