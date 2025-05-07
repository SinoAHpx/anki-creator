import { Menu, MenuItem } from '@tauri-apps/api/menu';
import { TrayIcon } from '@tauri-apps/api/tray';
import { exit, relaunch } from '@tauri-apps/plugin-process';
import { getCurrentWindow } from '@tauri-apps/api/window'
import { defaultWindowIcon } from '@tauri-apps/api/app';

export async function setupTray() {
    console.log('registering shortcuts....')
    try {
        const showItem = await MenuItem.new({
            id: 'show', text: 'Show Apps', action: async () => {
                const currentWindow = getCurrentWindow()
                await currentWindow.show()
                await currentWindow.setFocus()
                console.log('click me')
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

        const tray = await TrayIcon.getById('main')
        console.log('tray: ' + tray?.id)
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