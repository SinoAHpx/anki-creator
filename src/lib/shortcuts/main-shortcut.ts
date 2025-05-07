import { useDictionaryStore } from "@/store/dictionaryStore";
import { getCurrentWindow } from "@tauri-apps/api/window";

export async function showWindowAndQuery(searchInputRef: React.RefObject<HTMLInputElement>) {
    const appWindow = getCurrentWindow();
    const { setSearchQuery } = useDictionaryStore.getState()

    await appWindow.hide()
    await appWindow.close()
    await appWindow.show()
    await appWindow.setFocus();
    searchInputRef.current?.focus();
    setSearchQuery('')
}