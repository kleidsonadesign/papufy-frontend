import {
  JOB_VACANCY_CATEGORIES,
  MACRO_SCROLL_CATEGORIES,
  getCategoryMeta,
  type JobVacancyCategory,
  type ListingTypeFilter,
} from "../constants/categories";
import { useFilters } from "../context/FilterContext";
import type { JobFilters } from "../context/FilterContext";
import {
  AnimatedLordIcon,
  useLordPlay,
  type LottieIconName,
} from "./icons/AnimatedLordIcon";
import { CategoryIconShell } from "./CategoryIconShell";
import { MotionPressButton } from "./motion/MotionPrimitives";

interface CategoryBarProps {
  onCategorySelect?: () => void;
}

type DesktopFilter = {
  id: string;
  label: string;
  iconKey: LottieIconName;
  listingType: ListingTypeFilter;
  category: string | null;
};

/** Mesmos macros do mobile + categorias de pedido que não estão no carrossel. */
const MACRO_CATEGORY_IDS = new Set(
  MACRO_SCROLL_CATEGORIES.map((m) => m.category).filter(Boolean)
);

const DESKTOP_FILTERS: DesktopFilter[] = [
  ...MACRO_SCROLL_CATEGORIES.map((m) => ({
    id: m.id,
    label: m.label,
    iconKey: m.iconKey as LottieIconName,
    listingType: m.listingType,
    category: m.category,
  })),
  ...JOB_VACANCY_CATEGORIES.filter((c) => !MACRO_CATEGORY_IDS.has(c)).map(
    (category) => ({
      id: category,
      label: category,
      iconKey: getCategoryMeta(category).iconKey as LottieIconName,
      listingType: null as ListingTypeFilter,
      category,
    })
  ),
];

function resolveActiveId(filters: JobFilters): string {
  const match = DESKTOP_FILTERS.find((item) => {
    if (item.id === "all") {
      return filters.listingType === null && filters.category === null;
    }
    if (item.listingType !== null) {
      return (
        filters.listingType === item.listingType && filters.category === null
      );
    }
    if (item.category !== null) {
      return filters.category === item.category && filters.listingType === null;
    }
    return false;
  });
  return match?.id ?? "all";
}

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
      className="group snap-start flex min-w-[4.5rem] shrink-0 flex-col items-center gap-2 outline-none sm:min-w-[5rem]"
      aria-pressed={isActive}
    >
      <CategoryIconShell isActive={isActive}>
        <AnimatedLordIcon
          name={iconKey}
          fill
          scale={1}
          playToken={playToken}
          className="h-full w-full"
        />
      </CategoryIconShell>
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
  const activeId = resolveActiveId(filters);

  const handleSelect = (
    listingType: ListingTypeFilter,
    category: string | null
  ) => {
    setListingType(listingType);
    setCategory(category);
    onCategorySelect?.();
  };

  return (
    <section className="border-y border-slate-200/80 bg-white" aria-label="Categorias">
      <div className="page-container py-3 lg:py-3.5">
        <div className="scrollbar-hide snap-x-mandatory flex justify-center gap-5 overflow-x-auto pb-0.5 sm:gap-7">
          {DESKTOP_FILTERS.map((item) => (
            <FilterChip
              key={item.id}
              label={item.label}
              iconKey={item.iconKey}
              isActive={activeId === item.id}
              onSelect={() => handleSelect(item.listingType, item.category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}