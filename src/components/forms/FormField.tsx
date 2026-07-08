import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  value,
  onChange,
}: FormFieldProps) {
  const baseClasses = cn(
    'w-full rounded-lg border px-4 py-3 font-serif text-[var(--color-ink-400)] placeholder:text-[var(--color-ink-100)] transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-signal-400)] focus:border-transparent',
    error ? 'border-red-400 bg-red-50' : 'border-[rgba(31,27,23,0.12)] bg-white hover:border-[rgba(31,27,23,0.20)]'
  );

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-sans font-medium text-[var(--color-ink-300)] mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          rows={5}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={baseClasses}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={baseClasses}
        />
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600 font-sans">{error}</p>
      )}
    </div>
  );
}
