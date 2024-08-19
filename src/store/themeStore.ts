
import { create } from "zustand";

interface ThemeStoreState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const useThemeStore = create<ThemeStoreState>()((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useThemeStore;
