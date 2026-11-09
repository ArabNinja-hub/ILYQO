import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-volt-500 text-white hover:bg-volt-600 shadow-[0_0_0_1px_rgba(129,139,255,0.35),0_12px_30px_-12px_rgba(99,102,241,0.7)]",
  secondary:
    "bg-ink-800/70 text-cloud-50 hover:bg-ink-700 border border-line backdrop-blur",
  ghost: "text-cloud-300 hover:text-cloud-50",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${styles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
