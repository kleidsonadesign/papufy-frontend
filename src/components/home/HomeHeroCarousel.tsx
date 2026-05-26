import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFilters } from "../../context/FilterContext";
import { HERO_SLIDES, type HeroSlide } from "../../data/homeMocks";

const AUTO_MS = 5500;
const SWIPE_THRESHOLD = 48;

function IconChevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className="h-4 w-4 sm:h-5 sm:w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      {direction === "left" ? (
        <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function FindServiceSlide() {
  const { setCategory, setTipo } = useFilters();

  const openReformas = () => {
    setTipo(null);
    setCategory("Reformas e Reparos");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-sky-200 to-blue-300 px-4 py-5 sm:min-h-[200px]">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
          Encontrar serviço
        </p>
        <h3 className="mt-1 text-lg font-extrabold leading-tight text-slate-800 sm:text-xl">
          Profissionais perto de você
        </h3>
        <p className="mt-2 text-xs text-slate-600">
          Busque na barra do menu ou filtre por categoria.
        </p>
      </div>
      <button
        type="button"
        onClick={openReformas}
        className="mt-3 w-fit rounded-full bg-white px-4 py-2 text-xs font-bold text-sky-700 shadow-sm active:scale-95"
      >
        Ver reformas na região
      </button>
    </div>
  );
}

function PostServiceSlide() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 px-4 py-5 sm:min-h-[200px]">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-sky-50">
          Anunciar grátis
        </p>
        <h3 className="mt-1 text-lg font-extrabold leading-tight text-white sm:text-xl">
          Precisa de ajuda? Publique um pedido
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-sky-50/95">
          Descreva o serviço e receba contato de profissionais da sua cidade.
        </p>
      </div>
      <Link
        to={isAuthenticated ? "/anunciar" : "/entrar"}
        state={{
          listingType: "JOB_VACANCY",
          ...(isAuthenticated ? {} : { redirect: "/anunciar" }),
        }}
        className="mt-3 inline-flex w-fit rounded-full bg-white px-4 py-2 text-xs font-bold text-sky-700 shadow-md active:scale-95"
      >
        Publicar pedido de serviço
      </Link>
    </div>
  );
}

function PostProfileSlide() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-sky-300 via-sky-400 to-blue-500 px-4 py-5 sm:min-h-[200px]">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-sky-50">
          Trabalhar no Papufy
        </p>
        <h3 className="mt-1 text-lg font-extrabold leading-tight text-white sm:text-xl">
          Anuncie seu perfil profissional
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-sky-50/95">
          Mostre suas habilidades e seja encontrado por quem precisa do seu serviço.
        </p>
      </div>
      <Link
        to={isAuthenticated ? "/anunciar" : "/entrar"}
        state={{
          listingType: "PROFESSIONAL_PROFILE",
          ...(isAuthenticated ? {} : { redirect: "/anunciar" }),
        }}
        className="mt-3 inline-flex w-fit rounded-full bg-white px-4 py-2 text-xs font-bold text-sky-700 shadow-md active:scale-95"
      >
        Criar perfil profissional
      </Link>
    </div>
  );
}

function SlideContent({ variant }: { variant: HeroSlide["variant"] }) {
  if (variant === "find-service") return <FindServiceSlide />;
  if (variant === "post-service") return <PostServiceSlide />;
  return <PostProfileSlide />;
}

export function HomeHeroCarousel() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const paused = useRef(false);
  const total = HERO_SLIDES.length;

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused.current) goTo(index + 1);
    }, AUTO_MS);
    return () => clearInterval(timer);
  }, [index, goTo]);

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    paused.current = true;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD) prev();
    else if (delta < -SWIPE_THRESHOLD) next();
    touchStartX.current = null;
    setTimeout(() => {
      paused.current = false;
    }, 2000);
  };

  return (
    <section
      className="relative w-full select-none"
      aria-roledescription="carousel"
      aria-label="Ações no Papufy"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {HERO_SLIDES.map((slide) => (
            <div key={slide.id} className="w-full shrink-0">
              <SlideContent variant={slide.variant} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute left-1 top-[42%] z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-sky-600 shadow-md active:scale-95 sm:left-2 sm:h-9 sm:w-9"
        aria-label="Slide anterior"
      >
        <IconChevron direction="left" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-1 top-[42%] z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-sky-600 shadow-md active:scale-95 sm:right-2 sm:h-9 sm:w-9"
        aria-label="Próximo slide"
      >
        <IconChevron direction="right" />
      </button>

      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir para slide ${i + 1}`}
            className={`rounded-full transition-all ${
              i === index
                ? "h-2 w-5 bg-sky-500 shadow-sm"
                : "h-2 w-2 bg-white/90"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
