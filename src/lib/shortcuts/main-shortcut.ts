import { getCurrentWindow } from '@tauri-apps/api/window';
import { useDictionaryStore } from '@/store/dictionaryStore';

declare global {
    interface Window {
        __TAURI__: any;
    }
}

const invoke = window.__TAURI__.core.invoke;
import { readText } from '@tauri-apps/plugin-clipboard-manager';


export async function showWindowAndQuery(searchInputRef: React.RefObject<HTMLInputElement>) {
    const appWindow = getCurrentWindow();
    const { handleSearch, setSearchQuery } = useDictionaryStore.getState() // setSearchQuery might not be needed now

    await appWindow.hide();
    await appWindow.close();

    // It's important to press the copy shortcut *before* showing the new window
    // and trying to read the clipboard, to ensure the correct application context for copy.
    await invoke('press_copy_shortcut');

    // A short delay might be necessary for the clipboard to update reliably
    await new Promise(resolve => setTimeout(resolve, 100));

    const clipboardContent = await readText();

    await appWindow.show();
    await appWindow.setFocus();

    if (searchInputRef.current && clipboardContent) {
        searchInputRef.current.value = clipboardContent; // Set value from clipboard
        searchInputRef.current.focus();
        setSearchQuery(clipboardContent || '');
        handleSearch()
    }

}