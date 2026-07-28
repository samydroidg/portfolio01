import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, ...props }: InputProps) {
  return (
    <div>
      <input
        id={id}
        placeholder=" "
        className={`
          peer w-full px-4 pt-6 pb-2 rounded-lg border bg-transparent text-sm outline-none transition-all duration-200
          ${error
            ? 'border-red-500/40 focus:border-red-500'
            : 'border-border focus:border-accent-border'
          }
          focus:shadow-glow
        `}
        {...props}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-4 top-4 text-sm transition-all duration-200 pointer-events-none
          peer-focus:text-xs peer-focus:top-2 peer-focus:text-accent
          peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-2
          ${error ? 'text-red-500' : 'text-text-muted peer-focus:text-accent'}
        `}
      >
        {label}
      </label>
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, id, ...props }: TextareaProps) {
  return (
    <div>
      <textarea
        id={id}
        placeholder=" "
        className={`
          peer w-full px-4 pt-6 pb-2 rounded-lg border bg-transparent text-sm outline-none transition-all duration-200 resize-none
          ${error
            ? 'border-red-500/40 focus:border-red-500'
            : 'border-border focus:border-accent-border'
          }
          focus:shadow-glow
        `}
        {...props}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-4 top-4 text-sm transition-all duration-200 pointer-events-none
          peer-focus:text-xs peer-focus:top-2 peer-focus:text-accent
          peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-2
          ${error ? 'text-red-500' : 'text-text-muted peer-focus:text-accent'}
        `}
      >
        {label}
      </label>
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}
