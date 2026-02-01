import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, Module, Company } from "../../types/auth";

type AuthState = {
  accessToken: string | null;
  tokenType: string | null;
  user: User | null;
  company: Company | null;
  modules: Module[];

  // evita que el UI "piense" que está vacío antes de rehidratar
  hasHydrated: boolean;

  // derivado simple (sin getter)
  isAuthenticated: boolean;

  setSession: (payload: {
    accessToken: string;
    tokenType: string;
    user: User;
    company: Company;
    modules: Module[];
  }) => void;

  clearSession: () => void;

  setHasHydrated: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      tokenType: null,
      user: null,
      company: null,
      modules: [],

      hasHydrated: false,

      isAuthenticated: false,

      setHasHydrated: (v) => set({ hasHydrated: v }),

      setSession: ({ accessToken, tokenType, user, company, modules }) =>
        set({
          accessToken,
          tokenType,
          user,
          company,
          modules,
          isAuthenticated: true,
        }),

      clearSession: () =>
        set({
          accessToken: null,
          tokenType: null,
          user: null,
          company: null,
          modules: [],
          isAuthenticated: false,
        }),
    }),
    {
      name: "obrix-auth",
      storage: createJSONStorage(() => localStorage),

      // por seguridad: solo persistimos lo necesario
      partialize: (state) => ({
        accessToken: state.accessToken,
        tokenType: state.tokenType,
        user: state.user,
        company: state.company,
        modules: state.modules,
        isAuthenticated: state.isAuthenticated,
      }),

      onRehydrateStorage: () => (state) => {
        // cuando termina de rehidratar
        state?.setHasHydrated(true);
      },
    }
  )
);
