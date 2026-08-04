import { LOTTIE_SRC } from "./lottieSrc";
import type { LottieIconName } from "../components/icons/lottieTypes";

export function getLordIconScale(_name?: LottieIconName): number {
  return 1;
}

const CATEGORY_LOTTIE_URLS = Array.from(
  new Set(
    (
      [
        "todos",
        "clipboard",
        "user",
        "headset",
        "wrench",
        "hardhat",
        "brush",
        "monitor",
        "book",
        "party",
        "box",
        "heart",
        "chat",
      ] as LottieIconName[]
    ).map((name) => LOTTIE_SRC[name])
  )
);

/** Pré-busca os JSON das categorias (cache HTTP para o Lordicon). */
export function preloadCategoryLotties(): void {
  if (typeof window === "undefined") return;
  // Idle: não competir com o first paint.
  const run = () => {
    for (const url of CATEGORY_LOTTIE_URLS) {
      void fetch(url, { credentials: "same-origin" }).catch(() => {
        /* ignore */
      });
    }
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 2500 });
  } else {
    window.setTimeout(run, 400);
  }
}

export function getCachedLottieData(_src: string): string | undefined {
  return undefined;
}

export function loadLottieData(src: string): Promise<string> {
  return fetch(src).then((res) => {
    if (!res.ok) throw new Error(`Falha ao carregar ${src}`);
    return res.text();
  });
}
