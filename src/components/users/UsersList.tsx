import { useEffect, useMemo, useState } from "react";
import type { User } from "../../types/auth";
import {
  Table,
  IconButton,
  Pagination,
  Input,
  Button,
  InputGroup,
  Whisper,
  Tooltip,
} from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import PlusIcon from "@rsuite/icons/Plus";
import SearchIcon from "@rsuite/icons/Search";
import { getUsersByCompany } from "../../services/users.api";
import "./users-list.scss";

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

  useEffect(() => {
    const full = filterFullname.trim().toLowerCase();
    const user = filterUsername.trim().toLowerCase();
    const email = filterEmail.trim().toLowerCase();

    const result = users
      .filter((x) => (full ? x?.fullName?.toLowerCase().includes(full) : true))
      .filter((x) => (user ? x?.username?.toLowerCase().includes(user) : true))
      .filter((x) => (email ? x?.email?.toLowerCase().includes(email) : true));

    setFilteredData(result);
  }, [filterFullname, filterUsername, filterEmail, users]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredData.slice(start, start + limit);
  }, [filteredData, page, limit]);

  const handlePagination = (p: number) => setPage(p);
  const handleLimit = (l: number) => {
    setLimit(l);
    setPage(1);
  };

  // Zebra + hover
  const rowClassName = (_rowData: User, rowIndex?: number) => {
    if (rowIndex == null) return "";
    return rowIndex % 2 === 0 ? "obrix-row-even" : "obrix-row-odd";
  };

  const StatusPill = ({ active }: { active: boolean }) => (
    <span
      className={[
        "inline-flex items-center gap-2",
        "px-3 py-1 rounded-full text-xs font-semibold",
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
      ].join(" ")}
    >
      <span
        className={[
          "w-2 h-2 rounded-full",
          active ? "bg-emerald-500" : "bg-slate-400",
        ].join(" ")}
      />
      {active ? "Activo" : "Inactivo"}
    </span>
  );

  const EmptyState = () => (
    <div className="py-10 text-center">
      <div className="text-slate-900 font-semibold">Sin usuarios</div>
      <div className="text-slate-500 text-sm mt-1">
        Ajusta los filtros o crea un nuevo usuario.
      </div>
      <div className="mt-4">
        <Button
          appearance="primary"
          style={{ background: "#E4481C", borderColor: "#E4481C" }}
          onClick={onCreate}
        >
          <PlusIcon className="mr-2" /> Nuevo Usuario
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      {/* HEADER / FILTERS */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Button
            appearance="primary"
            style={{ background: "#E4481C", borderColor: "#E4481C" }}
            onClick={onCreate}
            className="md:w-auto w-full"
          >
            <PlusIcon className="mr-2" /> Nuevo Usuario
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <InputGroup className="w-full">
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
            <Input
              placeholder="Buscar por nombre..."
              value={filterFullname}
              onChange={setFilterFullname}
            />
          </InputGroup>

          <InputGroup className="w-full">
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
            <Input
              placeholder="Buscar por username..."
              value={filterUsername}
              onChange={setFilterUsername}
            />
          </InputGroup>

          <InputGroup className="w-full">
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
            <Input
              placeholder="Buscar por email..."
              value={filterEmail}
              onChange={setFilterEmail}
            />
          </InputGroup>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-5 overflow-x-auto">
        <Table<User, any>
          className="obrix-users-table"
          rowClassName={rowClassName}
          data={paginatedData}
          loading={loading}
          autoHeight
          rowHeight={56}
          wordWrap="break-word"
          bordered={false}
          cellBordered={false}
          renderEmpty={EmptyState}
        >
          <Column flexGrow={1} minWidth={220}>
            <HeaderCell className="obrix-header-cell">
              <span className="text-[14px]">Nombre</span>
            </HeaderCell>
            <Cell className="obrix-cell">
              {(rowData: User) => (
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900">
                    {rowData?.fullName || "-"}
                  </span>
                  <span className="text-xs text-slate-500">
                    @{rowData?.username || "-"}
                  </span>
                </div>
              )}
            </Cell>
          </Column>

          <Column flexGrow={1} minWidth={240}>
            <HeaderCell className="obrix-header-cell">
              <span className="text-[14px]">Email</span>
            </HeaderCell>
            <Cell className="obrix-cell">
              {(rowData: User) => (
                <span className="text-slate-700">{rowData?.email || "-"}</span>
              )}
            </Cell>
          </Column>

          <Column width={160} align="center">
            <HeaderCell className="obrix-header-cell">
              <span className="text-[14px]">Estado</span>
            </HeaderCell>
            <Cell className="obrix-cell">
              {(rowData: User) => <StatusPill active={!!rowData?.isActive} />}
            </Cell>
          </Column>

          <Column width={160} align="center" fixed="right">
            <HeaderCell className="obrix-header-cell">
              <span className="text-[14px]">Acciones</span>
            </HeaderCell>
            <Cell className="obrix-cell">
              {(rowData: User) => (
                <div className="flex justify-center gap-2">
                  <Whisper placement="top" speaker={<Tooltip>Editar</Tooltip>}>
                    <IconButton
                      appearance="subtle"
                      size="lg"
                      circle
                      icon={<EditIcon />}
                      onClick={() => onEdit?.(rowData)}
                      className="obrix-action-btn obrix-action-edit"
                    />
                  </Whisper>

                  <Whisper
                    placement="top"
                    speaker={<Tooltip>Eliminar</Tooltip>}
                  >
                    <IconButton
                      appearance="subtle"
                      size="lg"
                      circle
                      icon={<TrashIcon />}
                      onClick={() => onDelete?.(rowData)}
                      className="obrix-action-btn obrix-action-delete"
                    />
                  </Whisper>
                </div>
              )}
            </Cell>
          </Column>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-5">
        <div className="text-sm text-slate-500">
          Página {page} · Mostrando {paginatedData.length} de{" "}
          {filteredData.length}
        </div>

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
  );
}
