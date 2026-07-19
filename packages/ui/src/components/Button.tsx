import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 ease-kairos disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // El pill dorado principal — borde transparente→dorado en hover, con
  // glow sutil. Ver documento de experiencia, sección 2 (Sistema de componentes).
  primary:
    "border border-accent/40 text-foreground hover:border-accent hover:shadow-[0_0_20px_-4px_var(--color-accent)]",
  // Botón secundario/atrás — sin borde, solo cambio de opacidad.
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
