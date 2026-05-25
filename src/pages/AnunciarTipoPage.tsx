import { useNavigate } from "react-router-dom";
import { MobileShell } from "../components/mobile/MobileShell";
import { ProtectedRoute } from "../components/ProtectedRoute";

function AnunciarTipoContent() {
  const navigate = useNavigate();

  return (
    <MobileShell showSearch={false}>
      <div className="page-container space-y-4 py-6">
        <h1 className="text-xl font-extrabold text-papufy-text">
          O que você quer anunciar?
        </h1>
        <p className="text-sm text-papufy-muted">
          Escolha em um toque — formulário otimizado para celular.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/anunciar", { state: { tipo: "BICO" } })
          }
          className="flex w-full select-none flex-col items-start gap-2 rounded-2xl border-2 border-papufy-orange bg-sky-50 p-6 text-left active:scale-[0.98]"
        >
          <span className="text-3xl">🛠️</span>
          <span className="text-lg font-bold text-papufy-text">
            Oferecer Bico
          </span>
          <span className="text-sm text-papufy-muted">
            Serviços, reformas, aulas e trabalhos na sua região.
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/anunciar", { state: { tipo: "PRODUTO" } })
          }
          className="flex w-full select-none flex-col items-start gap-2 rounded-2xl border border-papufy-border bg-white p-6 text-left shadow-sm active:scale-[0.98]"
        >
          <span className="text-3xl">🛍️</span>
          <span className="text-lg font-bold text-papufy-text">
            Vender Produto
          </span>
          <span className="text-sm text-papufy-muted">
            Eletrônicos, móveis, veículos e itens usados estilo marketplace.
          </span>
        </button>
      </div>
    </MobileShell>
  );
}

export function AnunciarTipoPage() {
  return (
    <ProtectedRoute>
      <AnunciarTipoContent />
    </ProtectedRoute>
  );
}
