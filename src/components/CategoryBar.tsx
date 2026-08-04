import {
  HOME_ALL_FILTERS,
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

function resolveActiveId(filters: JobFilters): string {
  const match = HOME_ALL_FILTERS.find((item) => {
    if (item.id === "all") {
      return filters.category === null;
    }
    if (item.category !== null) {
      return filters.category === item.category;
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
    _listingType: ListingTypeFilter,
    category: string | null
  ) => {
    setListingType(null);
    setCategory(category);
    onCategorySelect?.();
  };

  return (
    <section className="border-y border-slate-200/80 bg-white" aria-label="Categorias">
      <div className="page-container py-3 lg:py-4">
        <div className="scrollbar-hide flex flex-wrap justify-start gap-5 pb-0.5 sm:gap-7">
          {HOME_ALL_FILTERS.map((item) => (
            <FilterChip
              key={item.id}
              label={item.label}
              iconKey={item.iconKey as LottieIconName}
              isActive={activeId === item.id}
              onSelect={() => handleSelect(item.listingType, item.category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
