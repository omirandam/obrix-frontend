import { useEffect, useMemo, useState } from "react";
import type { User } from "../../types/auth";
import { Table, IconButton, Pagination, Input, Button } from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import { getUsersByCompany } from "../../services/users.api";
import PlusIcon from "@rsuite/icons/Plus";

const { Column, HeaderCell, Cell } = Table;

type UsersListProps = {
  companyId?: string;
  onCreate?: () => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  reloadKey?: number;
};

export function UsersList({
  companyId,
  onCreate,
  onEdit,
  onDelete,
  reloadKey,
}: UsersListProps) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // ============================
  // FILTROS
  // ============================
  const [filterUsername, setFilterUsername] = useState("");
  const [filterFullname, setFilterFullname] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filteredData, setFilteredData] = useState<User[]>([]);

  // ============================
  // PAGINACIÓN
  // ============================
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [filterFullname, filterUsername, filterEmail]);

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
  }, [companyId, reloadKey]);

  const handlePagination = (p: number) => setPage(p);
  const handleLimit = (l: number) => {
    setLimit(l);
    setPage(1);
  };

  useEffect(() => {
    const result = users
      .filter((x) =>
        x?.fullName?.toLowerCase().includes(filterFullname.toLowerCase())
      )
      .filter((x) =>
        x?.username?.toLowerCase().includes(filterUsername.toLowerCase())
      )
      .filter((x) =>
        x?.email?.toLowerCase().includes(filterEmail.toLowerCase())
      );

    setFilteredData(result);
  }, [filterFullname, filterUsername, filterEmail, users]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredData.slice(start, start + limit);
  }, [filteredData, page, limit]);

  return (
    <>
      {/* FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
        <div className="w-full md:w-auto">
          <Button
            appearance="primary"
            style={{ background: "#E4481C", borderColor: "#E4481C" }}
            onClick={onCreate}
          >
            <PlusIcon className="mr-3" /> Nuevo Usuario
          </Button>
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

      {/* ================= TABLE ================= */}
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

          <Column flexGrow={1}>
            <HeaderCell>Estado</HeaderCell>
            <Cell>
              {(rowData: User) => (rowData?.isActive ? "Activo" : "Inactivo")}
            </Cell>
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
                    onClick={() => onEdit?.(rowData)}
                  />

                  <IconButton
                    appearance="subtle"
                    size="lg"
                    icon={<TrashIcon />}
                    onClick={() => onDelete?.(rowData)}
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
    </>
  );
}
