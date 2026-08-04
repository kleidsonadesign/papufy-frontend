import {
  HOME_ALL_FILTERS,
  type ListingTypeFilter,
} from "../../constants/categories";
import { useFilters } from "../../context/FilterContext";
import type { JobFilters } from "../../context/FilterContext";
import {
  AnimatedLordIcon,
  useLordPlay,
  type LottieIconName,
} from "../icons/AnimatedLordIcon";
import { CategoryIconShell } from "../CategoryIconShell";
import { MotionPressButton } from "../motion/MotionPrimitives";

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

interface CategoryScrollProps {
  onChange?: () => void;
}

function MacroChip({
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
      className="group flex w-[3.75rem] shrink-0 snap-start flex-col items-center justify-center gap-1 outline-none sm:w-[4.25rem]"
      aria-pressed={isActive}
    >
      <CategoryIconShell isActive={isActive} size="sm">
        <AnimatedLordIcon
          name={iconKey}
          fill
          scale={1}
          playToken={playToken}
          className="h-full w-full"
        />
      </CategoryIconShell>
      <span
        className={`line-clamp-2 w-full text-center text-[9px] leading-tight transition duration-300 ${
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

export function CategoryScroll({ onChange }: CategoryScrollProps) {
  const { filters, setCategory, setListingType } = useFilters();
  const activeId = resolveActiveId(filters);

  const apply = (_listingType: ListingTypeFilter, category: string | null) => {
    setListingType(null);
    setCategory(category);
    onChange?.();
  };

  return (
    <section aria-label="Categorias" className="border-y border-slate-200/80 bg-white">
      <div className="py-2.5 sm:py-3">
        <div className="scrollbar-hide flex w-full snap-x snap-mandatory items-start justify-start gap-1 overflow-x-auto overscroll-x-contain px-3 sm:gap-2 sm:px-4 [-webkit-overflow-scrolling:touch]">
          {HOME_ALL_FILTERS.map((item) => (
            <MacroChip
              key={item.id}
              label={item.label}
              iconKey={item.iconKey as LottieIconName}
              isActive={activeId === item.id}
              onSelect={() => apply(item.listingType, item.category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
