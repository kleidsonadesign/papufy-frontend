import type { ReactNode } from "react";
import { motion } from "motion/react";

/** Destaque visual compartilhado dos chips de categoria (hover + ativo). */
export function CategoryIconShell({
  isActive,
  children,
  className = "",
}: {
  isActive: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      className={`relative flex h-11 w-11 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${className}`}
      animate={
        isActive
          ? {
              scale: 1.06,
              backgroundColor: "rgba(186, 230, 253, 0.95)",
              boxShadow:
                "0 0 0 2px rgba(56, 189, 248, 0.95), 0 0 0 6px rgba(56, 189, 248, 0.28), 0 10px 22px rgba(14, 165, 233, 0.28)",
            }
          : {
              scale: 1,
              backgroundColor: "rgba(186, 230, 253, 0)",
              boxShadow: "0 0 0 0px rgba(56, 189, 248, 0), 0 0 0 0px rgba(56, 189, 248, 0), 0 0 0 rgba(14, 165, 233, 0)",
            }
      }
      whileHover={
        isActive
          ? {
              scale: 1.08,
              boxShadow:
                "0 0 0 2px rgba(14, 165, 233, 1), 0 0 0 8px rgba(56, 189, 248, 0.35), 0 12px 26px rgba(14, 165, 233, 0.34)",
            }
          : {
              scale: 1.05,
              backgroundColor: "rgba(224, 242, 254, 0.95)",
              boxShadow:
                "0 0 0 2px rgba(125, 211, 252, 0.95), 0 0 0 5px rgba(56, 189, 248, 0.22), 0 8px 18px rgba(14, 165, 233, 0.2)",
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
