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
    updateShortcut: (name: string, newShortcut: string) => void;
    getShortcutByAction: (action: string) => ShortcutConfig | undefined;
}

// Default shortcuts
const defaultShortcuts: ShortcutConfig[] = [
    {
        name: "quickSearch",
        shortcut: "CommandOrControl+Space",
        description: "Focus search bar",
        action: "focusSearch",
    },
    {
        name: "saveToAnki",
        shortcut: "CommandOrControl+S",
        description: "Save current word to Anki",
        action: "saveToAnki",
    },
    {
        name: "askAI",
        shortcut: "CommandOrControl+A",
        description: "Generate AI explanation",
        action: "askAI",
    },
];

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            shortcuts: defaultShortcuts,

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
        }),
        {
            name: "settings-storage",
        }
    )
); 