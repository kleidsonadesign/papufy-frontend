import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";

interface MotionPressButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/** Feedback tátil Mobile First (Motion). */
export function MotionPressButton({
  children,
  className = "",
  type = "button",
  disabled,
  onClick,
  ...rest
}: MotionPressButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      transition={{ type: "spring", stiffness: 480, damping: 28 }}
      {...(rest as object)}
    >
      {children}
    </motion.button>
  );
}

interface MotionEnterProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/** Entrada suave de seções/cards (mobile first). */
export function MotionEnter({
  children,
  className = "",
  delay = 0,
  y = 12,
}: MotionEnterProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
