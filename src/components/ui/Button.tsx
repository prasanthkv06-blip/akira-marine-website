import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

const variants = {
  primary: 'bg-[var(--color-ink-400)] text-white hover:bg-[var(--color-ink-300)]',
  secondary: 'bg-[var(--color-ink-400)] text-white hover:bg-[var(--color-ink-300)]',
  outline: 'border border-[var(--color-ink-400)] text-[var(--color-ink-400)] hover:bg-[var(--color-ink-400)] hover:text-white',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled = false,
  className,
  type = 'button',
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center font-sans font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-signal-400)] focus:ring-offset-2',
    variants[variant],
    sizes[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
