import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../app/store/auth.store";

export function RequireAuth() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Espera a que Zustand cargue desde localStorage
  if (!hasHydrated) return null; // o un loader

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
