import { SCROLL_CATEGORIES } from "../../constants/categories";
import { useFilters } from "../../context/FilterContext";

interface CategoryScrollProps {
  onChange?: () => void;
}

export function CategoryScroll({ onChange }: CategoryScrollProps) {
  const { filters, setCategory, setTipo } = useFilters();

  const activeId =
    SCROLL_CATEGORIES.find(
      (c) =>
        (c.tipo === filters.tipo || (!c.tipo && !filters.tipo)) &&
        ("category" in c ? c.category === filters.category : !filters.category)
    )?.id ?? "all";

  return (
    <section className="border-b border-papufy-border bg-white">
      <div
        className="scrollbar-hide snap-x-mandatory flex gap-2 overflow-x-auto px-4 py-3 touch-pan-x"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {SCROLL_CATEGORIES.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTipo(item.tipo);
                setCategory("category" in item ? item.category! : null);
                onChange?.();
              }}
              className={`snap-start flex w-[72px] shrink-0 select-none flex-col items-center gap-1.5 rounded-2xl px-1 py-1 transition active:scale-95 ${
                isActive ? "opacity-100" : "opacity-80"
              }`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full text-xl shadow-sm transition ${
                  isActive
                    ? "bg-papufy-orange text-white ring-2 ring-sky-200"
                    : "bg-gray-100 text-papufy-text"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`line-clamp-2 text-center text-[10px] font-semibold leading-tight ${
                  isActive ? "text-papufy-orange" : "text-papufy-muted"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
