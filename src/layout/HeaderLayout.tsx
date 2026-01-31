import iconoObrix from "@assets/obrix_icono.png";
import { useAuthStore } from "../app/store/auth.store";
import { useNavigate } from "react-router-dom";

type HeaderLayoutProps = {
  legalName?: string;
  fullName?: string;
};

export function HeaderLayout({ legalName, fullName }: HeaderLayoutProps) {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    useAuthStore.getState().clearSession();
    navigate("/");
  };

  return (
    <header className=" bg-[#E4481C] p-3">
      <div className="mx-auto flex h-16  items-center justify-between pl-3 pr-10">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-14 w-14 md:h-16 md:w-16">
            <img
              src={iconoObrix}
              alt="Obrix"
              className="h-full w-full object-contain cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>
          <div className="text-xl font-semibold text-[white] border-r border-white/100 pr-4">
            Obrix
          </div>
          <span className="text-[white]">{legalName}</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-[white]">
              Bienvenido, <strong> {fullName}</strong>
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
  );
}
