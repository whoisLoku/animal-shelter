import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 ease-in-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-accent-orange text-white shadow-lg shadow-accent-orange/30 hover:bg-amber-500 hover:shadow-xl hover:-translate-y-0.5",
    secondary: "bg-paw-800 text-white shadow-lg shadow-paw-800/30 hover:bg-paw-900 hover:shadow-xl hover:-translate-y-0.5",
    outline: "border-2 border-paw-800 text-paw-800 hover:bg-paw-800 hover:text-white",
    ghost: "text-paw-600 hover:bg-paw-100 hover:text-paw-900",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};