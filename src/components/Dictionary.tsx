import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { ThemeToggle } from "./ThemeToggle";

interface Definition {
  id: number;
  text: string;
}

interface DictionaryProps {
  word?: string;
  pronunciation?: string;
  partOfSpeech?: string;
  definitions?: Definition[];
}

export function Dictionary({
  word = "Exploitation",
  pronunciation = "/,eksplɔɪˈteɪʃn/",
  partOfSpeech = "noun",
  definitions = [
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus laoreet rutrum lobortis. Etiam lobortis auctor velit tempus posuere. Vestibulum sodales turpis rutrum velit rhoncus gravida. Aliquam mollis ligula eros, et facilisis metus semper sit amet. Proin pulvinar placerat magna. Nunc a massa tellus. Morbi a ultrices libero. Etiam egestas eleifend dignissim. Donec venenatis leo vitae efficitur accumsan.",
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus laoreet rutrum lobortis. Etiam lobortis auctor velit tempus posuere. Vestibulum sodales turpis rutrum velit rhoncus gravida. Aliquam mollis ligula eros, et facilisis metus semper sit amet. Proin pulvinar placerat magna. Nunc a massa tellus. Morbi a ultrices libero. Etiam egestas eleifend dignissim. Donec venenatis leo vitae efficitur accumsan.",
    },
    {
      id: 3,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus laoreet rutrum lobortis. Etiam lobortis auctor velit tempus posuere. Vestibulum sodales turpis rutrum velit rhoncus gravida. Aliquam mollis ligula eros, et facilisis metus semper sit amet. Proin pulvinar placerat magna. Nunc a massa tellus. Morbi a ultrices libero. Etiam egestas eleifend dignissim. Donec venenatis leo vitae efficitur accumsan.",
    },
  ],
}: DictionaryProps) {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <header className="border-b p-3 relative">
        <h1 className="text-xl font-semibold text-center">The dictionary</h1>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r flex flex-col p-4 space-y-4 bg-muted/20">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full rounded-md"
            />
            <Button className="w-full rounded-md font-normal">Query</Button>
            <Button variant="outline" className="w-full rounded-md font-normal">
              Library
            </Button>
          </div>
          <div className="flex-1"></div>
          <Button
            variant="outline"
            className="w-full mt-auto rounded-md font-normal"
          >
            Settings
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 overflow-auto">
          <h2 className="text-5xl font-bold mb-4">{word}</h2>

          <div className="flex items-center gap-8 mb-6 text-muted-foreground">
            <span className="text-lg">{pronunciation}</span>
            <span className="text-lg">{partOfSpeech}</span>
          </div>

          <Separator className="my-6" />

          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-8">
              {definitions.map((definition) => (
                <div key={definition.id} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <div className="h-5 w-5 rounded-full bg-primary/70"></div>
                  </div>
                  <p className="text-base leading-relaxed">{definition.text}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
