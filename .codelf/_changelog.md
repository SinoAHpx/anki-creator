## 2024-07-21

### 1. Improve Library UI and Extract Time Utilities

**Change Type**: improvement

> **Purpose**: Enhance the Library component and extract date-related functions to a utility file
> **Detailed Description**: Made history entries more compact using badges instead of list items, and extracted date formatting and grouping logic into a reusable time utility file
> **Reason for Change**: To improve visual density of the Library view and follow DRY principles for date-related functionality
> **Impact Scope**: Library component and new time utility file
> **API Changes**: Created reusable date formatting and grouping functions
> **Configuration Changes**: None
> **Performance Impact**: Minimal, improves code organization and visual presentation

   ```
   root
   - src
     - components
       - Library.tsx // update - Converted history entries to compact badges
     - lib
       - time.ts // add - Created utility file for date formatting and grouping functions
   ```

## 2024-07-20

### 1. Enhanced Library View with Full Search History

**Change Type**: feature

> **Purpose**: Enhance the Library component to display all search history grouped by date
> **Detailed Description**: Implemented a complete history view in the Library component that displays all words ever searched, grouped by date, with visual indicators for words added to Anki
> **Reason for Change**: To provide users with a comprehensive view of their vocabulary learning journey and track their Anki flashcard progress
> **Impact Scope**: Library component, dictionary store
> **API Changes**: Added full history tracking with timestamps, enhanced dictionary store with Anki card tracking
> **Configuration Changes**: Updated persist middleware to store Anki card information
> **Performance Impact**: Minimal, greatly improves user experience and learning tracking

   ```
   root
   - src
     - store
       - dictionaryStore.ts // update - Added ankiCards tracking and full history functionality
     - components
       - Library.tsx // update - Enhanced with complete history view grouped by date with Anki indicators
   ```

## 2025-05-02

### 1. Add Tray Menu with Restart Option

**Change Type**: feature

> **Purpose**: Add system tray functionality with menu options including restart
> **Detailed Description**: Implemented system tray icon with dropdown menu, including app restart functionality
> **Reason for Change**: To provide easy access to app functions without the main window and improve user experience
> **Impact Scope**: Tauri backend, tray menu configuration
> **API Changes**: Added tray setup utilities 
> **Configuration Changes**: None
> **Performance Impact**: Minimal, adds convenience functionality

   ```
   root
   - src
     - lib
       - utils.ts // update - Added tray setup logic
   - src-tauri
     - src
       - lib.rs // update - Added tray menu implementation with restart option
   ```

### 2. Add Search Focus with Keyboard Shortcut

**Change Type**: feature

> **Purpose**: Implement search field focus with configurable keyboard shortcut
> **Detailed Description**: Added functionality to focus the dictionary search input field using a global keyboard shortcut
> **Reason for Change**: To improve workflow efficiency and user experience
> **Impact Scope**: Dictionary component, shortcuts system
> **API Changes**: Extended shortcut functionality to handle search focus
> **Configuration Changes**: None
> **Performance Impact**: Minimal, improves user workflow

   ```
   root
   - src
     - components
       - Dictionary.tsx // update - Added search focus functionality
     - hooks
       - use-shortcuts.ts // update - Extended shortcut handling for search focus
   ```

### Git Commit Log

```
0f85f9a - refactor: move tray setup logic to utils and update tray menu with restart option (AHpx, 2025-05-02)
3a9e605 - feat: add tray menu (AHpx, 2025-05-02)
6167a3b - feat: add basic tray menu (AHpx, 2025-05-02)
d0d2d74 - feat: add search focus with shortcut (AHpx, 2025-05-02)
cbe74b3 - feat: add short cut registeration (AHpx, 2025-05-02)
```

## 2023-12-20 15:45:00


### 1. Optimize Dictionary Query Functionality

**Change Type**: improvement

> **Purpose**: Implement actual dictionary query functionality using local cache
> **Detailed Description**: Implemented dictionary lookup functionality that first checks the local dictionary cache in the public directory before attempting to query the external API
> **Reason for Change**: To optimize dictionary lookups by using the local cache first, which improves performance and reduces dependency on external APIs
> **Impact Scope**: Dictionary component, dictionary store, and query functionality
> **API Changes**: Updated queryDictionaryAPI to first check local cache before making external API calls
> **Configuration Changes**: None
> **Performance Impact**: Reduced latency for common word lookups by using local cache

   ```
   root
   - src
     - lib
       - dictionaryQuery.ts // refact - Optimized query functionality to use local cache
     - store
       - dictionaryStore.ts // improvement - Added clearResults functionality
     - components
       - Sidebar.tsx // fix - Fixed missing onClick handler
       - Dictionary.tsx // improvement - Added clear button functionality
   ```

### 2. Add User Experience Improvements

**Change Type**: feature

> **Purpose**: Enhance the user experience when interacting with dictionary results
> **Detailed Description**: Added a clear button to reset dictionary search results and improved error handling
> **Reason for Change**: To provide better user control and improve the interface usability
> **Impact Scope**: Dictionary component and dictionary store
> **API Changes**: Added clearResults function to the dictionary store
> **Configuration Changes**: None
> **Performance Impact**: Minimal, improves user workflow

   ```
   root
   - src
     - store
       - dictionaryStore.ts // add - Added clearResults function
     - components
       - Dictionary.tsx // add - Added clear button
   ```

## 2024-06-28 

