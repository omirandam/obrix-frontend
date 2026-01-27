import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white p-4">
        <h1 className="text-xl font-bold">Obrix</h1>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
