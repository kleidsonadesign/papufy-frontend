import {
  HOME_ALL_FILTERS,
  HOME_SERVICE_FILTERS,
  HOME_TYPE_FILTERS,
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
      className="group flex min-w-0 flex-1 flex-col items-center gap-1 outline-none"
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

  const apply = (listingType: ListingTypeFilter, category: string | null) => {
    setListingType(listingType);
    setCategory(category);
    onChange?.();
  };

  return (
    <section aria-label="Categorias" className="border-y border-slate-200/80 bg-white">
      <div className="space-y-2.5 px-2 py-2.5 sm:px-3 sm:py-3">
        <div className="flex w-full items-start justify-between gap-0.5">
          {HOME_TYPE_FILTERS.map((item) => (
            <MacroChip
              key={item.id}
              label={item.label}
              iconKey={item.iconKey as LottieIconName}
              isActive={activeId === item.id}
              onSelect={() => apply(item.listingType, item.category)}
            />
          ))}
        </div>
        <div className="flex w-full items-start justify-between gap-0.5">
          {HOME_SERVICE_FILTERS.map((item) => (
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
