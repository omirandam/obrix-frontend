export interface AppModuleConfig {
  key: string;
  icon: string;
  url?: string;
}

export const APP_MODULES: AppModuleConfig[] = [
  {
    key: "OBRAS",
    icon: "🏗️",
    url: "obras",
  },
  {
    key: "COSTOS",
    icon: "💰",
    url: "costos",
  },
  {
    key: "PROVEEDORES",
    icon: "🤝",
    url: "proveedores",
  },
  {
    key: "REPORTES",
    icon: "📊",
    url: "reportes",
  },
  {
    key: "USUARIOS",
    icon: "👥",
    url: "users",
  },
];
