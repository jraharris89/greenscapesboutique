import type { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "error" | "info" | "default";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-moss-100 text-moss-700",
  warning: "bg-cream-200 text-cream-800",
  error: "bg-terracotta-100 text-terracotta-700",
  info: "bg-sage-100 text-sage-700",
  default: "bg-bark-100 text-bark-700",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
