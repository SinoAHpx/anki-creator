## {Project Name} (init from readme/docs)

> {Project Description}

> {Project Purpose}

> {Project Status}

> {Project Team}

> {Framework/language/other(you think it is important to know)}



## Dependencies (init from programming language specification like package.json, requirements.txt, etc.)

* package1 (version): simple description
* package2 (version): simple description


## Development Environment

> include all the tools and environments needed to run the project
> makefile introduction (if exists)


## Structrue (init from project tree)

> It is essential to consistently refine the analysis down to the file level — this level of granularity is of utmost importance.

> If the number of files is too large, you should at least list all the directories, and provide comments for the parts you consider particularly important.

> In the code block below, add comments to the directories/files to explain their functionality and usage scenarios.

> if you think the directory/file is not important, you can not skip it, just add a simple comment to it.

> but if you think the directory/file is important, you should read the files and add more detail comments on it (e.g. add comments on the functions, classes, and variables. explain the functionality and usage scenarios. write the importance of the directory/file).
```
root
- .gitignore
- .prettierrc
- README.md
- biome.json
- bun.lock
- components.json
- index.html
- package.json
- public
    - dictionary_cache.json
    - tauri.svg
    - vite.svg
- src
    - App.tsx  # Main application component that uses ResizablePanelGroup for the layout
    - assets
        - react.svg
    - components
        - Dictionary.tsx
        - Library.tsx
        - Settings.tsx
        - Sidebar.tsx  # Resizable sidebar component that uses ResizablePanel
        - ThemeToggle.tsx
        - dictionary
            - DefinitionItem.tsx
            - DictionaryHeader.tsx
            - EtymologyCard.tsx
            - MeaningCard.tsx
            - UsageNotesCard.tsx
        - ui
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
            - resizable.tsx  # Provides ResizablePanelGroup, ResizablePanel, and ResizableHandle components
            - scroll-area.tsx
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
        - use-mobile.ts
    - index.css
    - lib
        - dictionaryQuery.ts
        - llmService.ts
        - utils.ts
    - main.tsx
    - store
        - dictionaryStore.ts
    - vite-env.d.ts
- src-tauri
    - .gitignore
    - Cargo.lock
    - Cargo.toml
    - build.rs
    - capabilities
        - default.json
    - gen
        - schemas
            - acl-manifests.json
            - capabilities.json
            - desktop-schema.json
            - macOS-schema.json
    - src
        - config.rs
        - lib.rs
        - main.rs
    - tauri.conf.json
- tsconfig.json
- tsconfig.node.json
- vite.config.ts
```
