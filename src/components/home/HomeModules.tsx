// src/pages/HomeModules.tsx
import React from "react";
import iconoObrix from "@assets/obrix_icono.png";
import { useNavigate } from "react-router-dom";

type ModuleCard = {
  id: string;
  title: string;
  subtitle: string;
  icon: string; // emoji por ahora (luego lo cambiamos por svg)
  enabled: boolean;
  actionLabel: string;
};

const modulesTop: ModuleCard[] = [
  {
    id: "obras",
    title: "Obras",
    subtitle: "Gestión de obras",
    icon: "🏗️",
    enabled: true,
    actionLabel: "Entrar",
  },
  {
    id: "costos",
    title: "Costos",
    subtitle: "Control de gastos",
    icon: "💰",
    enabled: true,
    actionLabel: "Entrar",
  },
  {
    id: "proveedores",
    title: "Proveedores",
    subtitle: "y contratistas",
    icon: "🤝",
    enabled: true,
    actionLabel: "Entrar",
  },
  {
    id: "reportes",
    title: "Reportes",
    subtitle: "Resúmenes",
    icon: "📊",
    enabled: true,
    actionLabel: "Entrar",
  },
  {
    id: "usuarios",
    title: "Usuarios",
    subtitle: "Roles básicos",
    icon: "👥",
    enabled: true,
    actionLabel: "Entrar",
  },
];

function PrimaryButton({
  disabled,
  children,
}: {
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      className="h-11 w-full rounded-lg text-sm font-semibold transition bg-[#E4481C] text-white"
    >
      {children}
    </button>
  );
}

function GhostButton({
  disabled,
  children,
}: {
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      className="h-11 w-full rounded-lg text-sm font-semibold transition border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100"
    >
      {children}
    </button>
  );
}

function ModuleCardView({ m }: { m: ModuleCard }) {
  const isEmpty = m.id === "empty";

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm min-h-[170px] bg-transparent border-transparent shadow-none">
      {!isEmpty && (
        <>
          <div className="flex items-start gap-4">
            <div className="text-3xl leading-none">{m.icon}</div>
            <div className="min-w-0">
              <div className="text-xl font-semibold text-slate-900">
                {m.title}
              </div>
              <div className="mt-2 text-slate-500">{m.subtitle}</div>
            </div>
          </div>

          <div className="mt-6">
            {m.enabled ? (
              // Botón azul como en el mock
              <PrimaryButton>{m.actionLabel}</PrimaryButton>
            ) : (
              // No incluido: botón gris
              <GhostButton>{m.actionLabel}</GhostButton>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function HomeModules() {
  const navigate = useNavigate();
  const handleCerrarSesion = () => {
    navigate("/");
  };
  return (
    <div className="min-h-screen  w-screen bg-slate-900">
      {/* Top bar */}
      <header className=" bg-[#E4481C]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-14 w-14 md:h-16 md:w-16">
              <img
                src={iconoObrix}
                alt="Obrix"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-xl font-semibold text-[white] border-r border-white/100 pr-4">
              Obrix
            </div>
            <span className="text-[white]">Constructora ABC</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-[white]">
                Bienvenido, <strong>Omar Miranda</strong>
              </span>
            </div>

            <a
              onClick={handleCerrarSesion}
              className="text-[white]!  transition cursor-pointer"
            >
              Cerrar sesión
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl mt-10 px-4 pb-14 pt-10">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-[white]">
            Bienvenido a Obrix
          </h1>
          <p className="mt-3 text-slate-500">Selecciona un módulo.</p>
        </div>

        {/* Grid - fila 1 */}
        <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {modulesTop.map((m) => (
            <ModuleCardView key={m.id} m={m} />
          ))}
        </section>
      </main>
    </div>
  );
}
