import {
  MACRO_SCROLL_CATEGORIES,
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

function resolveActiveMacroId(filters: JobFilters): string {
  const match = MACRO_SCROLL_CATEGORIES.find((macro) => {
    if (macro.id === "all") {
      return filters.listingType === null && filters.category === null;
    }
    if (macro.listingType !== null) {
      return (
        filters.listingType === macro.listingType && filters.category === null
      );
    }
    if (macro.category !== null) {
      return filters.category === macro.category && filters.listingType === null;
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
        className={`line-clamp-2 w-full text-center text-[9px] leading-tight transition duration-300 xs:text-[10px] ${
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
  const activeId = resolveActiveMacroId(filters);

  const applyMacro = (
    listingType: ListingTypeFilter,
    category: string | null
  ) => {
    setListingType(listingType);
    setCategory(category);
    onChange?.();
  };

  return (
    <section aria-label="Categorias" className="border-y border-slate-200/80 bg-white">
      <div className="px-2 py-2.5 sm:px-3 sm:py-3">
        <div className="flex w-full items-start justify-between gap-0.5 sm:gap-1">
          {MACRO_SCROLL_CATEGORIES.map((item) => (
            <MacroChip
              key={item.id}
              label={item.label}
              iconKey={item.iconKey as LottieIconName}
              isActive={activeId === item.id}
              onSelect={() => applyMacro(item.listingType, item.category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
