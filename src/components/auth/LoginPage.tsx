import { useEffect, useState } from "react";
import imgLogin from "@assets/img-login.jpg";
import iconoObrix from "@assets/obrix_icono.png";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import type { LoginResponse } from "../../types/auth";
import { useAuthStore } from "../../app/store/auth.store";

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    document.title = "Obrix - Login";
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      alert("Completa usuario y contraseña.");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post<LoginResponse>("/auth/login", {
        username: username.trim(),
        password,
      });

      setSession({
        accessToken: data.access_token,
        tokenType: data.token_type,
        user: data.user,
        company: data.company,
        modules: data.modules,
      });

      navigate("/home", { replace: true });
    } catch (error: any) {
      const raw = error?.response?.data?.message;
      const msg = Array.isArray(raw) ? raw.join(", ") : (raw ?? "Login falló");
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/5">
          {/* ✅ Imagen de fondo (full dentro del card grande) */}
          <img
            src={imgLogin}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-left opacity-70"
          />

          {/* ✅ Overlay para legibilidad + fade a la derecha */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-slate-950/70 to-slate-950/95" />

          {/* (Opcional) tus radiales MUY suaves */}
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.22),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(14,165,233,0.12),transparent_50%)]" />
          </div>

          {/* ✅ Contenido arriba de todo */}
          <div className="relative grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 md:p-12">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 md:h-16 md:w-16">
                  <img
                    src={iconoObrix}
                    alt="Obrix"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-2xl font-semibold tracking-wide">
                  OBRIX
                </div>
              </div>

              <p className="mt-6 text-[21px] font-semibold leading-tight text-slate-200/90">
                Gestión inteligente para constructoras
              </p>
            </div>

            <div className="p-10 md:p-12 flex items-center justify-center">
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/50 backdrop-blur p-7 md:p-8 shadow-xl">
                <h2 className="text-2xl font-semibold">Iniciar Sesión</h2>

                <form className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm text-slate-200/80 mb-2">
                      Username
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500/50">
                      <span className="text-slate-300/70">✉️</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        className="w-full bg-transparent outline-none placeholder:text-slate-500 text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-200/80 mb-2">
                      Contraseña
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500/50">
                      <span className="text-slate-300/70">🔒</span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        className="w-full bg-transparent outline-none placeholder:text-slate-500 text-slate-100"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="
                    w-full rounded-xl
                    bg-gradient-to-r from-[#E4481C] to-[#FFB037]
                    py-3 font-semibold text-white
                    shadow-lg shadow-[#E4481C]/30
                    hover:from-[#D63F17] hover:to-[#F5A72F]
                    active:scale-[0.99]
                    transition
                  "
                    onClick={handleLogin}
                  >
                    {isLoading ? "Ingresando..." : "Iniciar sesión"}
                  </button>

                  <div className="mt-4 text-center space-y-3">
                    <a
                      href="#"
                      className="underline underline-offset-4 transition"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>

                    <div className="mt-4">
                      <a
                        href="#"
                        className="underline underline-offset-4 transition"
                      >
                        Contactar soporte
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}
