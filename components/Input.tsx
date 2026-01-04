import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-discord-muted mb-1 uppercase tracking-wide">{label}</label>}
      <input 
        className={`w-full bg-discord-darker border border-transparent focus:border-discord-highlight text-discord-text placeholder-discord-muted/60 rounded p-2.5 outline-none transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};