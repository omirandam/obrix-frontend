import { useEffect, useMemo, useState } from "react";
import type { User } from "../../types/auth";
import { Table, IconButton, Pagination, Input } from "rsuite";
import { HeaderLayout } from "../../layout/HeaderLayout";
import { useAuthStore } from "../../app/store/auth.store";
import { PrimaryButton } from "../../layout/PrimaryButton";
import { SidebarLayout } from "../../layout/SidebarLayout";
import PlusIcon from "@rsuite/icons/Plus";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import { useNavigate } from "react-router-dom";
import { Drawer } from "rsuite";
import MenuIcon from "@rsuite/icons/Menu";

const { Column, HeaderCell, Cell } = Table;

// ✅ Mover datos afuera para que NO cambien por render
const data: User[] = [
  {
    id: "1",
    username: "juan",
    fullName: "Juan Pérez",
    email: "juan.perez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "2",
    username: "maria",
    fullName: "Maria Garcia",
    email: "maria.garcia@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "jorge",
    fullName: "Jorge Gutiérrez",
    email: "jorge.guiterrez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "jorge",
    fullName: "Jorge Gutiérrez",
    email: "jorge.guiterrez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "jorge",
    fullName: "Jorge Gutiérrez",
    email: "jorge.guiterrez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "jorge",
    fullName: "Jorge Gutiérrez",
    email: "jorge.guiterrez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "jorge",
    fullName: "Jorge Gutiérrez",
    email: "jorge.guiterrez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "jorge",
    fullName: "Jorge Gutiérrez",
    email: "jorge.guiterrez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "jorge",
    fullName: "Jorge Gutiérrez",
    email: "jorge.guiterrez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "jorge",
    fullName: "Jorge Gutiérrez",
    email: "jorge.guiterrez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "jorge",
    fullName: "Jorge Gutiérrez",
    email: "jorge.guiterrez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "jorge",
    fullName: "Jorge Gutiérrez",
    email: "jorge.guiterrez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "jorge",
    fullName: "Jorge Gutiérrez",
    email: "jorge.guiterrez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "jorge",
    fullName: "Jorge Gutiérrez",
    email: "jorge.guiterrez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "jorge",
    fullName: "Jorge Gutiérrez",
    email: "jorge.guiterrez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "jorge",
    fullName: "Jorge Gutiérrez",
    email: "jorge.guiterrez@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
  {
    id: "3",
    username: "omar",
    fullName: "Omar Miranda",
    email: "omirandam7@gmail.com",
    companyId: "c396378e-d8fe-4252-8ebd-8345b888c635",
  },
];

export function UsersPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const company = useAuthStore((s) => s.company);
  const loading = false;
  const [openSidebar, setOpenSidebar] = useState(false);

  // ============================
  // FILTROS
  // ============================
  const [filterUsername, setFilterUsername] = useState("");
  const [filterFullname, setFilterFullname] = useState("");
  const [filterEmail, setFilterEmail] = useState("");

  // ============================
  // PAGINACIÓN
  // ============================
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // ✅ Cuando cambian filtros, reiniciamos página en un useEffect (NO en useMemo)
  useEffect(() => {
    setPage(1);
  }, [filterFullname, filterUsername, filterEmail]);

  const handlePagination = (page: number) => setPage(page);
  const handleLimit = (limit: number) => {
    setLimit(limit);
    setPage(1);
  };

  const filteredData = useMemo(() => {
    return data
      .filter((x) =>
        x?.fullName?.toLowerCase().includes(filterFullname.toLowerCase())
      )
      .filter((x) =>
        x?.username?.toLowerCase().includes(filterUsername.toLowerCase())
      )
      .filter((x) =>
        x?.email?.toLowerCase().includes(filterEmail.toLowerCase())
      );
  }, [filterFullname, filterUsername, filterEmail]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredData.slice(start, start + limit);
  }, [filteredData, page, limit]);

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
            {/* FILTERS */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
              <div className="w-full md:w-auto">
                <PrimaryButton
                  text="Nuevo Usuario"
                  bg="#E4481C"
                  icon={<PlusIcon />}
                />
              </div>

              <Input
                placeholder="Buscar por nombre..."
                value={filterFullname}
                onChange={setFilterFullname}
                className="w-full md:w-[220px]"
              />

              <Input
                placeholder="Buscar por username..."
                value={filterUsername}
                onChange={setFilterUsername}
                className="w-full md:w-[220px]"
              />

              <Input
                placeholder="Buscar por email..."
                value={filterEmail}
                onChange={setFilterEmail}
                className="w-full md:w-[220px]"
              />
            </div>
            {/* =================   TABLE ================= */}
            <div className="mt-5 overflow-x-auto">
              <Table<User, any>
                data={paginatedData}
                autoHeight
                loading={loading}
                rowHeight={55}
                wordWrap="break-word"
              >
                <Column flexGrow={1}>
                  <HeaderCell>Nombre</HeaderCell>
                  <Cell>{(rowData: User) => rowData?.fullName}</Cell>
                </Column>

                <Column flexGrow={1}>
                  <HeaderCell>Username</HeaderCell>
                  <Cell>{(rowData: User) => rowData?.username}</Cell>
                </Column>

                <Column flexGrow={1}>
                  <HeaderCell>Email</HeaderCell>
                  <Cell>{(rowData: User) => rowData?.email}</Cell>
                </Column>

                <Column width={200} align="center">
                  <HeaderCell>Acciones</HeaderCell>

                  <Cell>
                    {(rowData: User) => (
                      <div className="flex justify-center gap-2">
                        <IconButton
                          appearance="subtle"
                          size="lg"
                          icon={<EditIcon />}
                          onClick={() => {
                            alert(rowData.id);
                          }}
                        />

                        <IconButton
                          appearance="subtle"
                          size="lg"
                          icon={<TrashIcon />}
                          onClick={() => {
                            alert(rowData.id);
                          }}
                        />
                      </div>
                    )}
                  </Cell>
                </Column>
              </Table>
            </div>
            {/* ================= PAGINATION ================= */}
            <div className="w-full flex justify-center mt-5">
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                total={filteredData.length}
                limit={limit}
                limitOptions={[5, 10, 20, 50]}
                activePage={page}
                onChangePage={handlePagination}
                onChangeLimit={handleLimit}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
