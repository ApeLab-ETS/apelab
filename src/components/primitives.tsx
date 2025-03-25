"use client";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

/**
 * Componente primitivo per i titoli con varianti configurabili
 */
export const titleVariants = cva(
  "font-bold leading-tight tracking-tight", 
  {
    variants: {
      size: {
        xs: "text-xl",
        sm: "text-2xl",
        md: "text-3xl",
        lg: "text-4xl",
        xl: "text-5xl",
      },
      color: {
        default: "text-slate-900",
        orange: "text-orange-500",
        white: "text-white",
        muted: "text-slate-600",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
      },
    },
    defaultVariants: {
      size: "md",
      color: "default",
      align: "left",
      weight: "bold",
    },
  }
);

export interface TitleProps extends VariantProps<typeof titleVariants> {
  className?: string;
}

/**
 * Crea classi CSS per un titolo in base alle proprietà fornite
 * @param options Opzioni di stile del titolo
 */
export function title(options: TitleProps = {}) {
  const { size, color, align, weight, className } = options;
  return cn(titleVariants({ size, color, align, weight, className }));
}

/**
 * Componente del titolo
 */
export function Title({ 
  size, 
  color, 
  align, 
  weight,
  className, 
  ...props 
}: TitleProps & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 
      className={cn(titleVariants({ size, color, align, weight }), className)}
      {...props}
    />
  );
}

export default Title; 