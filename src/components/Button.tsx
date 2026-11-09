import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const styles: Record<Variant, string> = {
  primary:
    "bg-volt-500 text-white hover:bg-volt-600 shadow-[0_0_0_1px_rgba(169,124,255,0.35),0_12px_30px_-12px_rgba(137,45,250,0.75)]",
  secondary:
    "bg-ink-800/70 text-cloud-50 hover:bg-ink-700 border border-line hover:border-line-strong backdrop-blur",
  ghost: "text-cloud-300 hover:text-cloud-50 hover:bg-ink-800/70",
  danger:
    "bg-rose-500/15 text-rose-200 border border-rose-400/30 hover:bg-rose-500/25 hover:border-rose-400/50",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-sm",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${styles[variant]} ${sizeStyles[size]} ${extra}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

/** Anchor styled as a button — for in-page (#section) and external links. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={buttonClasses(variant, size, className)}>
      {children}
    </a>
  );
}

/** Router link styled as a button — for client-side routes such as /demo. */
export function ButtonTo({
  to,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  to: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link to={to} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  );
}
