import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { JOB_CATEGORIES, BRAZIL_STATES } from "../constants/categories";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../lib/api";

type Step = 1 | 2 | 3 | 4;

export function CreateJobPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState<string>(JOB_CATEGORIES[0]);
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState(user?.cidade || "Campina Grande");
  const [bairro, setBairro] = useState("");
  const [uf, setUf] = useState(user?.uf || "PB");
  const [preco, setPreco] = useState("");
  const [aCombinar, setACombinar] = useState(false);
  const [telefone, setTelefone] = useState(user?.telefone || "");

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const { job } = await api.jobs.create({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        categoria,
        cep: cep.trim() || undefined,
        cidade: cidade.trim(),
        bairro: bairro.trim() || undefined,
        uf,
        telefone: telefone.trim(),
        aCombinar,
        preco: aCombinar ? null : parsedPreco(),
      });
      showToast("Trabalho publicado com sucesso!", "success");
      navigate(`/trabalho/${job.id}`, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao publicar trabalho.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const parsedPreco = () => {
    const raw = preco.replace(/[^\d,]/g, "").replace(",", ".");
    const num = parseFloat(raw);
    return Number.isFinite(num) ? num : 0;
  };

  const canNext =
    (step === 1 && titulo.length >= 5 && descricao.length >= 20) ||
    (step === 2 && cidade.length >= 2 && uf.length === 2) ||
    (step === 3 && (aCombinar || parsedPreco() > 0)) ||
    step === 4;

  return (
    <Layout showCategories={false}>
      <div className="page-container mx-auto max-w-2xl py-5 sm:py-8">
        <h1 className="text-2xl font-extrabold text-papufy-text">
          Anunciar Trabalho Grátis
        </h1>
        <p className="mt-1 text-sm text-papufy-muted">
          Etapa {step} de 4 — conte o que você precisa
        </p>

        <div className="mt-6 flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                s <= step ? "bg-papufy-orange" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-papufy-border bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-bold text-papufy-text">O que você precisa?</h2>
              <div>
                <label className="text-sm font-medium">Título do trabalho</label>
                <input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Encanador para vazamento na cozinha"
                  className="mt-1 w-full rounded-lg border border-papufy-border px-4 py-3 text-sm outline-none focus:border-papufy-orange"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição detalhada</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={5}
                  placeholder="Descreva o problema, prazo e detalhes importantes..."
                  className="mt-1 w-full rounded-lg border border-papufy-border px-4 py-3 text-sm outline-none focus:border-papufy-orange"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-papufy-border px-4 py-3 text-sm outline-none focus:border-papufy-orange"
                >
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-bold text-papufy-text">Onde?</h2>
              <div>
                <label className="text-sm font-medium">CEP (opcional)</label>
                <input
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  className="mt-1 w-full rounded-lg border border-papufy-border px-4 py-3 text-sm outline-none focus:border-papufy-orange"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Cidade</label>
                  <input
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-papufy-border px-4 py-3 text-sm outline-none focus:border-papufy-orange"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">UF</label>
                  <select
                    value={uf}
                    onChange={(e) => setUf(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-papufy-border px-4 py-3 text-sm outline-none focus:border-papufy-orange"
                  >
                    {BRAZIL_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Bairro (opcional)</label>
                <input
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-papufy-border px-4 py-3 text-sm outline-none focus:border-papufy-orange"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-bold text-papufy-text">Quanto pretende pagar?</h2>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={aCombinar}
                  onChange={(e) => setACombinar(e.target.checked)}
                  className="h-4 w-4 accent-papufy-orange"
                />
                <span className="text-sm">Combinar com o profissional</span>
              </label>
              {!aCombinar && (
                <div>
                  <label className="text-sm font-medium">Orçamento (R$)</label>
                  <input
                    type="number"
                    min={1}
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    placeholder="150"
                    className="mt-1 w-full rounded-lg border border-papufy-border px-4 py-3 text-sm outline-none focus:border-papufy-orange"
                  />
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-bold text-papufy-text">Contato</h2>
              <p className="text-sm text-papufy-muted">
                Profissionais interessados verão este número após clicar em
                &quot;Quero fazer esse trabalho&quot;.
              </p>
              <div>
                <label className="text-sm font-medium">
                  Telefone / WhatsApp
                </label>
                <input
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(83) 99999-9999"
                  className="mt-1 w-full rounded-lg border border-papufy-border px-4 py-3 text-sm outline-none focus:border-papufy-orange"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] -mx-4 mt-6 flex gap-3 border-t border-papufy-border bg-white/95 p-4 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none lg:static">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as Step)}
                className="flex-1 rounded-lg border border-papufy-border py-3 text-sm font-semibold text-papufy-muted hover:bg-gray-50"
              >
                Voltar
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                disabled={!canNext}
                onClick={() => setStep((s) => (s + 1) as Step)}
                className="flex-1 rounded-lg bg-papufy-orange py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                disabled={!telefone.trim() || submitting}
                onClick={handleSubmit}
                className="flex-1 rounded-lg bg-papufy-orange py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {submitting ? "Publicando..." : "Publicar trabalho"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
