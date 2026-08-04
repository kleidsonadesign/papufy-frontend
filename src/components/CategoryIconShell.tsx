import type { ReactNode } from "react";
import { motion } from "motion/react";

type ShellSize = "sm" | "md";

const SIZE_CLASS: Record<ShellSize, string> = {
  sm: "h-8 w-8 rounded-xl",
  md: "h-11 w-11 rounded-2xl sm:h-12 sm:w-12",
};

/** Destaque visual compartilhado dos chips de categoria (hover + ativo). */
export function CategoryIconShell({
  isActive,
  children,
  className = "",
  size = "md",
}: {
  isActive: boolean;
  children: ReactNode;
  className?: string;
  size?: ShellSize;
}) {
  const compact = size === "sm";

  return (
    <motion.span
      className={`relative flex shrink-0 items-center justify-center ${SIZE_CLASS[size]} ${className}`}
      animate={
        isActive
          ? {
              scale: compact ? 1.04 : 1.06,
              backgroundColor: "rgba(186, 230, 253, 0.95)",
              boxShadow: compact
                ? "0 0 0 1.5px rgba(56, 189, 248, 0.95), 0 0 0 4px rgba(56, 189, 248, 0.22)"
                : "0 0 0 2px rgba(56, 189, 248, 0.95), 0 0 0 6px rgba(56, 189, 248, 0.28), 0 10px 22px rgba(14, 165, 233, 0.28)",
            }
          : {
              scale: 1,
              backgroundColor: "rgba(186, 230, 253, 0)",
              boxShadow:
                "0 0 0 0px rgba(56, 189, 248, 0), 0 0 0 0px rgba(56, 189, 248, 0), 0 0 0 rgba(14, 165, 233, 0)",
            }
      }
      whileHover={
        isActive
          ? {
              scale: compact ? 1.06 : 1.08,
              boxShadow: compact
                ? "0 0 0 1.5px rgba(14, 165, 233, 1), 0 0 0 5px rgba(56, 189, 248, 0.28)"
                : "0 0 0 2px rgba(14, 165, 233, 1), 0 0 0 8px rgba(56, 189, 248, 0.35), 0 12px 26px rgba(14, 165, 233, 0.34)",
            }
          : {
              scale: compact ? 1.04 : 1.05,
              backgroundColor: "rgba(224, 242, 254, 0.95)",
              boxShadow: compact
                ? "0 0 0 1.5px rgba(125, 211, 252, 0.95), 0 0 0 4px rgba(56, 189, 248, 0.2)"
                : "0 0 0 2px rgba(125, 211, 252, 0.95), 0 0 0 5px rgba(56, 189, 248, 0.22), 0 8px 18px rgba(14, 165, 233, 0.2)",
            }
      }
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
    >
      <span className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </span>
    </motion.span>
  );
}
