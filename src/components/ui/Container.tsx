interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-7xl 2xl:max-w-[1520px] px-4 sm:px-6 lg:px-10 2xl:px-16 ${className}`}>
      {children}
    </div>
  );
}
