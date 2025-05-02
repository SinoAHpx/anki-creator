## Dictionary App with Anki Integration

> A comprehensive dictionary application with Anki flashcard integration.

> This application allows users to look up words in a dictionary, get AI-powered explanations, and create Anki flashcards directly from the dictionary entries.

> In active development.

> Developed by a solo developer.

> React, TypeScript, Tauri, Zustand, Shadcn/UI, Bun


## Dependencies (from package.json)

* react (^18.3.0): UI library
* openai (^4.36.0): OpenAI API client for AI assistance
* zustand (^4.5.0): State management
* yanki-connect (^0.1.12): Client for connecting to Anki flashcard application
* shadcn/ui: Component library
* tauri (^2.0.0): Desktop application framework
* @tauri-apps/plugin-global-shortcut (^2.0.0): Tauri global shortcut plugin
* vite (^5.0.10): Build tool
* typescript (^5.3.3): Type system


## Development Environment

> This project uses Bun as the package manager.
> The project is built with Vite and Tauri for desktop integration.
> Development server can be started with `bun run dev`.


## Features

> Dictionary lookup with local cache support
> Search history with persistence
> Resizable sidebar interface
> Anki flashcard integration
> AI-powered word explanations
> Global keyboard shortcuts for improved workflow
> System tray menu with restart option
> Search field focus with keyboard shortcut
> Complete search history with date grouping in Library view
> Visual tracking of words added to Anki
> System integration settings (start with system, hide dock icon, hide tray icon)


## Structure

```
root
- .gitignore # Git ignore file
- .prettierrc # Prettier configuration
- README.md # Project documentation
- biome.json # Biome linter configuration
- bun.lock # Bun lock file
- components.json # Shadcn/UI components configuration
- index.html # Main HTML entry point
- package.json # Project dependencies and scripts
- public
    - dictionary_cache.json # Local cache of dictionary entries
    - tauri.svg # Tauri logo
    - vite.svg # Vite logo
- src
    - App.tsx  # Main application component that uses ResizablePanelGroup for the layout
    - assets
        - react.svg # React logo
    - components
        - Dictionary.tsx  # Dictionary component with optimized layout
        - Library.tsx # Library component for saved words
        - Settings.tsx # Settings component with keyboard shortcut configuration
        - Sidebar.tsx  # Resizable sidebar component with search history
        - ThemeToggle.tsx # Dark/light mode toggle
        - dictionary
            - DefinitionItem.tsx # Component for displaying word definitions
            - DictionaryHeader.tsx # Header component for dictionary page
            - EtymologyCard.tsx # Component for displaying word etymology
            - MeaningCard.tsx # Component for displaying word meanings
            - UsageNotesCard.tsx # Component for displaying usage notes
        - ui # Shadcn/UI components
            - accordion.tsx
            - alert-dialog.tsx
            - alert.tsx
            - aspect-ratio.tsx
            - avatar.tsx
            - badge.tsx
            - breadcrumb.tsx
            - button.tsx
            - calendar.tsx
            - card.tsx
            - carousel.tsx
            - chart.tsx
            - checkbox.tsx
            - collapsible.tsx
            - command.tsx
            - context-menu.tsx
            - dialog.tsx
            - drawer.tsx
            - dropdown-menu.tsx
            - error-message.tsx
            - form.tsx
            - hover-card.tsx
            - input-otp.tsx
            - input.tsx
            - label.tsx
            - menubar.tsx
            - navigation-menu.tsx
            - pagination.tsx
            - popover.tsx
            - progress.tsx
            - radio-group.tsx
            - resizable.tsx  # Provides ResizablePanelGroup components
            - scroll-area.tsx  # Used for scrollable content
            - select.tsx
            - separator.tsx
            - sheet.tsx
            - sidebar.tsx
            - skeleton.tsx
            - slider.tsx
            - sonner.tsx
            - switch.tsx
            - table.tsx
            - tabs.tsx
            - textarea.tsx
            - toggle-group.tsx
            - toggle.tsx
            - tooltip.tsx
    - hooks
        - use-mobile.ts # Hook for detecting mobile devices
        - use-shortcuts.ts # Hook for managing global keyboard shortcuts
    - index.css # Global CSS
    - lib
        - anki.ts # Anki integration library for creating decks and cards
        - dictionary
            - dictionaryQuery.ts # Dictionary query functionality with local cache support
        - llmService.ts # LLM service for AI-powered explanations
        - time.ts # Date formatting and grouping utilities
        - utils.ts # Utility functions
    - main.tsx # Main React entry point
    - store
        - dictionaryStore.ts  # Zustand store for dictionary state with search history, bookmarking, and AI features
        - settingsStore.ts # Zustand store for application settings including keyboard shortcuts
    - vite-env.d.ts # Vite environment types
- src-tauri
    - .gitignore # Tauri-specific gitignore
    - Cargo.lock # Rust dependencies lock file
    - Cargo.toml # Rust dependencies with global-shortcut plugin
    - build.rs # Tauri build script
    - capabilities
        - default.json # Tauri capabilities configuration
    - gen
        - schemas
            - acl-manifests.json # Tauri ACL manifests
            - capabilities.json # Tauri capabilities
            - desktop-schema.json # Tauri desktop schema
            - macOS-schema.json # Tauri macOS schema
    - src
        - config.rs # Tauri configuration
        - lib.rs # Tauri library with global shortcut functionality
        - main.rs # Tauri main entry point
    - tauri.conf.json # Tauri configuration
- tsconfig.json # TypeScript configuration
- tsconfig.node.json # TypeScript node configuration
- vite.config.ts # Vite configuration
```
