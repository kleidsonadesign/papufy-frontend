import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { ReactNode, HTMLAttributes } from "react";

interface AutoAnimateProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "ul" | "ol" | "section";
  children: ReactNode;
  /** Duração em ms (padrão 280). */
  duration?: number;
}

/** Transições suaves ao adicionar/remover/reordenar filhos (FormKit AutoAnimate). */
export function AutoAnimateList({
  as: Tag = "div",
  children,
  className,
  duration = 280,
  ...rest
}: AutoAnimateProps) {
  const [parent] = useAutoAnimate({
    duration,
    easing: "ease-out",
  });

  return (
    <Tag ref={parent as never} className={className} {...rest}>
      {children}
    </Tag>
  );
}
