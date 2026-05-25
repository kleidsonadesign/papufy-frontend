import { Link } from "react-router-dom";
import { CATEGORY_META } from "../../constants/categories";
import type { Listing } from "../../types";
import { formatLocation, formatPrice } from "../../utils/format";

interface ListingCardMobileProps {
  listing: Listing;
}

export function ListingCardMobile({ listing }: ListingCardMobileProps) {
  const meta = CATEGORY_META[listing.categoria] ?? CATEGORY_META.Outros;
  const isBico = listing.tipo === "BICO";
  const cover = listing.imagemCapa;
  const showImage = cover && !cover.includes("placeholders/");

  return (
    <Link
      to={`/anuncio/${listing.id}`}
      className="group flex select-none flex-col overflow-hidden rounded-xl border border-papufy-border bg-white shadow-sm transition active:scale-[0.98] active:shadow-none"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
        {showImage ? (
          <img
            src={cover}
            alt={listing.titulo}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${meta.imageGradient} ${
            showImage ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="text-4xl drop-shadow">{meta.icon}</span>
        </div>
        <span
          className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow ${
            isBico ? "bg-papufy-orange" : "bg-slate-800"
          }`}
        >
          {isBico ? "Bico" : "Produto"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-0.5 p-2.5">
        <h3 className="line-clamp-2 text-xs font-bold leading-snug text-papufy-text">
          {listing.titulo}
        </h3>
        <p className="text-sm font-extrabold text-papufy-text">
          {formatPrice(listing.preco ?? null, listing.aCombinar)}
        </p>
        <p className="line-clamp-1 text-[10px] text-papufy-muted">
          {formatLocation(listing.cidade, listing.uf, listing.bairro)}
        </p>
      </div>
    </Link>
  );
}
