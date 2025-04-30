import { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { useDictionaryStore } from "@/store/dictionaryStore";
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';

// Define the shortcut event payload
interface ShortcutPayload {
    action: string;
}

export function useShortcuts() {
    const { shortcuts } = useSettingsStore();
    const { askAI, addBookMark } = useDictionaryStore();

    useEffect(() => {
        // Unregister all existing shortcuts first
        const unregisterAll = async () => {
            try {
                await invoke('unregister_all_shortcuts');
            } catch (error) {
                console.error('Failed to unregister shortcuts:', error);
            }
        };

        // Register shortcuts from the settings store
        const registerShortcuts = async () => {
            await unregisterAll();

            for (const shortcut of shortcuts) {
                try {
                    await invoke('register_shortcut', {
                        shortcut: shortcut.shortcut,
                        action: shortcut.action
                    });
                } catch (error) {
                    console.error(`Failed to register shortcut ${shortcut.shortcut}:`, error);
                }
            }
        };

        // Register all shortcuts when the component mounts or shortcuts change
        registerShortcuts();

        // Set up a listener for shortcut events
        const unlisten = listen<ShortcutPayload>('shortcut-triggered', (event) => {
            const { action } = event.payload;

            // Handle different actions
            switch (action) {
                case 'focusSearch':
                    // Focus the search input
                    const searchInput = document.getElementById('search-input');
                    if (searchInput) {
                        searchInput.focus();
                    }
                    break;
                case 'saveToAnki':
                    // Trigger the save to Anki action
                    addBookMark();
                    break;
                case 'askAI':
                    // Trigger the ask AI action
                    askAI();
                    break;
                default:
                    console.log(`Unhandled shortcut action: ${action}`);
            }
        });

        // Cleanup function
        return () => {
            unlisten.then(unlistenFn => unlistenFn());
            unregisterAll();
        };
    }, [shortcuts, askAI, addBookMark]);
} 