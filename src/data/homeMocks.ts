export interface HeroSlide {
  id: string;
  variant: "find-service" | "post-service" | "post-profile";
}

export const HERO_SLIDES: HeroSlide[] = [
  { id: "slide-1", variant: "find-service" },
  { id: "slide-2", variant: "post-service" },
  { id: "slide-3", variant: "post-profile" },
];
