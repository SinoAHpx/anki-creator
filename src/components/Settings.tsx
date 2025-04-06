import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Define props for Settings
interface SettingsProps {
  goBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ goBack }) => {
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
      <div className="flex-1">
        <p>Settings page content goes here.</p>
        {/* Add settings options here */}
      </div>
    </div>
  );
};
