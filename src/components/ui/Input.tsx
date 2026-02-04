"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 bg-white border rounded-lg text-sage-900
            placeholder:text-sage-400 focus:outline-none focus:ring-2
            focus:border-transparent transition-all duration-200
            ${error ? "border-terracotta-500 focus:ring-terracotta-500" : "border-sage-300 focus:ring-sage-500"}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-terracotta-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-sage-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
