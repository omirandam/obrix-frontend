import { useEffect, useState } from "react";
import { IconButton } from "rsuite";
import { HeaderLayout } from "../../layout/HeaderLayout";
import { useAuthStore } from "../../app/store/auth.store";
import { SidebarLayout } from "../../layout/SidebarLayout";
import { useNavigate } from "react-router-dom";
import { Drawer } from "rsuite";
import MenuIcon from "@rsuite/icons/Menu";
import { getUsersByCompany } from "../../services/users.api";
import { UsersList } from "./UsersList";

export function UsersPage() {
  const navigate = useNavigate();
  const companyId = useAuthStore((s) => s.user?.companyId);
  const user = useAuthStore((s) => s.user);
  const company = useAuthStore((s) => s.company);
  const [, setLoading] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    if (!companyId) return;

    (async () => {
      try {
        setLoading(true);
        const data = await getUsersByCompany(companyId);
        setUsers(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  return (
    <div className="min-h-screen min-w-screen bg-slate-900">
      <HeaderLayout legalName={company?.legalName} fullName={user?.fullName} />
      <Drawer
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
        placement="left"
        size="xs"
      >
        <Drawer.Header>
          <Drawer.Title>Menú</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body className="p-0 bg-[#0B1224]">
          <div className="text-white min-h-full">
            <SidebarLayout
              active_module="USUARIOS"
              onNavigate={() => setOpenSidebar(false)}
            />
          </div>
        </Drawer.Body>
      </Drawer>

      <div className="flex w-full">
        <aside className="hidden md:block w-64 bg-[#0B1224] text-white min-h-screen">
          <SidebarLayout
            active_module="USUARIOS"
            onNavigate={() => setOpenSidebar(false)}
          />
        </aside>

        <main className="flex-1 p-4 md:p-10">
          <div className="flex items-center gap-3 md:hidden mb-3">
            <IconButton
              appearance="subtle"
              icon={<MenuIcon />}
              className="text-white!"
              onClick={() => setOpenSidebar(true)}
            />
          </div>
          <h2 className="text-white! text-2xl md:text-3xl font-bold mb-2">
            Gestión de usuarios
          </h2>
          <p className="text-slate-400 pl-1 text-sm md:text-base">
            <span className="cursor-pointer" onClick={() => navigate("/home")}>
              Inicio
            </span>
            {" / "}Gestión de usuarios
          </p>

          <div className="bg-white p-3 md:p-5 mt-5 rounded-md">
            <UsersList
              companyId={companyId}
              onEdit={(u) => alert(u.id)}
              onDelete={(u) => alert(u.id)}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
