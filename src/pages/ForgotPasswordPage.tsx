import { useState } from "react";
import { Link } from "react-router-dom";
import { PapufyLogo } from "../components/PapufyLogo";
import { useToast } from "../context/ToastContext";
import { api } from "../lib/api";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100";

export function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { message } = await api.auth.forgotPassword(email.trim());
      setSent(true);
      showToast(message, "success");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Não foi possível enviar o e-mail.";
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
            Recuperação de senha
          </p>
        </header>

        <div className="w-full rounded-2xl border border-sky-100/80 bg-white p-6 shadow-xl shadow-sky-100/50 sm:p-8">
          {sent ? (
            <div className="space-y-4 text-center">
              <p className="text-sm leading-relaxed text-slate-600">
                Se o e-mail estiver cadastrado, enviamos um link para redefinir a
                senha. Verifique também a caixa de spam.
              </p>
              <Link
                to="/entrar"
                className="inline-block text-sm font-semibold text-sky-600"
              >
                Voltar para entrar
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  E-mail da conta
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  className={inputClass}
                />
              </div>

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
                {loading ? "Enviando..." : "Enviar link"}
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
