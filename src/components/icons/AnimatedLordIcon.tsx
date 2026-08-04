import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  DotLottieReact,
  type DotLottie,
} from "@lottiefiles/dotlottie-react";

/** Chaves alinhadas a CategoryIconKey + ações (favorito/chat). */
export type LottieIconName =
  | "grid"
  | "todos"
  | "clipboard"
  | "user"
  | "headset"
  | "hardhat"
  | "brush"
  | "wrench"
  | "monitor"
  | "book"
  | "party"
  | "phone"
  | "sofa"
  | "car"
  | "shirt"
  | "ball"
  | "plant"
  | "box"
  | "heart"
  | "chat";

/** Assets Lordicon/Lottie em /public/lottie (JSON Lottie → player DotLottie). */
const LOTTIE_SRC: Record<LottieIconName, string> = {
  grid: "/lottie/todos.json",
  todos: "/lottie/todos.json",
  clipboard: "/lottie/clipboard.json",
  user: "/lottie/user.json",
  headset: "/lottie/headset.json",
  hardhat: "/lottie/hardhat.json",
  brush: "/lottie/brush.json",
  wrench: "/lottie/hardhat.json",
  monitor: "/lottie/monitor.json",
  book: "/lottie/book.json",
  party: "/lottie/party.json",
  phone: "/lottie/monitor.json",
  sofa: "/lottie/brush.json",
  car: "/lottie/hardhat.json",
  shirt: "/lottie/brush.json",
  ball: "/lottie/party.json",
  plant: "/lottie/brush.json",
  box: "/lottie/clipboard.json",
  heart: "/lottie/heart.json",
  chat: "/lottie/chat.json",
};

interface AnimatedLordIconProps {
  name: LottieIconName;
  size?: number;
  className?: string;
  autoplayOnce?: boolean;
  /** Incrementar/alterar para disparar play (ex.: clique favorito). */
  playToken?: number | string | boolean;
  loop?: boolean;
  style?: CSSProperties;
}

export function AnimatedLordIcon({
  name,
  size = 28,
  className = "",
  autoplayOnce = false,
  playToken,
  loop = false,
  style,
}: AnimatedLordIconProps) {
  const [player, setPlayer] = useState<DotLottie | null>(null);
  const lastToken = useRef<typeof playToken>(undefined);
  const src = LOTTIE_SRC[name] ?? LOTTIE_SRC.box;

  const play = useCallback(() => {
    if (!player) return;
    try {
      player.setFrame(0);
      player.play();
    } catch {
      /* player ainda carregando */
    }
  }, [player]);

  useEffect(() => {
    if (!player || !autoplayOnce) return;
    play();
  }, [player, autoplayOnce, play]);

  useEffect(() => {
    if (playToken === undefined || playToken === lastToken.current) return;
    lastToken.current = playToken;
    play();
  }, [playToken, play]);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={{ width: size, height: size, ...style }}
      aria-hidden
    >
      <DotLottieReact
        src={src}
        autoplay={loop}
        loop={loop}
        style={{ width: size, height: size }}
        dotLottieRefCallback={setPlayer}
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
