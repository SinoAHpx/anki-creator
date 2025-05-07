import { register, unregister } from "@tauri-apps/plugin-global-shortcut";
import { useSettingsStore } from "@/store/settingsStore";

import { showWindowAndQuery } from "./main-shortcut";

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