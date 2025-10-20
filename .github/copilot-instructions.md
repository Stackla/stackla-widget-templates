# Stackla Widget Templates - Copilot Instructions

## Repository Overview

This repository contains **Stackla Widget Templates** - a TypeScript-based framework for building customizable UGC (User Generated Content) widgets. The project creates embeddable social media content widgets with various display layouts (carousel, grid, masonry, waterfall, etc.) that can be deployed as AWS Lambda functions.

**Key Technologies:**
- **Languages:** TypeScript, JavaScript, SCSS, Handlebars templates
- **Runtime:** Node.js 20 (see `.nvmrc`)
- **Build System:** ESBuild with custom configuration
- **Framework:** AWS Serverless Framework
- **Testing:** Jest (unit), Cypress (E2E)
- **Styling:** SCSS with PostCSS
- **Package Management:** npm with workspaces

**Repository Size:** ~2000+ npm packages, multiple widget templates, serverless backend

## Critical Setup Requirements

**⚠️ IMPORTANT: Always follow this exact sequence for any new environment:**

### 1. Initial Setup (Required for fresh environments)
```bash
# Use Node 20 (critical requirement)
node -v  # Must be 20.x

# Run the setup script (handles submodules and dependencies)
./setup.sh

# If setup.sh fails with network issues (common in CI), run manually:
git submodule init
git submodule update --remote --recursive
npm install --ignore-scripts  # Skip Cypress if network restricted
```

### 2. Build Dependencies (ALWAYS required before building)
```bash
# CRITICAL: Build widget-utils submodule first (always required)
npm run build:utils

# Then build main project
npm run build
```

**Note:** The widget-utils submodule MUST be built before the main project. This is a hard dependency that will cause build failures if skipped.

## Development Workflow

### Starting Development
```bash
# Start development server (localhost:4003)
npm run start

# Start test server (localhost:4002) 
npm run start:test

# Preview widgets at:
# http://localhost:4003/preview?widgetType=carousel
```

### Building and Testing
```bash
# Build for different environments
npm run build                    # Production build
npm run build:development        # Development build  
npm run build:staging           # Staging build

# Linting and validation
npm run lint                    # ESLint + Stylelint
npm run lint:fix               # Auto-fix linting issues
npm run typecheck              # TypeScript validation
npm test                       # Jest tests (currently no active tests)

# E2E Testing (requires Cypress installation)
npm run test:e2e               # Run Cypress tests
npm run cy:debug               # Open Cypress GUI
```

## Project Architecture

### Directory Structure
```
├── .github/                   # GitHub workflows and templates
│   ├── workflows/            # CI/CD pipelines (main.yml, release.yml)
│   └── ISSUE_TEMPLATE/       # Issue templates
├── src/                      # Core application logic
│   ├── functions/main/       # AWS Lambda handler
│   ├── libs/                 # Shared libraries
│   └── tests/                # Test utilities
├── widgets/                  # Widget implementations
│   ├── carousel/            # Carousel widget
│   ├── grid/                # Grid layout widget
│   ├── masonry/             # Masonry layout widget
│   ├── starter-project/     # Tutorial/example widget
│   └── [other widgets]/     # Additional widget types
├── packages/                 # npm workspaces
│   └── widget-utils/        # Core utilities (git submodule)
├── tests/                   # Test fixtures and setup
├── cypress/                 # E2E test specifications
├── dist/                    # Build output (gitignored)
└── config files            # Various configuration files
```

### Key Configuration Files
- **`esbuild.js`** - Custom build configuration (handles TypeScript, SCSS, assets)
- **`serverless.ts`** - AWS Lambda deployment configuration
- **`package.json`** - Scripts and dependencies (npm workspaces setup)
- **`tsconfig.json`** - TypeScript configuration with custom JSX
- **`.eslintrc`** - ESLint rules (includes custom Stackla config)
- **`.stylelintrc.json`** - SCSS linting configuration
- **`jest.config.js`** - Jest testing setup
- **`cypress.config.ts`** - E2E testing configuration

## Build Process Details

### Build Environments
The build system supports multiple environments via `APP_ENV`:
- **`production`** - Production builds (default for `npm run build`)
- **`staging`** - Staging environment builds
- **`development`** - Development builds with source maps
- **`testing`** - Test environment builds

### Build Troubleshooting

**Common Issues and Solutions:**

1. **"Could not resolve @stackla/widget-utils" errors**
   ```bash
   # Solution: Always build widget-utils first
   npm run build:utils
   ```

2. **Cypress installation failures**
   ```bash
   # Use ignore-scripts to bypass Cypress in restricted networks
   npm install --ignore-scripts
   ```

