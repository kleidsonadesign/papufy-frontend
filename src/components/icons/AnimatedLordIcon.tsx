import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
} from "react";
import { useState } from "react";
import type { LottieIconName } from "./lottieTypes";
import { LOTTIE_SRC } from "../../lib/lottieSrc";

export type { LottieIconName };

/** Elemento custom do @lordicon/element */
type LordIconElement = HTMLElement & {
  readyPromise: Promise<void>;
  playerInstance?: {
    playFromStart: () => void;
    play: () => void;
  };
};

interface AnimatedLordIconProps {
  name: LottieIconName;
  size?: number;
  /**
   * Amplia o desenho dentro do box (Lordicon outline vem com padding).
   */
  scale?: number;
  /** Se true, ocupa 100% do pai. */
  fill?: boolean;
  className?: string;
  autoplayOnce?: boolean;
  /** Dispara play (ex.: clique no filtro/favorito). */
  playToken?: number | string | boolean;
  loop?: boolean;
  style?: CSSProperties;
  /** Cores Lordicon: primary/secondary */
  colors?: string;
}

const DEFAULT_COLORS = "primary:#0284c7,secondary:#38bdf8";

/**
 * Lordicon único — sem fallback SVG por cima (evita overlap e peso extra).
 * Cores/loop atualizam no elemento existente; não remonta o player.
 */
export function AnimatedLordIcon({
  name,
  size = 28,
  scale = 1,
  fill = false,
  className = "",
  autoplayOnce = false,
  playToken,
  loop = false,
  style,
  colors = DEFAULT_COLORS,
}: AnimatedLordIconProps) {
  const src = LOTTIE_SRC[name] ?? LOTTIE_SRC.box;
  const hostRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<LordIconElement | null>(null);
  const lastToken = useRef<typeof playToken>(undefined);
  const autoplayOnceRef = useRef(autoplayOnce);
  autoplayOnceRef.current = autoplayOnce;

  const play = useCallback(() => {
    const player = iconRef.current?.playerInstance;
    if (!player) return;
    try {
      player.playFromStart();
    } catch {
      try {
        player.play();
      } catch {
        /* ainda carregando */
      }
    }
  }, []);

  // Monta o player uma vez por `src` / scale — não remonta por cor.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    host.replaceChildren();

    const el = document.createElement("lord-icon") as LordIconElement;
    el.setAttribute("src", src);
    el.setAttribute("trigger", loop ? "loop" : "click");
    el.setAttribute("loading", "eager");
    el.setAttribute("colors", colors);
    el.setAttribute("stroke", "regular");
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.display = "block";
    if (scale !== 1) {
      el.style.transform = `scale(${scale})`;
      el.style.transformOrigin = "center center";
    }

    iconRef.current = el;
    host.appendChild(el);

    let cancelled = false;
    void el.readyPromise
      .then(() => {
        if (cancelled) return;
        if (autoplayOnceRef.current) play();
      })
      .catch(() => {
        /* silencioso — sem ícone duplicado */
      });

    return () => {
      cancelled = true;
      iconRef.current = null;
      host.replaceChildren();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cores/loop atualizam em effects separados
  }, [src, scale, play]);

  useEffect(() => {
    const el = iconRef.current;
    if (!el) return;
    el.setAttribute("colors", colors);
  }, [colors]);

  useEffect(() => {
    const el = iconRef.current;
    if (!el) return;
    el.setAttribute("trigger", loop ? "loop" : "click");
  }, [loop]);

  useEffect(() => {
    if (playToken === undefined || playToken === lastToken.current) return;
    lastToken.current = playToken;
    play();
  }, [playToken, play]);

  const boxStyle: CSSProperties = {
    width: fill ? "100%" : size,
    height: fill ? "100%" : size,
    ...style,
  };

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={boxStyle}
      aria-hidden
    >
      <span ref={hostRef} className="block h-full w-full" />
    </span>
  );
}

export function useLordPlay() {
  const [token, setToken] = useState(0);
  const trigger = useCallback(() => setToken((n) => n + 1), []);
  return { playToken: token, trigger } as const;
}

export { LOTTIE_SRC };
