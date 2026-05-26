import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MobileShell } from "../components/mobile/MobileShell";
import { useChat } from "../context/ChatContext";
import { api } from "../lib/api";
import type { ConversationSummary } from "../types";
import { formatRelativeTime } from "../utils/format";

export function NotificationsPage() {
  const { unreadCount, refreshUnread } = useChat();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { conversations: list } = await api.chat.conversations();
      setConversations(list);
      await refreshUnread();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar notificações."
      );
    } finally {
      setLoading(false);
    }
  }, [refreshUnread]);

  useEffect(() => {
    void load();
  }, [load]);

  const unreadConversations = conversations.filter((c) => c.unread > 0);
  const readConversations = conversations.filter((c) => c.unread === 0);

  return (
    <MobileShell>
      <div className="mobile-gutter space-y-4 py-4">
        <header>
          <h1 className="text-lg font-bold text-papufy-text">Notificações</h1>
          <p className="mt-1 text-xs text-papufy-muted">
            {unreadCount > 0
              ? `${unreadCount} mensagem${unreadCount > 1 ? "ns" : ""} não lida${unreadCount > 1 ? "s" : ""}`
              : "Você está em dia"}
          </p>
        </header>

        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl bg-slate-200"
              />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-3 text-sm font-bold text-sky-600"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && unreadConversations.length === 0 && readConversations.length === 0 && (
          <p className="rounded-xl border border-dashed border-papufy-border bg-white px-4 py-8 text-center text-sm text-papufy-muted">
            Nenhuma notificação por enquanto.
          </p>
        )}

        {!loading && unreadConversations.length > 0 && (
          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-sky-600">
              Novas
            </h2>
            <ul className="space-y-2">
              {unreadConversations.map((c) => (
                <li key={c.id}>
                  <NotificationItem conversation={c} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {!loading && readConversations.length > 0 && (
          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-papufy-muted">
              Anteriores
            </h2>
            <ul className="space-y-2">
              {readConversations.map((c) => (
                <li key={c.id}>
                  <NotificationItem conversation={c} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </MobileShell>
  );
}

function NotificationItem({
  conversation,
}: {
  conversation: ConversationSummary;
}) {
  const hasUnread = conversation.unread > 0;
  const preview =
    conversation.lastMessage?.content?.trim() || "Nova conversa sobre um anúncio";
  const when = conversation.lastMessage?.createdAt
    ? formatRelativeTime(conversation.lastMessage.createdAt)
    : "";

  return (
    <Link
      to={`/chat/${conversation.id}`}
      className={`flex items-start gap-3 rounded-xl border px-3 py-3 transition active:scale-[0.99] ${
        hasUnread
          ? "border-sky-200 bg-sky-50/80"
          : "border-papufy-border bg-white"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
          hasUnread
            ? "bg-gradient-to-br from-sky-400 to-blue-500"
            : "bg-slate-300"
        }`}
      >
        {conversation.otherUser?.nome?.charAt(0).toUpperCase() ?? "?"}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate text-sm ${
              hasUnread ? "font-bold text-slate-900" : "font-semibold text-slate-700"
            }`}
          >
            {conversation.otherUser?.nome ?? "Usuário"}
          </p>
          {when && (
            <span className="shrink-0 text-[10px] text-papufy-muted">{when}</span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-papufy-muted">{preview}</p>
        {conversation.contextTitulo && (
          <p className="mt-1 truncate text-[10px] font-medium text-sky-600">
            {conversation.contextTitulo}
          </p>
        )}
      </div>
      {hasUnread && (
        <span className="mt-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white">
          {conversation.unread > 9 ? "9+" : conversation.unread}
        </span>
      )}
    </Link>
  );
}
