import type { ReactNode } from "react";
import { useReveal } from "../hooks";

export function Section({
  id,
  className = "",
  children,
  labelledBy,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      ref={ref}
      className={`relative scroll-mt-24 ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  id?: string;
}) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col gap-4 ${alignment}`}>
      <p className="reveal text-xs font-semibold uppercase tracking-[0.22em] text-volt-400">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="reveal font-display text-3xl font-semibold leading-[1.12] tracking-tight text-cloud-50 sm:text-4xl lg:text-[2.75rem]"
        style={{ transitionDelay: "60ms" }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="reveal max-w-2xl text-base leading-relaxed text-cloud-400 sm:text-lg"
          style={{ transitionDelay: "120ms" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
