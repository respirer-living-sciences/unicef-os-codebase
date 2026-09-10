import { create } from "zustand";

const THEME_STORAGE_KEY = "theme-mode";

const getInitialThemeMode = () => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
};

const applyThemeModeToDocument = (mode) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", mode);
  }
};

const initialThemeMode = getInitialThemeMode();
applyThemeModeToDocument(initialThemeMode);

export const useStore = create((set, get) => ({
  // user-config state is used in multiple MFEs.
  userConfig: {},
  setUserConfigData: (userConfigData) => set({ userConfig: userConfigData }),

  // use this global state in Sidebar to changeActiveApp state in drawer(Home, Map etc...)
  activeAppTitle: "Home",
  setActiveAppTitle: (activeApp) => set({ activeAppTitle: activeApp }),

  themeMode: initialThemeMode,
  setThemeMode: (mode) => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    applyThemeModeToDocument(mode);
    set({ themeMode: mode });
  },
  toggleThemeMode: () => {
    const nextMode = get().themeMode === "light" ? "dark" : "light";
    get().setThemeMode(nextMode);
  },
}));
