import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Define props for Library
interface LibraryProps {
  goBack: () => void;
}

export const Library: React.FC<LibraryProps> = ({ goBack }) => {
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
          <h1 className="text-2xl font-bold ml-2">Library</h1>
        </Button>
      </div>
      <div className="flex-1">
        <p>Library page content goes here.</p>
        {/* Add library options here */}
      </div>
    </div>
  );
};
