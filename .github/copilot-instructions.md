# Copilot Instructions for Widget Templates Repository

## Repository Summary

This repository contains widget templates for building customizable UI widgets. It's a Node.js/TypeScript project that uses esbuild for bundling, supports multiple widget types (carousel, grid, masonry, etc.), and deploys as AWS Lambda functions via Serverless framework.

**Repository size**: ~2000 files, primarily TypeScript/SCSS widget templates  
**Primary languages**: TypeScript, SCSS, Handlebars  
**Target runtime**: Node.js 20 (see .nvmrc)  
**Build tool**: esbuild with custom configuration  
**Package manager**: npm with workspaces  

## Critical Setup Requirements

**ALWAYS run these commands in order before any development work:**

1. **Initialize submodules and dependencies**: `./setup.sh`
2. **Build widget-utils submodule**: `cd packages/widget-utils && npm install && npm run build`
3. **Verify main build works**: `npm run build`

The widget-utils submodule is **REQUIRED** - all TypeScript imports from `@stackla/widget-utils` will fail until it's properly built.

## Build and Validation Commands

### Bootstrap/Setup
```bash
./setup.sh                              # ~2-3 minutes - initializes submodules, installs deps
cd packages/widget-utils && npm install && npm run build  # ~30 seconds - builds utils
```

### Build
```bash
npm run build                           # Production build (~10 seconds)
npm run build:development               # Development build
npm run build:staging                   # Staging build
npm run build:utils                     # Build widget-utils only
```

### Development
```bash
npm start                               # Start dev server with hot reload (port 4003)
npm run watch                           # Build with watch mode
npm run start:test                      # Start test server (port 4002)
```

### Validation
```bash
npm run lint                            # ESLint + Stylelint (~30 seconds)
npm run lint:fix                        # Auto-fix linting issues
npm run typecheck                       # TypeScript type checking (~10 seconds)
npm test                                # Jest tests (currently no tests defined)
```

### End-to-End Testing
```bash
npm run test:e2e                        # Requires start:test server running
npm run cy:debug                        # Open Cypress UI (may fail in headless environments)
```

## Known Issues and Workarounds

1. **Cypress installation failure**: In restricted environments, Cypress download may fail. Use `npm install --ignore-scripts` if needed.

2. **Submodule fetch errors**: If setup.sh shows submodule fetch errors, the build will still work for development.

3. **ESLint warnings are expected**: The lint command will show ~38 warnings about type assertions and console statements. These are non-blocking and expected in this codebase.

4. **TypeScript version warning**: ESLint may warn about unsupported TypeScript version (5.8.3 vs supported <5.5.0). This is non-blocking.

5. **Widget-utils import errors**: If you see import errors like "Unable to resolve path to module '@stackla/widget-utils/*'", widget-utils submodule needs to be built first.

## Project Architecture

### Key Directories
- `widgets/` - Widget templates (carousel, grid, masonry, nightfall, quadrant, shortvideo, slider, storyline, storypage, waterfall, blankcanvas, starter-project)
- `src/functions/` - AWS Lambda functions (main handler)
- `src/libs/` - Shared library code
- `packages/widget-utils/` - Git submodule with utility functions (CRITICAL dependency)
- `dist/` - Build output directory
- `views/` - Handlebars templates for preview/staging
- `config/` - Environment-specific configuration files

### Configuration Files
- `esbuild.js` - Custom build configuration with widget compilation logic
- `serverless.ts` - AWS Lambda deployment configuration
- `jest.config.js` - Test configuration (uses happy-dom environment)
- `cypress.config.ts` - E2E test configuration
- `.eslintrc` - ESLint configuration (ignores packages/widget-utils/)
- `.stylelintrc.json` - SCSS linting configuration
- `tsconfig.json` - TypeScript compiler configuration

### Widget Structure
Each widget in `widgets/` typically contains:
- `widget.tsx` - Main React component
- `widget.scss` - Widget-specific styles
- `layout.hbs` - Handlebars layout template
- Additional TypeScript files for widget logic

## GitHub Workflows

Located in `.github/workflows/`:

1. **main.yml** - Main CI pipeline:
   - Runs on PR and master branch pushes
   - Node.js 20, builds, lints, typechecks, tests
   - Parallel Cypress e2e tests (3 containers)
   - Triggers staging deployment on master merge

2. **release.yml** - Deployment workflow (triggered by main.yml)

**Environment variables used**: NODE_AUTH_TOKEN, CYPRESS_RECORD_KEY, VISUAL_REGRESSION_TYPE

## Development Environment URLs

- Development server: http://localhost:4003
- Test server: http://localhost:4002  
- Widget preview: `http://localhost:4003/preview?widgetType=carousel` (replace carousel with any widget name)

## Common Widget Types

Available widgets for testing/development:
- `carousel` - Image carousel with swiper
- `grid` - Basic grid layout
- `masonry` - Pinterest-style masonry layout
- `waterfall` - Waterfall/infinite scroll layout
- `storyline` - Story-based widget
- `storypage` - Full story page widget
- `nightfall` - Dark theme widget
- `quadrant` - Four-section layout
- `blankcanvas` - Starter template
- `starter-project` - Beginner template

## File Organization Priority

1. **Root files**: package.json, esbuild.js, serverless.ts, setup.sh, jest.config.js
2. **Widget templates**: widgets/*/widget.tsx, widgets/*/widget.scss
3. **Source code**: src/functions/, src/libs/
4. **Configuration**: .eslintrc, .stylelintrc.json, tsconfig.json
5. **Documentation**: README.md, guides/

## Important Notes for Agents

- **Always build widget-utils first** - Most TypeScript errors are due to missing widget-utils build
- **Use `npm run start` for development** - Includes hot reload and proper environment setup
- **Check dist/ directory after builds** - Contains compiled widgets and assets
- **Environment-specific configs** exist in config/ directory (development.json, staging.json, production.json)
- **Trust these instructions** - Only search for additional information if these instructions are incomplete or incorrect
- **Widget preview URLs** require the server to be running via `npm run start`

## Time Estimates

- Full setup (setup.sh): 2-3 minutes
- Build widget-utils: 6 seconds  
- Main build: 3 seconds
- Lint: 15 seconds (expect ~38 warnings)
- Type check: 10 seconds
- Starting dev server: 15 seconds