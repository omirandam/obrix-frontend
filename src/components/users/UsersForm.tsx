import { useState } from "react";
import type { User } from "../../types/auth";
import { Button, Drawer, Form, ButtonToolbar } from "rsuite";

import { createUser, updateUser } from "../../services/users.api";

type UsersFormProps = {
  mode: string;
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
  // ===== CREATE / EDIT (UNIFIED) =====
  const [savingForm, setSavingForm] = useState(false);

  return (
    <Drawer
      open={openForm}
      onClose={() => {
        if (savingForm) return;
        setOpenForm(false);
        if (mode === "edit") setSelectedUser(null);
        // limpia password por seguridad
        setFormValue((prev: any) => ({ ...prev, password: "" }));
      }}
      placement="right"
      size="sm"
    >
      <Drawer.Header>
        <Drawer.Title>
          {mode === "create" ? "Nuevo usuario" : "Editar usuario"}
        </Drawer.Title>
      </Drawer.Header>

      <Drawer.Body className="bg-white">
        <Form
          fluid
          formValue={formValue}
          onChange={(v) => setFormValue(v as any)}
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
            <Form.ControlLabel>
              {mode === "create" ? "Password" : "Nueva password (opcional)"}
            </Form.ControlLabel>
            <Form.Control
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder={
                mode === "create" ? "••••••••" : "Dejar vacío para no cambiar"
              }
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
                  onChange={(e) => props.onChange?.(e.target.value === "true")}
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
                disabled={savingForm}
                onClick={() => {
                  setOpenForm(false);
                  setFormValue((prev: any) => ({ ...prev, password: "" }));
                }}
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

                    // refresca lista
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
          </div>
        </Form>
      </Drawer.Body>
    </Drawer>
  );
}
