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
    'w-full rounded-lg border px-4 py-3 font-serif text-navy-900 placeholder:text-navy-400 transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
    error ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-white hover:border-navy-300'
  );

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-sans font-medium text-navy-800 mb-2">
        {label}
        {required && <span className="text-orange-500 ml-1">*</span>}
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
          className={baseClasses}
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600 font-sans">{error}</p>
      )}
    </div>
  );
}
