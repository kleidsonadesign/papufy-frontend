import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

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
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/** Entrada leve para headers/páginas (y menor). */
export function MotionPage({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <MotionEnter className={className} delay={delay} y={8}>
      {children}
    </MotionEnter>
  );
}

interface MotionMessageBubbleProps {
  children: ReactNode;
  isMine?: boolean;
  className?: string;
}

/** Entrada lateral + fade para bolhas de chat. */
export function MotionMessageBubble({
  children,
  isMine = false,
  className = "",
}: MotionMessageBubbleProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div
        className={`flex ${isMine ? "justify-end" : "justify-start"} ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`flex ${isMine ? "justify-end" : "justify-start"} ${className}`}
      initial={{ opacity: 0, x: isMine ? 16 : -16, y: 6 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.7 }}
    >
      {children}
    </motion.div>
  );
}

/** Overlay de modal/sheet (fade). */
export function MotionOverlay({
  children,
  className = "",
  onClick,
}: {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label="Fechar"
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

/** Painel bottom sheet (slide-up). */
export function MotionSheetPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    >
      {children}
    </motion.div>
  );
}
