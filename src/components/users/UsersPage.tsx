import { useState } from "react";
import { Button, Drawer, IconButton, Message, Modal, useToaster } from "rsuite";
import MenuIcon from "@rsuite/icons/Menu";
import { useNavigate } from "react-router-dom";

import { HeaderLayout } from "../../layout/HeaderLayout";
import { SidebarLayout } from "../../layout/SidebarLayout";
import { useAuthStore } from "../../app/store/auth.store";

import { UsersList } from "./UsersList";
import type { User } from "../../types/auth";
import { deleteUser } from "../../services/users.api";
import { UsersForm } from "./UsersForm";

type FormMode = "create" | "edit";
export function UsersPage() {
  const navigate = useNavigate();

  const companyId = useAuthStore((s) => s.user?.companyId);
  const user = useAuthStore((s) => s.user);
  const company = useAuthStore((s) => s.company);

  const [openSidebar, setOpenSidebar] = useState(false);

  // ===== LIST REFRESH =====
  const [reloadKey, setReloadKey] = useState<number>(0);

  // ===== TOAST =====
  const toaster = useToaster();
  const showToast = (type: "success" | "error", msg: string) => {
    toaster.push(
      <Message showIcon type={type} closable>
        {msg}
      </Message>,
      { placement: "topEnd", duration: 3000 }
    );
  };

  // ===== DELETE =====
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formValue, setFormValue] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    isActive: true,
  });
  const [mode, setMode] = useState<FormMode>("create");
  const [openForm, setOpenForm] = useState(false);

  const openCreateDrawer = () => {
    setMode("create");
    setSelectedUser(null);
    setFormValue({
      fullName: "",
      username: "",
      email: "",
      password: "",
      isActive: true,
    });
    setOpenForm(true);
  };

  const openEditDrawer = (u: User) => {
    setMode("edit");
    setSelectedUser(u);
    setFormValue({
      fullName: u.fullName ?? "",
      username: u.username ?? "",
      email: u.email ?? "",
      password: "",
      isActive: u.isActive ?? true,
    });
    setOpenForm(true);
  };

  return (
    <div className="min-h-screen min-w-screen bg-slate-900">
      <HeaderLayout legalName={company?.legalName} fullName={user?.fullName} />

      {/* ================= SIDEBAR DRAWER (MOBILE) ================= */}
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

      {/* ================= CREATE / EDIT DRAWER (UNIFIED) ================= */}
      <UsersForm
        mode={mode}
        openForm={openForm}
        formValue={formValue}
        companyId={companyId!}
        selectedUser={selectedUser}
        showToast={showToast}
        setOpenForm={setOpenForm}
        setSelectedUser={setSelectedUser}
        setFormValue={setFormValue}
        setReloadKey={setReloadKey}
      />
      {/* ================= MAIN LAYOUT ================= */}
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
              reloadKey={reloadKey}
              onCreate={openCreateDrawer}
              onEdit={openEditDrawer}
              onDelete={(u) => {
                setSelectedUser(u);
                setOpenDelete(true);
              }}
            />
          </div>
        </main>
      </div>

      {/* ================= DELETE MODAL ================= */}
      <Modal
        open={openDelete}
        onClose={() => {
          if (deleting) return;
          setOpenDelete(false);
          setSelectedUser(null);
        }}
        size="xs"
      >
        <Modal.Header>
          <Modal.Title>Eliminar usuario</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="text-slate-700">
            ¿Seguro que deseas eliminar a{" "}
            <span className="font-semibold">{selectedUser?.fullName}</span>?
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Esta acción no se puede deshacer.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            appearance="subtle"
            disabled={deleting}
            onClick={() => {
              setOpenDelete(false);
              setSelectedUser(null);
            }}
          >
            Cancelar
          </Button>

          <Button
            appearance="primary"
            color="red"
            loading={deleting}
            onClick={async () => {
              if (!selectedUser) return;

              try {
                setDeleting(true);
                await deleteUser(selectedUser.id);

                showToast("success", "Usuario eliminado.");
                setOpenDelete(false);
                setSelectedUser(null);

                // refresca lista
                setReloadKey((x) => x + 1);
              } catch (e: any) {
                showToast(
                  "error",
                  e?.response?.data?.message ?? "Error eliminando usuario."
                );
              } finally {
                setDeleting(false);
              }
            }}
          >
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
