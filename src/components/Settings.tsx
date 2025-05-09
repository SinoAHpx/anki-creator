import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSettingsStore, ShortcutConfig } from "@/store/settingsStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { unregister } from '@tauri-apps/plugin-global-shortcut';
import { Switch } from "@/components/ui/switch";

// Define props for Settings
interface SettingsProps {
  goBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ goBack }) => {
  const {
    shortcuts,
    updateShortcut,
    getShortcutByAction,
    startWithSystem,
    updateStartWithSystem,
    hideDockIcon,
    updateHideDockIcon,
    hideTrayIcon,
    updateHideTrayIcon
  } = useSettingsStore();
  const [editingShortcuts, setEditingShortcuts] = useState<Record<string, string>>({});

  React.useEffect(() => {
    const initialEditing: Record<string, string> = {};
    shortcuts.forEach((shortcut) => {
      initialEditing[shortcut.name] = shortcut.shortcut;
    });
    setEditingShortcuts(initialEditing);
  }, [shortcuts]);

  const handleShortcutChange = (shortcutName: string, value: string) => {
    setEditingShortcuts((prev) => ({
      ...prev,
      [shortcutName]: value,
    }));
  };

  const saveShortcut = async (shortcut: ShortcutConfig) => {
    try {
      const oldShortcut = getShortcutByAction(shortcut.action);
      const newValue = editingShortcuts[shortcut.name];

      if (oldShortcut) {
        try {
          await unregister(oldShortcut.shortcut);
        } catch (error) {
          console.warn(`Failed to unregister old shortcut: ${oldShortcut.shortcut}`, error);
        }
      }

      updateShortcut(shortcut.name, newValue);

      toast.success("Shortcut updated", {
        description: `${shortcut.description} is now ${newValue}`,
      });
    } catch (error) {
      console.error("Error updating shortcut:", error);
      toast.error("Failed to update shortcut", {
        description: "An error occurred while updating the shortcut.",
      });
    }
  };

  const handleToggleChange = (setting: 'startWithSystem' | 'hideDockIcon' | 'hideTrayIcon', value: boolean) => {
    try {
      switch (setting) {
        case 'startWithSystem':
          updateStartWithSystem(value);
          toast.success(value ? "App will start with system" : "App will not start with system");
          break;
        case 'hideDockIcon':
          updateHideDockIcon(value);
          toast.success(value ? "Dock icon will be hidden" : "Dock icon will be shown");
          break;
        case 'hideTrayIcon':
          updateHideTrayIcon(value);
          toast.success(value ? "Tray icon will be hidden" : "Tray icon will be shown");
          break;
      }
    } catch (error) {
      console.error(`Error updating ${setting}:`, error);
      toast.error(`Failed to update ${setting}`, {
        description: "An error occurred while updating the setting.",
      });
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          className="mr-2 flex items-center w-auto p-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Go Back</span>
          <h1 className="text-2xl font-bold ml-2">Settings</h1>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Integration</CardTitle>
            <CardDescription>
              Configure how the app integrates with your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="start-with-system">Start with system</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically start the app when you log in
                  </p>
                </div>
                <Switch
                  id="start-with-system"
                  checked={startWithSystem}
                  onCheckedChange={(checked) => handleToggleChange('startWithSystem', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hide-dock-icon">Hide dock icon</Label>
                  <p className="text-sm text-muted-foreground">
                    Hide the app icon from the dock/taskbar
                  </p>
                </div>
                <Switch
                  id="hide-dock-icon"
                  checked={hideDockIcon}
                  onCheckedChange={(checked) => handleToggleChange('hideDockIcon', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hide-tray-icon">Hide tray icon</Label>
                  <p className="text-sm text-muted-foreground">
                    Hide the app icon from the system tray/menu bar
                  </p>
                </div>
                <Switch
                  id="hide-tray-icon"
                  checked={hideTrayIcon}
                  onCheckedChange={(checked) => handleToggleChange('hideTrayIcon', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card>
          <CardHeader>
            <CardTitle>Keyboard Shortcuts</CardTitle>
            <CardDescription>
              Configure keyboard shortcuts for common actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.name} className="flex flex-col space-y-2">
                  <Label htmlFor={`shortcut-${shortcut.name}`}>
                    {shortcut.description}
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id={`shortcut-${shortcut.name}`}
                      value={editingShortcuts[shortcut.name] || ""}
                      onChange={(e) =>
                        handleShortcutChange(shortcut.name, e.target.value)
                      }
                      placeholder="Enter keyboard shortcut"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => saveShortcut(shortcut)}
                    >
                      Save
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Format: CommandOrControl+Key (e.g., CommandOrControl+S)
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add more settings sections here */}
      </div>
    </div>
  );
};
