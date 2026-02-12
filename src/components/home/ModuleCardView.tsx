import { PrimaryButton } from "../../layout/PrimaryButton";
import type { Module } from "../../types/auth";

type ModuleCardViewProps = {
  modulo: Module;
  url: string;
};

export function ModuleCardView({ modulo, url }: ModuleCardViewProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm min-h-[170px] bg-transparent border-transparent shadow-none">
      {
        <>
          <div className="min-w-0">
            <div className="flex justify-left">
              <div className="text-2xl leading-none">{modulo.icon}</div>
              <div className="text-xl font-semibold text-slate-900 pl-2">
                {modulo.name}
              </div>
            </div>
            <div className="mt-2 text-slate-500 text-left mt-5">
              {modulo.description}
            </div>
          </div>

          <div className="mt-6 w-full">
            <PrimaryButton text="Entrar" bg="#E4481C" url={url} />
          </div>
        </>
      }
    </div>
  );
}
