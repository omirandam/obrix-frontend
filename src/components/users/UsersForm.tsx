import { useMemo, useState } from "react";
import type { User } from "../../types/auth";
import {
  Button,
  Drawer,
  Form,
  ButtonToolbar,
  SelectPicker,
  Divider,
} from "rsuite";
import "./users-form.scss";
import { createUser, updateUser } from "../../services/users.api";

type UsersFormProps = {
  mode: "create" | "edit";
  openForm: boolean;
  formValue: any;
  companyId: string;
  selectedUser: User | null;
  showToast: (v: "success" | "error", m: string) => void;
  setOpenForm: (v: boolean) => void;
  setSelectedUser: (u: User | null) => void;
  setFormValue: (v: any) => void;
  setReloadKey: (v: any) => void;
};

export function UsersForm({
  mode,
  openForm,
  formValue,
  companyId,
  selectedUser,
  showToast,
  setOpenForm,
  setSelectedUser,
  setFormValue,
  setReloadKey,
}: UsersFormProps) {
  const [savingForm, setSavingForm] = useState(false);

  const statusOptions = useMemo(
    () => [
      { label: "Activo", value: true },
      { label: "Inactivo", value: false },
    ],
    []
  );

  const closeDrawer = () => {
    if (savingForm) return;
    setOpenForm(false);
    if (mode === "edit") setSelectedUser(null);
    // limpia password por seguridad
    setFormValue((prev: any) => ({ ...prev, password: "" }));
  };

  return (
    <Drawer
      open={openForm}
      onClose={closeDrawer}
      placement="right"
      size="sm"
      className="obrix-users-drawer"
    >
      <Drawer.Header className="obrix-users-drawer__header bg-[#E4481C]">
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="min-w-0">
            <Drawer.Title className="obrix-users-drawer__title pl-10 text-white!">
              {mode === "create" ? "Nuevo usuario" : "Editar usuario"}
            </Drawer.Title>
            <div className="text-sm text-amber-100 pl-10">
              {mode === "create"
                ? "Completa la información para crear el usuario."
                : "Actualiza los datos del usuario seleccionado."}
            </div>
          </div>
        </div>
      </Drawer.Header>

      <Drawer.Body className="bg-white">
        <div className="px-1">
          <Form
            fluid
            formValue={formValue}
            onChange={(v) => setFormValue(v as any)}
          >
            <div className="grid grid-cols-1 gap-4">
              <Form.Group controlId="fullName">
                <Form.ControlLabel className="text-slate-700">
                  Nombre completo
                </Form.ControlLabel>
                <Form.Control
                  name="fullName"
                  placeholder="Ej: Juan Pérez"
                  className="obrix-input"
                />
              </Form.Group>

              <Form.Group controlId="username">
                <Form.ControlLabel className="text-slate-700">
                  Username
                </Form.ControlLabel>
                <Form.Control
                  name="username"
                  placeholder="Ej: jperez"
                  className="obrix-input"
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.ControlLabel className="text-slate-700">
                  Email
                </Form.ControlLabel>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Ej: jperez@mail.com"
                  className="obrix-input"
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.ControlLabel className="text-slate-700">
                  {mode === "create" ? "Password" : "Nueva password (opcional)"}
                </Form.ControlLabel>
                <Form.Control
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder={
                    mode === "create"
                      ? "••••••••"
                      : "Dejar vacío para no cambiar"
                  }
                  className="obrix-input"
                />
                {mode === "edit" && (
                  <div className="text-xs text-slate-500 mt-1">
                    Si no quieres cambiarla, deja este campo vacío.
                  </div>
                )}
              </Form.Group>

              <Form.Group controlId="isActive">
                <Form.ControlLabel className="text-slate-700">
                  Estado
                </Form.ControlLabel>

                <Form.Control
                  name="isActive"
                  accepter={SelectPicker}
                  data={statusOptions}
                  searchable={false}
                  cleanable={false}
                  placement="autoVertical"
                  style={{ width: "100%" }}
                  className="obrix-select"
                />
              </Form.Group>
            </div>

            <Divider className="!my-6" />

            <ButtonToolbar className="flex justify-end gap-2">
              <Button
                appearance="subtle"
                disabled={savingForm}
                onClick={closeDrawer}
              >
                Cancelar
              </Button>

              <Button
                appearance="primary"
                loading={savingForm}
                style={{ background: "#E4481C", borderColor: "#E4481C" }}
                onClick={async () => {
                  if (!companyId) {
                    showToast("error", "No se encontró companyId.");
                    return;
                  }

                  if (
                    !formValue.fullName ||
                    !formValue.username ||
                    !formValue.email
                  ) {
                    showToast("error", "Completa nombre, username y email.");
                    return;
                  }

                  if (mode === "create" && !formValue.password) {
                    showToast("error", "La password es requerida.");
                    return;
                  }

                  try {
                    setSavingForm(true);

                    if (mode === "create") {
                      await createUser({
                        companyId,
                        fullName: formValue.fullName.trim(),
                        username: formValue.username.trim(),
                        email: formValue.email.trim(),
                        password: formValue.password,
                        isActive: formValue.isActive,
                      });

                      showToast("success", "Usuario creado.");
                    } else {
                      if (!selectedUser) return;

                      const payload: any = {
                        fullName: formValue.fullName.trim(),
                        username: formValue.username.trim(),
                        email: formValue.email.trim(),
                        isActive: formValue.isActive,
                      };

                      if (formValue.password?.trim()) {
                        payload.password = formValue.password;
                      }

                      await updateUser(selectedUser.id, payload);

                      showToast("success", "Usuario actualizado.");
                    }

                    setOpenForm(false);
                    setSelectedUser(null);
                    setFormValue((prev: any) => ({ ...prev, password: "" }));
                    setReloadKey((x: any) => x + 1);
                  } catch (e: any) {
                    showToast(
                      "error",
                      e?.response?.data?.message ??
                        (mode === "create"
                          ? "Error creando usuario."
                          : "Error actualizando usuario.")
                    );
                  } finally {
                    setSavingForm(false);
                  }
                }}
              >
                {mode === "create" ? "Crear usuario" : "Guardar cambios"}
              </Button>
            </ButtonToolbar>
          </Form>
        </div>
      </Drawer.Body>
    </Drawer>
  );
}
