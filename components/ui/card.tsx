'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function Card({ children, className = '', hover = true, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { scale: 1.05, y: -5 } : {}}
      className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6
        hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300
        ${className}`}
    >
      {children}
    </motion.div>
  );
}
