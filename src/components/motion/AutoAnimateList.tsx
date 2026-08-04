import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { ReactNode, HTMLAttributes } from "react";

interface AutoAnimateProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "ul" | "ol" | "section";
  children: ReactNode;
}

/** Transições suaves ao adicionar/remover/reordenar filhos (FormKit AutoAnimate). */
export function AutoAnimateList({
  as: Tag = "div",
  children,
  className,
  ...rest
}: AutoAnimateProps) {
  const [parent] = useAutoAnimate({
    duration: 280,
    easing: "ease-out",
  });

  return (
    <Tag ref={parent as never} className={className} {...rest}>
      {children}
    </Tag>
  );
}
