import { Navigate } from "react-router-dom";

/** Mesma experiência de saque em /carteira (menu Carteira). */
export function ProfileWalletPage() {
  return <Navigate to="/carteira" replace />;
}
