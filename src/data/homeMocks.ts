/**
 * Banners do carrossel hero.
 * PC: 1576×300 | Mobile: 807×376 (arquivos `*-mobile`).
 */
export type HeroSlideAction =
  | { type: "filter"; category: string }
  | {
      type: "anunciar";
      listingType: "JOB_VACANCY" | "PROFESSIONAL_PROFILE";
    };

export interface HeroSlide {
  id: string;
  /** Desktop 1576×300 */
  src: string;
  /** Mobile ~807×376 */
  srcMobile: string;
  alt: string;
  action?: HeroSlideAction;
}

export const HERO_BANNER_WIDTH = 1576;
export const HERO_BANNER_HEIGHT = 300;
export const HERO_BANNER_MOBILE_WIDTH = 807;
export const HERO_BANNER_MOBILE_HEIGHT = 376;

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "local",
    src: "/banners/local.png",
    srcMobile: "/banners/local-mobile.png",
    alt: "Serviço local, sem enrolação — quem precisa e quem faz, na sua cidade",
  },
  {
    id: "reformas",
    src: "/banners/reformas.png",
    srcMobile: "/banners/reformas-mobile.png",
    alt: "Problema resolvido, perto de você — reformas, limpeza e assistência na sua região",
    action: { type: "filter", category: "Reformas e Reparos" },
  },
  {
    id: "trabalhou-pagou",
    src: "/banners/trabalhou-pagou.png",
    srcMobile: "/banners/trabalhou-pagou-mobile.png",
    alt: "Seu trabalho na hora certa — trabalhou, pagou",
    action: { type: "anunciar", listingType: "PROFESSIONAL_PROFILE" },
  },
];
