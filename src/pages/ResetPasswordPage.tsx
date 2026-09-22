import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PapufyLogo } from "../components/PapufyLogo";
import { useToast } from "../context/ToastContext";
import { api } from "../lib/api";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100";

export function ResetPasswordPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(
    () => searchParams.get("token")?.trim() ?? "",
    [searchParams]
  );

  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Link inválido. Solicite um novo e-mail de recuperação.");
      return;
    }
    if (senha !== confirmacao) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const { message } = await api.auth.resetPassword(token, senha);
      showToast(message, "success");
      navigate("/entrar", { replace: true });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Não foi possível redefinir a senha.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-sky-50/30 px-4 py-8 sm:py-12">
      <div className="mx-auto flex w-full max-w-md flex-col">
        <header className="mb-8 flex flex-col items-center text-center">
          <h1 className="m-0">
            <PapufyLogo className="h-12 w-auto max-w-[12rem] object-contain sm:h-14" />
          </h1>
          <p className="mt-4 max-w-xs text-sm text-slate-500">
            Escolha uma nova senha
          </p>
        </header>

        <div className="w-full rounded-2xl border border-sky-100/80 bg-white p-6 shadow-xl shadow-sky-100/50 sm:p-8">
          {!token ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-slate-600">
                Link inválido ou incompleto. Solicite um novo e-mail.
              </p>
              <Link
                to="/esqueci-senha"
                className="inline-block text-sm font-semibold text-sky-600"
              >
                Pedir novo link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Nova senha
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mín. 8 caracteres"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Confirmar senha
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmacao}
                  onChange={(e) => setConfirmacao(e.target.value)}
                  placeholder="Repita a nova senha"
                  className={inputClass}
                />
              </div>

              <p className="text-xs leading-relaxed text-slate-500">
                Use letras e números. O link do e-mail vale por 1 hora.
              </p>

              {error && (
                <p
                  className="rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 py-3.5 text-sm font-bold text-white shadow-md shadow-sky-200/60 transition active:scale-95 disabled:opacity-60"
              >
                {loading ? "Salvando..." : "Salvar nova senha"}
              </button>
            </form>
          )}

          <Link
            to="/entrar"
            className="mt-6 block text-center text-sm font-semibold text-sky-600 active:opacity-80"
          >
            Voltar para entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
