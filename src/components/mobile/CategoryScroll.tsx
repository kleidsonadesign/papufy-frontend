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
import { MotionPressButton } from "../motion/MotionPrimitives";
import { getLordIconScale } from "../../lib/lottiePreload";

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
      className="group flex w-[4.5rem] shrink-0 flex-col items-center gap-1.5 outline-none"
      aria-pressed={isActive}
    >
      <span className="relative flex h-11 w-11 items-center justify-center">
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-2xl transition duration-300 ease-out ${
            isActive
              ? "scale-100 bg-sky-400/20 opacity-100 shadow-[0_0_18px_rgba(56,189,248,0.35)]"
              : "scale-75 opacity-0 group-hover:scale-100 group-hover:bg-sky-400/18 group-hover:opacity-100"
          }`}
        />
        <AnimatedLordIcon
          name={iconKey}
          fill
          scale={getLordIconScale(iconKey)}
          playToken={playToken}
          className="relative z-10 h-full w-full"
        />
      </span>
      <span
        className={`line-clamp-2 w-full text-center text-[11px] leading-tight transition duration-300 ${
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
      <div
        className="scrollbar-hide overflow-x-auto px-3 py-3 touch-pan-x"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="mx-auto flex w-max min-w-full flex-nowrap justify-center gap-5 sm:gap-6">
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
