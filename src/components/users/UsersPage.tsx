import { useState } from "react";
import {
  Button,
  ButtonToolbar,
  Form,
  IconButton,
  useToaster,
  Message,
  Modal,
} from "rsuite";
import { HeaderLayout } from "../../layout/HeaderLayout";
import { useAuthStore } from "../../app/store/auth.store";
import { SidebarLayout } from "../../layout/SidebarLayout";
import { useNavigate } from "react-router-dom";
import { Drawer } from "rsuite";
import MenuIcon from "@rsuite/icons/Menu";
import { UsersList } from "./UsersList";
import { createUser, deleteUser, updateUser } from "../../services/users.api";
import type { User } from "../../types/auth";

export function UsersPage() {
  const navigate = useNavigate();
  const companyId = useAuthStore((s) => s.user?.companyId);
  const user = useAuthStore((s) => s.user);
  const company = useAuthStore((s) => s.company);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    isActive: true,
  });
  const toaster = useToaster();
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: "",
    username: "",
    email: "",
    isActive: true,
    password: "", // opcional: solo si vas a permitir cambiarla
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const showToast = (type: "success" | "error", msg: string) => {
    toaster.push(
      <Message showIcon type={type} closable>
        {msg}
      </Message>,
      { placement: "topEnd", duration: 3000 }
    );
  };
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

      <Drawer
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        placement="right"
        size="sm"
      >
        <Drawer.Header>
          <Drawer.Title>Nuevo usuario</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body className="bg-white">
          <Form
            fluid
            formValue={createForm}
            onChange={(v) => setCreateForm(v as any)}
          >
            <Form.Group controlId="fullName">
              <Form.ControlLabel>Nombre completo</Form.ControlLabel>
              <Form.Control name="fullName" placeholder="Ej: Juan Pérez" />
            </Form.Group>

            <Form.Group controlId="username">
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Form.Control name="username" placeholder="Ej: jperez" />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control
                name="email"
                type="email"
                placeholder="Ej: jperez@mail.com"
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
              />
            </Form.Group>

            <Form.Group controlId="isActive">
              <Form.ControlLabel>Estado</Form.ControlLabel>
              <Form.Control
                name="isActive"
                accepter={(props: any) => (
                  <select
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                    value={String(props.value)}
                    onChange={(e) =>
                      props.onChange?.(e.target.value === "true")
                    }
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                )}
              />
            </Form.Group>

            <div className="mt-6">
              <ButtonToolbar className="flex justify-end gap-2">
                <Button
                  appearance="subtle"
                  onClick={() => setOpenCreate(false)}
                >
                  Cancelar
                </Button>

                <Button
                  appearance="primary"
                  loading={saving}
                  style={{ background: "#E4481C", borderColor: "#E4481C" }}
                  onClick={async () => {
                    if (!companyId) {
                      showToast("error", "No se encontró companyId.");
                      return;
                    }

                    // validación mínima
                    if (
                      !createForm.fullName ||
                      !createForm.username ||
                      !createForm.email ||
                      !createForm.password
                    ) {
                      showToast("error", "Completa todos los campos.");
                      return;
                    }

                    try {
                      setSaving(true);

                      await createUser({
                        companyId,
                        fullName: createForm.fullName.trim(),
                        username: createForm.username.trim(),
                        email: createForm.email.trim(),
                        password: createForm.password,
                        isActive: createForm.isActive,
                      });

                      showToast("success", "Usuario creado.");
                      setOpenCreate(false);

                      // refresca lista
                      setReloadKey((x) => x + 1);
                    } catch (e: any) {
                      showToast(
                        "error",
                        e?.response?.data?.message ?? "Error creando usuario."
                      );
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  Crear usuario
                </Button>
              </ButtonToolbar>
            </div>
          </Form>
        </Drawer.Body>
      </Drawer>

      <Drawer
        open={openEdit}
        onClose={() => {
          if (savingEdit) return;
          setOpenEdit(false);
          setSelectedUser(null);
        }}
        placement="right"
        size="sm"
      >
        <Drawer.Header>
          <Drawer.Title>Editar usuario</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body className="bg-white">
          <Form
            fluid
            formValue={editForm}
            onChange={(v) => setEditForm(v as any)}
          >
            <Form.Group controlId="fullName">
              <Form.ControlLabel>Nombre completo</Form.ControlLabel>
              <Form.Control name="fullName" placeholder="Ej: Juan Pérez" />
            </Form.Group>

            <Form.Group controlId="username">
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Form.Control name="username" placeholder="Ej: jperez" />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control
                name="email"
                type="email"
                placeholder="Ej: jperez@mail.com"
              />
            </Form.Group>

            <Form.Group controlId="isActive">
              <Form.ControlLabel>Estado</Form.ControlLabel>
              <Form.Control
                name="isActive"
                accepter={(props: any) => (
                  <select
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                    value={String(props.value)}
                    onChange={(e) =>
                      props.onChange?.(e.target.value === "true")
                    }
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                )}
              />
            </Form.Group>

            {/* Opcional: Cambiar password (si tu backend lo soporta) */}
            <Form.Group controlId="password">
              <Form.ControlLabel>Nueva password (opcional)</Form.ControlLabel>
              <Form.Control
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Dejar vacío para no cambiar"
              />
            </Form.Group>

            <div className="mt-6">
              <ButtonToolbar className="flex justify-end gap-2">
                <Button
                  appearance="subtle"
                  disabled={savingEdit}
                  onClick={() => setOpenEdit(false)}
                >
                  Cancelar
                </Button>

                <Button
                  appearance="primary"
                  loading={savingEdit}
                  style={{ background: "#E4481C", borderColor: "#E4481C" }}
                  onClick={async () => {
                    if (!selectedUser) return;

                    // validación mínima
                    if (
                      !editForm.fullName ||
                      !editForm.username ||
                      !editForm.email
                    ) {
                      showToast("error", "Completa nombre, username y email.");
                      return;
                    }

                    try {
                      setSavingEdit(true);

                      // payload: solo lo que vas a permitir actualizar
                      const payload: any = {
                        fullName: editForm.fullName.trim(),
                        username: editForm.username.trim(),
                        email: editForm.email.trim(),
                        isActive: editForm.isActive,
                      };

                      // solo manda password si el usuario la escribió
                      if (editForm.password?.trim()) {
                        payload.password = editForm.password;
                      }

                      await updateUser(selectedUser.id, payload);

                      showToast("success", "Usuario actualizado.");
                      setOpenEdit(false);
                      setSelectedUser(null);

                      // refresca lista
                      setReloadKey((x) => x + 1);
                    } catch (e: any) {
                      showToast(
                        "error",
                        e?.response?.data?.message ??
                          "Error actualizando usuario."
                      );
                    } finally {
                      setSavingEdit(false);
                    }
                  }}
                >
                  Guardar cambios
                </Button>
              </ButtonToolbar>
            </div>
          </Form>
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
              onEdit={(u) => {
                setSelectedUser(u);
                setEditForm({
                  fullName: u.fullName ?? "",
                  username: u.username ?? "",
                  email: u.email ?? "",
                  isActive: u.isActive ?? true,
                  password: "",
                });
                setOpenEdit(true);
              }}
              onDelete={(u) => {
                setSelectedUser(u);
                setOpenDelete(true);
              }}
              onCreate={() => {
                setCreateForm({
                  fullName: "",
                  username: "",
                  email: "",
                  password: "",
                  isActive: true,
                });
                setOpenCreate(true);
              }}
              reloadKey={reloadKey}
            />
          </div>
        </main>
      </div>

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
