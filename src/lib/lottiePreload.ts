import { LOTTIE_SRC } from "./lottieSrc";
import type { LottieIconName } from "../components/icons/lottieTypes";

/** Escala menor em ícones com mais padding interno (evita corte). */
const COMPACT_SCALE_ICONS = new Set<LottieIconName>([
  "headset",
  "hardhat",
  "book",
]);

export function getLordIconScale(name: LottieIconName): number {
  return COMPACT_SCALE_ICONS.has(name) ? 1.15 : 1.25;
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

/** Pré-busca os JSON das categorias (o player Lordicon carrega do cache HTTP). */
export function preloadCategoryLotties(): void {
  for (const url of CATEGORY_LOTTIE_URLS) {
    void fetch(url).catch(() => {
      /* ignore */
    });
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
