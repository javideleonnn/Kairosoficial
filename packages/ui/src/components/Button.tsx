import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-200 ease-kairos disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "border border-accent/40 text-foreground hover:border-accent hover:shadow-[0_0_20px_-4px_var(--color-accent)]",
  ghost: "text-foreground/30 hover:text-foreground/70",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
