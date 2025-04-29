## Development Guidelines

### Framework and Language
> Analyze the framework and language choices for this project, focusing on best practices and standardization.

**Framework Considerations:**
- Version Compatibility: Ensure all dependencies are compatible with React 18.3 and Tauri 2
- Feature Usage: Use React hooks and Zustand for state management
- Performance Patterns: Implement code splitting and component memoization where appropriate
- Upgrade Strategy: Keep dependencies updated with Bun package manager
- Importance Notes for Framework: 
	* Use Bun as the package manager, not npm
	* The project uses Tauri for desktop integration
	* The project follows shadcn/ui component patterns

**Language Best Practices:**
- Type Safety: Use TypeScript with strict type checking enabled
- Modern Features: Utilize React hooks, arrow functions, and optional chaining
- Consistency: Follow ESLint and Prettier configurations for code style
- Documentation: Document complex functions and components with JSDoc comments

### Code Abstraction and Reusability
> During development, prioritize code abstraction and reusability to ensure modular and component-based functionality. Try to search for existing solutions before reinventing the wheel.
> List below the directory structure of common components, utility functions, and API encapsulations in the current project.


**Modular Design Principles:**
- Single Responsibility: Each component should have a single purpose
- High Cohesion, Low Coupling: Use hooks and context for state management
- Stable Interfaces: Define clear props and return types for components

**Reusable Component Library:**
```
src
├── components
│   ├── ui // Reusable UI components from shadcn/ui
│   └── dictionary // Dictionary-specific components
├── lib // Utility functions
├── store // Zustand stores
└── hooks // Custom React hooks
```

### Coding Standards and Tools
**Code Formatting Tools:**
- [Biome (1.9.4)](https://biomejs.dev/) // JavaScript/TypeScript linting and formatting
- [Prettier (config in .prettierrc)](https://prettier.io/) // Code formatting

**Naming and Structure Conventions:**
- Semantic Naming: Use descriptive names for components, functions, and variables
- Consistent Naming Style: Components use PascalCase, functions and variables use camelCase
- Directory Structure follows feature-based organization

### Frontend-Backend Collaboration Standards
**API Design and Documentation:**
- RESTful design principles
	* Dictionary API uses GET requests with query parameters
- Error handling
	* API errors should be caught and displayed user-friendly messages

**Data Flow:**
- State management with Zustand
	* Dictionary state is managed with the useDictionaryStore
- Data validation
	* Validate inputs before queries
- Asynchronous operations
	* Use async/await for API calls

### Performance and Security
**Performance Optimization Focus:**
- Resource loading optimization
	* Use local dictionary cache when available
- Rendering performance optimization
	* Use virtualization for large data displays
- Appropriate use of caching
	* Implement caching for dictionary lookups

**Security Measures:**
- Input validation
	* Sanitize user inputs before making API calls
- Error handling
	* Prevent exposing sensitive information in error messages