'use client';

import { useRef, useState } from 'react';
import { FILE_CONSTRAINTS } from '@/lib/onboarding/schema';
import { cn } from '@/lib/utils';

interface FileDropFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  onChange: (file: File | null) => void;
}

const ACCEPT = FILE_CONSTRAINTS.accept.join(',');
const ACCEPTED_TYPES: readonly string[] = FILE_CONSTRAINTS.accept;

export function FileDropField({ label, name, required = false, error, onChange }: FileDropFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | undefined>();
  const combinedError = error ?? localError;
  const errorId = `${name}-error`;

  function handleSelect(selected: File | null) {
    if (!selected) {
      setFile(null);
      setLocalError(undefined);
      onChange(null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setLocalError('Unsupported file type — use JPG, PNG, HEIC, or PDF.');
      onChange(null);
      return;
    }
    if (selected.size > FILE_CONSTRAINTS.maxBytes) {
      setLocalError('File too large (max 10 MB).');
      onChange(null);
      return;
    }
    setLocalError(undefined);
    setFile(selected);
    onChange(selected);
  }

  function handleRemove() {
    setFile(null);
    setLocalError(undefined);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-sans font-medium text-[var(--color-ink-300)] mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-[rgba(31,27,23,0.12)] bg-white px-4 py-3">
          <span className="truncate text-sm font-sans text-[var(--color-ink-300)]">{file.name}</span>
          <button
            type="button"
            onClick={handleRemove}
            className="shrink-0 text-sm font-sans font-medium text-[var(--color-signal-400)] transition-colors hover:text-[var(--color-signal-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-signal-400)] rounded"
          >
            Remove
          </button>
        </div>
      ) : (
        <input
          ref={inputRef}
          id={name}
          name={name}
          type="file"
          accept={ACCEPT}
          required={required}
          onChange={(e) => handleSelect(e.target.files?.[0] ?? null)}
          aria-invalid={combinedError ? true : undefined}
          aria-describedby={combinedError ? errorId : undefined}
          className={cn(
            'block w-full rounded-lg border px-4 py-3 font-sans text-sm text-[var(--color-ink-300)] transition-colors duration-200',
            'file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-[var(--color-ink-400)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:transition-colors hover:file:bg-[var(--color-ink-300)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-signal-400)]',
            combinedError ? 'border-red-400 bg-red-50' : 'border-[rgba(31,27,23,0.12)] bg-white hover:border-[rgba(31,27,23,0.20)]'
          )}
        />
      )}

      {combinedError && (
        <p id={errorId} className="mt-1 text-sm text-red-600 font-sans">{combinedError}</p>
      )}
    </div>
  );
}
