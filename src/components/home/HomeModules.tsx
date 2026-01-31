// src/pages/HomeModules.tsx

import { useAuthStore } from "../../app/store/auth.store";
import { HeaderLayout } from "../../layout/HeaderLayout";
import type { Module } from "../../types/auth";
import { ModuleCardView } from "./ModuleCardView";
import imgLogin from "@assets/img-login.jpg";

const modulesTop: Module[] = [
  {
    key: "OBRAS",
    name: "Obras",
    description: "Gestión de obras",
    icon: "🏗️",
    isActive: true,
  },
  {
    key: "COSTOS",
    name: "Costos",
    description: "Control de gastos",
    icon: "💰",
    isActive: true,
  },
  {
    key: "PROVEEDORES",
    name: "Proveedores",
    description: "y contratistas",
    icon: "🤝",
    isActive: true,
  },
  {
    key: "REPORTES",
    name: "Reportes",
    description: "Resúmenes",
    icon: "📊",
    isActive: true,
  },
  {
    key: "USUARIOS",
    name: "Usuarios",
    description: "Roles básicos",
    icon: "👥",
    isActive: true,
    url: "users",
  },
];

export default function HomeModules() {
  const user = useAuthStore((s) => s.user);
  const company = useAuthStore((s) => s.company);
  const modules = useAuthStore((s) => s.modules);

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
          {modulesTop.map(
            (m: Module) =>
              modules.find((m2) => m2.key === m.key)?.isActive && (
                <ModuleCardView modulo={m} url={m.url!} />
              )
          )}
        </section>
      </main>
    </div>
  );
}
