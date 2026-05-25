import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { IconChat } from "../icons/NavIcons";

export function HeaderMobile() {
  const { isAuthenticated, user } = useAuth();
  const { unreadCount } = useChat();
  const navigate = useNavigate();

  const initial = user?.nome?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-50 border-b border-papufy-border bg-white/95 backdrop-blur-md">
      <div className="page-container flex h-12 items-center justify-between gap-2 sm:h-14">
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight text-papufy-orange active:scale-95 select-none sm:text-2xl"
        >
          Papufy
        </Link>

        <div className="flex items-center gap-1">
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => navigate("/chat")}
              className="touch-target relative rounded-full p-2 text-papufy-muted transition active:scale-95 active:bg-sky-50"
              aria-label="Chat"
            >
              <IconChat className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-papufy-orange px-1 text-[9px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              isAuthenticated ? navigate("/perfil") : navigate("/entrar")
            }
            className="touch-target flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 to-papufy-orange text-sm font-bold text-white active:scale-95 select-none"
            aria-label="Perfil"
          >
            {initial}
          </button>
        </div>
      </div>
    </header>
  );
}
