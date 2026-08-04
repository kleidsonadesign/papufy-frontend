import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Heart, MessageCircle } from "lucide-react";
import { CategoryIcon, type CategoryIconKey } from "./CategoryIcons";
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

function FallbackIcon({
  name,
  className = "h-[72%] w-[72%] text-sky-600",
}: {
  name: LottieIconName;
  className?: string;
}) {
  if (name === "heart") {
    return <Heart className={className} strokeWidth={1.75} />;
  }
  if (name === "chat") {
    return <MessageCircle className={className} strokeWidth={1.75} />;
  }
  return (
    <CategoryIcon name={name as CategoryIconKey} className={className} />
  );
}

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
  colors = "primary:#0284c7,secondary:#38bdf8",
}: AnimatedLordIconProps) {
  const src = LOTTIE_SRC[name] ?? LOTTIE_SRC.box;
  const hostRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<LordIconElement | null>(null);
  const [ready, setReady] = useState(false);
  const lastToken = useRef<typeof playToken>(undefined);

  const resolvedColors =
    name === "chat" && !colors.includes("#fff")
      ? "primary:#ffffff,secondary:#e0f2fe"
      : colors;

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

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    setReady(false);
    host.replaceChildren();

    const el = document.createElement("lord-icon") as LordIconElement;
    el.setAttribute("src", src);
    el.setAttribute("trigger", loop ? "loop" : "click");
    el.setAttribute("loading", "lazy");
    el.setAttribute("colors", resolvedColors);
    el.setAttribute("stroke", "regular");
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.display = "block";
    if (scale !== 1) {
      el.style.transform = `scale(${scale})`;
      el.style.transformOrigin = "center";
    }

    iconRef.current = el;
    host.appendChild(el);

    let cancelled = false;
    void el.readyPromise
      .then(() => {
        if (cancelled) return;
        setReady(true);
        if (autoplayOnce) play();
      })
      .catch(() => {
        /* fallback Lucide permanece */
      });

    return () => {
      cancelled = true;
      iconRef.current = null;
      host.replaceChildren();
    };
  }, [src, loop, resolvedColors, scale, autoplayOnce, play]);

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
      {!ready && (
        <span className="absolute inset-0 z-0 flex items-center justify-center">
          <FallbackIcon
            name={name}
            className={
              name === "chat"
                ? "h-[72%] w-[72%] text-white"
                : "h-[72%] w-[72%] text-sky-600"
            }
          />
        </span>
      )}
      <span
        ref={hostRef}
        className="relative z-10 block h-full w-full"
        style={{ opacity: ready ? 1 : 0, transition: "opacity 160ms ease-out" }}
      />
    </span>
  );
}

export function useLordPlay() {
  const [token, setToken] = useState(0);
  const trigger = useCallback(() => setToken((n) => n + 1), []);
  return { playToken: token, trigger } as const;
}

export { LOTTIE_SRC };
