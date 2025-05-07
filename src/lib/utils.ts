import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Menu, MenuItem } from '@tauri-apps/api/menu';
import { TrayIcon } from '@tauri-apps/api/tray';
import { exit, relaunch } from '@tauri-apps/plugin-process';
import { getCurrentWindow } from "@tauri-apps/api/window";
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { register, unregister } from "@tauri-apps/plugin-global-shortcut";
import { useSettingsStore } from "@/store/settingsStore";
import { useDictionaryStore } from "@/store/dictionaryStore";
import { showWindowAndQuery } from "./shortcuts/main-shortcut";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function setupTray() {
    const showItem = await MenuItem.new({
        id: 'show', text: 'Show App', action: () => {
            const currentWindow = getCurrentWindow()
            currentWindow.setFocus()
        }
    });
    const quitItem = await MenuItem.new({
        id: 'quit', text: 'Quit', action: () => {
            exit(0)
        },
    });
    const restartItem = await MenuItem.new({
        id: 'restart', text: 'Restart', action: () => {
            relaunch()
        }
    });

    try {
        const tray = await TrayIcon.getById('main')
        if (tray === null) {
            await TrayIcon.new({
                tooltip: 'Anki Creator',
                menu: await Menu.new({
                    items: [showItem, restartItem, quitItem],
                }),
                icon: await defaultWindowIcon() || [],
                id: 'main'
            });
        }
    } catch (e) {
        console.error('Failed to create tray icon:', e);
    }
}

export const registerShortcut = async (searchInputRef: React.RefObject<HTMLInputElement>) => {
    const { getShortcutByAction } = useSettingsStore.getState();
    const shortcut = getShortcutByAction("focusSearch");
    if (!shortcut) return;

    try {
        try {
            await unregister(shortcut.shortcut);
        } catch (e) { }

        await register(shortcut.shortcut, async () => {
            showWindowAndQuery(searchInputRef)
        });
        // console.log(`Registered shortcut: ${shortcut.shortcut}`);
    } catch (error) {
        console.error("Failed to register shortcut:", error);
    }
};