### 1. Add Resizable Sidebar Feature

**Change Type**: enhancement

> **Purpose**: Make the sidebar resizable to improve user experience and allow more flexible use of the app interface
> **Detailed Description**: Implemented resizable sidebar using shadcn's resizable component, allowing users to adjust the width of the sidebar
> **Reason for Change**: To provide more flexibility in the UI layout and improve usability
> **Impact Scope**: Sidebar component and main App layout
> **API Changes**: None
> **Configuration Changes**: None
> **Performance Impact**: Minimal

   ```
   root
   - src
     - components
       - Sidebar.tsx // update - Converted sidebar to use ResizablePanel
     - App.tsx // update - Updated layout to use ResizablePanelGroup and ResizableHandle
   ```

## 2024-07-13

### 1. Optimize Dictionary Layout

**Change Type**: improvement

> **Purpose**: Optimize the dictionary page layout by reducing excessive margins
> **Detailed Description**: Reduced padding and spacing in the Dictionary component to minimize excessive margin on the bottom and right sides
> **Reason for Change**: To improve the space utilization and visual appearance of the dictionary layout
> **Impact Scope**: Dictionary component
> **API Changes**: None
> **Configuration Changes**: None
> **Performance Impact**: Minimal, purely visual improvement

   ```
   root
   - src
     - components
       - Dictionary.tsx // update - Reduced padding and spacing for better layout
   ```

## 2024-07-14

### 1. Add Search History Feature

**Change Type**: feature

> **Purpose**: Add a search history feature to allow users to quickly access previously searched words
> **Detailed Description**: Implemented a search history section in the sidebar that displays previously searched words, allows users to click on them to search again, and provides the ability to remove words from history
> **Reason for Change**: To improve user experience by providing quick access to previous searches
> **Impact Scope**: Sidebar component and dictionary store
> **API Changes**: Added history state and related functions to the dictionary store
> **Configuration Changes**: Implemented persistent storage for search history using Zustand persist middleware
> **Performance Impact**: Minimal, improves user workflow

   ```
   root
   - src
     - store
       - dictionaryStore.ts // update - Added history functionality with Zustand persist middleware
     - components
       - Sidebar.tsx // update - Added search history display with click and remove functionality
   ```

## 2024-07-15

### 1. Add Anki Integration with AI-Enhanced Flashcards

**Change Type**: feature

> **Purpose**: Integrate Anki flashcard functionality with AI-enhanced explanations
> **Detailed Description**: Implemented Anki integration that allows users to add the current word to Anki as a flashcard, with options to include AI-generated explanations for better learning
> **Reason for Change**: To enhance the vocabulary learning experience by connecting the dictionary app with Anki spaced repetition learning system
> **Impact Scope**: Dictionary store, Anki integration library, AI service
> **API Changes**: Added Anki integration functions, implemented askAI and addBookMark functionality in dictionary store
> **Configuration Changes**: None
> **Performance Impact**: Minimal, adds valuable learning functionality

   ```
   root
   - src
     - lib
       - anki.ts // add - Created Anki integration library with functions to create decks and cards
     - store
       - dictionaryStore.ts // update - Added AI explanation and Anki bookmark functionality
   ```

## 2024-07-16

### 1. Add Toast Notifications for User Feedback

**Change Type**: enhancement

> **Purpose**: Implement toast notifications to provide clear feedback for user actions
> **Detailed Description**: Added Shadcn UI's sonner toast component to provide real-time feedback when users add words to Anki or generate AI explanations
> **Reason for Change**: To improve user experience by providing clear, non-intrusive feedback for important actions
> **Impact Scope**: Dictionary store and App component
> **API Changes**: Updated action functions to display toast notifications
> **Configuration Changes**: Added Toaster component to App.tsx
> **Performance Impact**: Minimal, greatly improves user feedback

   ```
   root
   - src
     - store
       - dictionaryStore.ts // update - Added toast notifications for success and error states
     - App.tsx // update - Added Toaster component for displaying notifications
   ```

## 2024-07-18

### 1. Add Global Keyboard Shortcut Functionality

**Change Type**: feature

> **Purpose**: Implement global keyboard shortcuts for common app actions with user-configurable key bindings
> **Detailed Description**: Added Tauri global shortcut plugin integration, created a settings UI for customizing shortcuts, and implemented a hook system to register and handle shortcuts throughout the application
> **Reason for Change**: To enhance user productivity and provide a more desktop-like experience with keyboard shortcuts
> **Impact Scope**: Settings component, Rust backend, and app-wide functionality
> **API Changes**: Added Tauri commands to register and manage global shortcuts, introduced settings store for shortcut configuration
> **Configuration Changes**: Added @tauri-apps/plugin-global-shortcut to package.json and tauri-plugin-global-shortcut to Cargo.toml
> **Performance Impact**: Minimal, significantly improves user workflow and accessibility

   ```
   root
   - src
     - store
       - settingsStore.ts // add - Created settings store for managing keyboard shortcuts
     - components
       - Settings.tsx // update - Added keyboard shortcut configuration UI
     - hooks
       - use-shortcuts.ts // add - Created hook for managing shortcut registration and handling
     - App.tsx // update - Integrated shortcut hook
   - src-tauri
     - src
       - lib.rs // update - Added global shortcut plugin and Tauri commands
     - Cargo.toml // update - Added global shortcut plugin dependency
   - package.json // update - Added global shortcut plugin dependency
   ```

...