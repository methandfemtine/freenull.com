'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-white/80 mb-2">{label}</label>}
      <input
        className={`w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white
          placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50
          transition-all duration-300 ${className} ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}
