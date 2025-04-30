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

// Define props for Settings
interface SettingsProps {
  goBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ goBack }) => {
  const { shortcuts, updateShortcut } = useSettingsStore();
  const [editingShortcuts, setEditingShortcuts] = useState<Record<string, string>>({});

  // Initialize editing shortcuts state
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

  const saveShortcut = (shortcut: ShortcutConfig) => {
    const newValue = editingShortcuts[shortcut.name];
    updateShortcut(shortcut.name, newValue);
    toast.success("Shortcut updated", {
      description: `${shortcut.description} is now ${newValue}`,
    });
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
      <div className="flex-1 overflow-y-auto">
        <Card className="mb-6">
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
