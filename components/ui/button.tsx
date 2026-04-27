'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({
  children,
  onClick,
  href,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseClasses =
    'px-6 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden';

  const variants = {
    primary: `bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/50
              hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`,
    secondary: `bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:shadow-lg
               hover:shadow-blue-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`,
  };

  const Component = motion(href ? 'a' : 'button');

  return (
    <Component
      as={href ? 'a' : 'button'}
      type={!href ? type : undefined}
      href={href}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0"
          whileHover={{ opacity: 0.2 }}
        />
      )}
    </Component>
  );
}
