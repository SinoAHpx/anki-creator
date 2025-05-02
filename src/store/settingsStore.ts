import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ShortcutConfig {
    name: string;
    shortcut: string;
    description: string;
    action: string;
}

interface SettingsState {
    shortcuts: ShortcutConfig[];
    startWithSystem: boolean;
    hideDockIcon: boolean;
    hideTrayIcon: boolean;
    updateShortcut: (name: string, newShortcut: string) => void;
    getShortcutByAction: (action: string) => ShortcutConfig | undefined;
    updateStartWithSystem: (value: boolean) => void;
    updateHideDockIcon: (value: boolean) => void;
    updateHideTrayIcon: (value: boolean) => void;
}

// Default shortcuts
const defaultShortcuts: ShortcutConfig[] = [
    {
        name: "quickSearch",
        shortcut: "CommandOrControl+Space",
        description: "Focus search bar",
        action: "focusSearch",
    }
];

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            shortcuts: defaultShortcuts,
            startWithSystem: false,
            hideDockIcon: false,
            hideTrayIcon: false,

            updateShortcut: (name, newShortcut) => {
                set((state) => ({
                    shortcuts: state.shortcuts.map((shortcut) =>
                        shortcut.name === name
                            ? { ...shortcut, shortcut: newShortcut }
                            : shortcut
                    ),
                }));
            },

            getShortcutByAction: (action) => {
                return get().shortcuts.find((shortcut) => shortcut.action === action);
            },

            updateStartWithSystem: (value) => {
                set({ startWithSystem: value });
            },

            updateHideDockIcon: (value) => {
                set({ hideDockIcon: value });
            },

            updateHideTrayIcon: (value) => {
                set({ hideTrayIcon: value });
            },
        }),
        {
            name: "settings-storage",
        }
    )
); 