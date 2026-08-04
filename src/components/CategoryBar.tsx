import {
  JOB_VACANCY_CATEGORIES,
  getCategoryMeta,
  type JobVacancyCategory,
} from "../constants/categories";
import { useFilters } from "../context/FilterContext";
import {
  AnimatedLordIcon,
  useLordPlay,
  type LottieIconName,
} from "./icons/AnimatedLordIcon";
import { MotionPressButton } from "./motion/MotionPrimitives";

interface CategoryBarProps {
  onCategorySelect?: () => void;
}

type DesktopFilter =
  | { id: "all"; label: "Todos"; iconKey: LottieIconName; category: null }
  | {
      id: string;
      label: JobVacancyCategory;
      iconKey: LottieIconName;
      category: JobVacancyCategory;
    };

const DESKTOP_FILTERS: DesktopFilter[] = [
  { id: "all", label: "Todos", iconKey: "todos", category: null },
  ...JOB_VACANCY_CATEGORIES.map((category) => ({
    id: category,
    label: category,
    iconKey: getCategoryMeta(category).iconKey as LottieIconName,
    category,
  })),
];

function FilterChip({
  label,
  iconKey,
  isActive,
  onSelect,
}: {
  label: string;
  iconKey: LottieIconName;
  isActive: boolean;
  onSelect: () => void;
}) {
  const { playToken, trigger } = useLordPlay();

  return (
    <MotionPressButton
      onClick={() => {
        trigger();
        onSelect();
      }}
      className="group snap-start flex min-w-[4.5rem] shrink-0 flex-col items-center gap-1.5 outline-none sm:min-w-[5rem]"
      aria-pressed={isActive}
    >
      <span className="relative flex h-11 w-11 items-center justify-center sm:h-12 sm:w-12">
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-2xl transition duration-300 ease-out ${
            isActive
              ? "scale-100 bg-sky-400/20 opacity-100 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
              : "scale-75 bg-sky-400/0 opacity-0 group-hover:scale-100 group-hover:bg-sky-400/18 group-hover:opacity-100"
          }`}
        />
        <AnimatedLordIcon
          name={iconKey}
          fill
          scale={1.95}
          playToken={playToken}
          className="relative z-10 h-full w-full"
        />
      </span>
      <span
        className={`max-w-[5.5rem] text-center text-[11px] leading-tight transition duration-300 sm:text-xs ${
          isActive
            ? "font-semibold text-sky-700"
            : "font-medium text-sky-600 group-hover:font-semibold group-hover:text-sky-700"
        }`}
      >
        {label}
      </span>
    </MotionPressButton>
  );
}

export function CategoryBar({ onCategorySelect }: CategoryBarProps) {
  const { filters, setCategory, setListingType } = useFilters();

  const handleSelect = (category: JobVacancyCategory | null) => {
    if (category === null) {
      setCategory(null);
      setListingType(null);
    } else if (filters.category === category) {
      setCategory(null);
    } else {
      setListingType(null);
      setCategory(category);
    }
    onCategorySelect?.();
  };

  return (
    <section className="border-y border-slate-200/80 bg-white" aria-label="Categorias">
      <div className="page-container py-3 lg:py-3.5">
        <div className="scrollbar-hide snap-x-mandatory flex justify-center gap-5 overflow-x-auto pb-0.5 sm:gap-7">
          {DESKTOP_FILTERS.map((item) => {
            const isActive =
              item.category === null
                ? filters.category === null && filters.listingType === null
                : filters.category === item.category;

            return (
              <FilterChip
                key={item.id}
                label={item.label}
                iconKey={item.iconKey}
                isActive={isActive}
                onSelect={() => handleSelect(item.category)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
