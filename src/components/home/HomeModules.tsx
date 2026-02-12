// src/pages/HomeModules.tsx

import { useAuthStore } from "../../app/store/auth.store";
import { APP_MODULES, type AppModuleConfig } from "../../config/modules.config";
import { HeaderLayout } from "../../layout/HeaderLayout";
import type { Module } from "../../types/auth";
import { ModuleCardView } from "./ModuleCardView";
import imgLogin from "@assets/img-login.jpg";

export default function HomeModules() {
  const user = useAuthStore((s) => s.user);
  const company = useAuthStore((s) => s.company);
  const modules = useAuthStore((s) => s.modules);

  const obtenerModulo = (m: AppModuleConfig) => {
    debugger;
    const m2 = modules.find((m2) => m2.key === m.key);
    if (!m2) return null;
    return {
      key: m2.key,
      name: m2.name,
      icon: m.icon,
      description: m2.description,
    } as Module;
  };
  return (
    <div
      className="min-h-screen w-screen bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: `url(${imgLogin})` }}
    >
      {/* Top bar */}
      <HeaderLayout legalName={company?.legalName} fullName={user?.fullName} />

      {/* Hero */}
      <main className="mx-auto max-w-6xl mt-10 px-4 pb-14 pt-10">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-[white]!">
            Bienvenido a Obrix
          </h1>
          <p className="mt-3 text-slate-500 text-[18px]">
            Selecciona un módulo.
          </p>
        </div>

        {/* Grid - fila 1 */}
        <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {APP_MODULES.map((m: AppModuleConfig) => {
            const modulo = obtenerModulo(m);
            if (!modulo) return null;
            return <ModuleCardView key={m.key} modulo={modulo} url={m.url!} />;
          })}
        </section>
      </main>
    </div>
  );
}
