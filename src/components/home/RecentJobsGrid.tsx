import { useState } from "react";
import { Link } from "react-router-dom";
import { MOCK_RECENT_JOBS, type MockRecentJob } from "../../data/homeMocks";
import { IconHeart } from "../icons/NavIcons";

interface RecentJobsGridProps {
  jobs?: MockRecentJob[];
  title?: string;
  subtitle?: string;
}

export function RecentJobsGrid({
  jobs = MOCK_RECENT_JOBS,
  title = "Procurados por você",
  subtitle = "Trabalhos mais recentes perto de você",
}: RecentJobsGridProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="w-full">
      <header className="mb-3 px-0.5">
        <h2 className="text-base font-extrabold tracking-tight text-papufy-text sm:text-lg">
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-papufy-muted sm:text-sm">{subtitle}</p>
      </header>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {jobs.map((job) => {
          const favorited = favorites[job.id];
          return (
            <Link
              key={job.id}
              to={`/anuncio/${job.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-papufy-border bg-white shadow-sm transition active:scale-[0.98]"
            >
              <div
                className={`relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br ${job.imageGradient}`}
              >
                <div className="flex h-full items-center justify-center">
                  <span className="text-5xl drop-shadow-md transition group-active:scale-105 sm:text-6xl">
                    {job.imageEmoji}
                  </span>
                </div>

                <span
                  className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide shadow-sm ${job.tagClassName}`}
                >
                  {job.categoryTag}
                </span>

                <button
                  type="button"
                  onClick={(e) => toggleFavorite(job.id, e)}
                  className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm transition active:scale-90 ${
                    favorited ? "text-papufy-orange" : "text-papufy-muted"
                  }`}
                  aria-label={favorited ? "Remover dos favoritos" : "Favoritar"}
                >
                  <IconHeart
                    className={`h-4 w-4 ${favorited ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              <div className="flex flex-col gap-0.5 p-2.5">
                <h3 className="line-clamp-2 text-xs font-bold leading-snug text-papufy-text sm:text-[13px]">
                  {job.title}
                </h3>
                <p className="text-sm font-extrabold text-papufy-text">
                  {job.price}
                </p>
                <p className="line-clamp-1 text-[10px] text-papufy-muted">
                  {job.locationLine}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
