import { useAuthStore } from "../app/store/auth.store";
import { useNavigate } from "react-router-dom";

interface Props {
  active_module: string;
  onNavigate?: () => void; // ✅ nuevo
}

export function SidebarLayout({ active_module, onNavigate }: Props) {
  const navigate = useNavigate();
  const modules = useAuthStore((s) => s.modules);

  const handleClick = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <div className="pt-5">
      {modules.map((m) => (
        <div
          key={m.key}
          className={[
            "flex text-[18px] pb-3 items-center gap-2 px-4 py-2 cursor-pointer",
            "hover:bg-[#E4481C]",
            m.key === active_module ? "bg-[#E4481C]" : "",
          ].join(" ")}
          onClick={() => handleClick("/" + m.url)} // ✅ ahora sí navega
        >
          <span>{m.name}</span>
        </div>
      ))}
    </div>
  );
}
