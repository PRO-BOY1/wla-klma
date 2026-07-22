"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cx } from "@/lib/utils";

type Variant = "primary" | "ghost" | "danger" | "team-red" | "team-blue" | "gold";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: "md" | "lg" | "xl";
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-paper text-ink shadow-[0_8px_30px_-8px_rgba(245,247,250,0.4)]",
  ghost: "glass text-paper hover:bg-white/10",
  danger: "bg-red-500/90 text-white shadow-[0_8px_30px_-8px_rgba(239,68,68,0.6)]",
  "team-red": "bg-team-red text-white shadow-team-red shadow-glow",
  "team-blue": "bg-team-blue text-ink shadow-team-blue shadow-glow",
  gold: "bg-gold text-ink shadow-gold shadow-glow",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "px-5 py-3 text-base rounded-xl",
  lg: "px-7 py-4 text-lg rounded-2xl",
  xl: "px-10 py-6 text-2xl rounded-[28px]",
};

export function Button({
  variant = "primary",
  size = "lg",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cx(
        "font-display font-bold select-none no-tap-highlight",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