3. **SWC loader binding errors**
   ```bash
   # These are warnings and don't prevent server startup
   # The serverless development server will still work correctly
   ```

4. **TypeScript version warnings with ESLint**
   ```bash
   # These are warnings only and don't affect functionality
   # The project uses TypeScript 5.5+ which works correctly
   ```

## CI/CD Pipeline

### GitHub Actions Workflows

**Main CI Pipeline (`.github/workflows/main.yml`):**
- **Triggers:** PRs and pushes to master
- **Node Version:** 20
- **Steps:**
  1. Checkout with submodules (`submodules: recursive`)
  2. Install dependencies (`npm install`)
  3. Build project (`npm run build`)
  4. Lint code (`npm run lint`)
  5. Type check (`npm run typecheck`)  
  6. Run tests (`npm test`)
  7. Cypress E2E tests (parallel execution across 3 containers)

**Deployment Pipeline (`.github/workflows/release.yml`):**
- **Trigger:** Manual workflow dispatch
- **Environments:** staging, production
- **Steps:**
  1. Build project for target environment
  2. Deploy via AWS Serverless Framework
  3. Sync assets to S3
  4. Create Sentry release

### Pre-commit Validation
Before making changes, always run:
```bash
npm run build:utils    # Build dependencies
npm run build          # Build project
npm run lint           # Check code style
npm run typecheck      # Validate TypeScript
```

## Widget Development Guide

### Widget Structure
Each widget follows this pattern:
```
widgets/[widget-name]/
├── widget.tsx              # Main widget component
├── widget.scss             # Widget styles
├── layout.hbs             # Handlebars template (optional)
├── tile.hbs               # Tile template (optional)
├── config.ts              # Widget configuration
├── [name].lib.ts          # Widget-specific logic
└── _*.scss                # Partial SCSS files
```

### Creating New Widgets
1. Use `widgets/starter-project/` as a template
2. Copy widget structure to new directory
3. Update widget configuration and templates
4. Test with development server
5. Add to build configuration if needed

## Dependencies and Submodules

### Critical Dependencies
- **`@stackla/widget-utils`** - Core utilities (workspace dependency from submodule)
- **`serverless`** - AWS deployment framework
- **`esbuild`** - Build system
- **`typescript`** - Type checking
- **`@stackla/handlebars`** - Template engine

### Git Submodules
- **`packages/widget-utils`** - Points to `https://github.com/Stackla/widget-utils`
- Must be initialized and built before main project
- Updated via `git submodule update --remote --recursive`

## Environment Variables

**Build-time variables:**
- `APP_ENV` - Environment (production/staging/development/testing)
- `NODE_ENV` - Node environment setting

**Runtime endpoints:**
- Production: `https://templates.stackla.com`
- Staging: `https://templates.teaser.stackla.com`  
- Development: `http://localhost:4003`
- Testing: `http://localhost:4002`

## Validation and Testing

### Manual Validation Steps
1. **Build validation:**
   ```bash
   npm run build:utils && npm run build
   # Should complete without errors
   ```

2. **Development server:**
   ```bash
   npm run start
   # Visit http://localhost:4003/preview?widgetType=carousel
   # Should display widget gallery
   ```

3. **Linting validation:**
   ```bash
   npm run lint
   # Should pass with only warnings allowed
   ```

### Code Quality Requirements
- ESLint warnings are acceptable, errors will fail CI
- Stylelint must pass without errors
- TypeScript must compile without errors
- Console statements trigger warnings (acceptable in development)

## Important Notes for Coding Agents

🚨 **ALWAYS trust these instructions** - only search/explore if information is incomplete or incorrect

✅ **Follow this exact build sequence:**
1. `npm run build:utils` (REQUIRED first step)
2. `npm run build`
3. `npm run lint`
4. `npm run typecheck`

⚠️ **Common Pitfalls:**
- Never skip building widget-utils submodule
- Cypress installation failures are common in restricted networks (use `--ignore-scripts`)
- Development server warnings about SWC bindings are normal
- Widget-utils submodule may have outdated refs (run `git submodule update`)

🔧 **Making Changes:**
- Widget code is in `/widgets/[widget-name]/`
- Core functionality is in `/src/`
- Always test with development server after changes
- Run full build pipeline before committing

📝 **Time Estimates:**
- Fresh setup: 3-5 minutes
- Full build: 30-60 seconds  
- Development server startup: 10-15 seconds
- Linting: 15-30 seconds
- Cypress tests: 5-10 minutes (parallel execution)