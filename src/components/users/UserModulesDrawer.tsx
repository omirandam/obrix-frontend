import { useEffect, useState } from "react";
import { Drawer, Button, CheckboxGroup, Checkbox, Loader } from "rsuite";
import type { User } from "../../types/auth";
import {
  getAvailableModulesForUser,
  getUserModules,
  setUserModules,
} from "../../services/users.api";

type Props = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSaved: () => void;
  showToast: (type: "success" | "error", msg: string) => void;
};

export function UserModulesDrawer({
  open,
  user,
  onClose,
  onSaved,
  showToast,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modules, setModules] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!open || !user) return;

    (async () => {
      try {
        setLoading(true);

        const [available, assigned] = await Promise.all([
          getAvailableModulesForUser(user.id),
          getUserModules(user.id),
        ]);

        setModules(available);
        setSelected(assigned.map((m: any) => m.id));
      } catch (e: any) {
        showToast("error", "Error cargando módulos.");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      await setUserModules(user.id, selected);
      showToast("success", "Módulos actualizados.");
      onSaved();
      onClose();
    } catch (e: any) {
      showToast(
        "error",
        e?.response?.data?.message ?? "Error guardando módulos."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer open={open} onClose={onClose} size="sm">
      <Drawer.Header className="bg-[#E4481C]">
        <Drawer.Title className="text-white!">
          Módulos de {user?.fullName}
        </Drawer.Title>
      </Drawer.Header>

      <Drawer.Body style={{ padding: 0 }}>
        {/* contenedor principal */}
        <div
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          {/* contenido scrolleable */}
          <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
            {loading ? (
              <Loader center />
            ) : (
              <CheckboxGroup
                value={selected}
                onChange={(v) => setSelected(v as string[])}
              >
                <div className="flex flex-col gap-3">
                  {modules.map((m) => (
                    <>
                      <Checkbox key={m.id} value={m.id}>
                        <span className=" text-[18px] font-semibold">
                          {m.name}
                        </span>
                      </Checkbox>
                      <span className="text-xs text-slate-500 ml-2 pl-5">
                        {m.description}
                      </span>
                    </>
                  ))}
                </div>
              </CheckboxGroup>
            )}
          </div>

          {/* ✅ footer propio SIEMPRE visible */}
          <div
            style={{
              borderTop: "1px solid #eee",
              padding: 16,
              background: "#fff",
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              position: "sticky",
              bottom: 0,
              zIndex: 10,
            }}
          >
            <Button appearance="subtle" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              appearance="primary"
              style={{ background: "#E4481C", borderColor: "#E4481C" }}
              loading={saving}
              onClick={handleSave}
            >
              Guardar
            </Button>
          </div>
        </div>
      </Drawer.Body>
    </Drawer>
  );
}
