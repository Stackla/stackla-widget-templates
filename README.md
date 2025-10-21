# Stackla Widget Templates

A TypeScript-based framework for building customizable, embeddable User Generated Content (UGC) widgets with multiple display layouts. Deploy as serverless AWS Lambda functions to showcase social media content across your digital properties.

## 🌟 Overview

Stackla Widget Templates provides a robust development environment for creating interactive, accessible UGC widgets. Built with modern web technologies and designed for scalability, this framework enables you to:

- **Build Custom Widgets**: Create unique UGC displays using pre-built templates or start from scratch
- **Multiple Layouts**: Choose from carousel, grid, masonry, waterfall, and more
- **Serverless Architecture**: Deploy as AWS Lambda functions for optimal performance
- **Accessibility First**: WCAG 2.1 AA compliant with comprehensive accessibility features
- **TypeScript-Powered**: Fully typed for better developer experience and code quality

## 📋 Table of Contents

- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Development Workflow](#-development-workflow)
- [Available Widgets](#-available-widgets)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Accessibility](#-accessibility)
- [Contributing](#-contributing)
- [Resources](#-resources)

## 🏗 Architecture

### Technology Stack

- **Language**: TypeScript 5.5+, JavaScript, JSX/TSX
- **Runtime**: Node.js 20.x (see `.nvmrc`)
- **Build System**: ESBuild with custom configuration
- **Styling**: SCSS with PostCSS processing
- **Templates**: Handlebars
- **Framework**: AWS Serverless Framework
- **Testing**: Playwright (E2E), Vitest (unit tests)
- **Package Management**: npm workspaces

### Core Components

```
┌─────────────────────────────────────────────┐
│           Widget Templates Repo             │
├─────────────────────────────────────────────┤
│  Widgets (carousel, grid, masonry, etc.)    │
│  ↓                                           │
│  Build System (ESBuild + SCSS)              │
│  ↓                                           │
│  Lambda Function Handler                    │
│  ↓                                           │
│  AWS Lambda Deployment                      │
└─────────────────────────────────────────────┘
```

### Widget Architecture

Each widget follows a consistent structure:

```
widgets/[widget-name]/
├── widget.tsx              # Main widget component (React-like JSX)
├── widget.scss             # Widget-specific styles
├── layout.hbs             # Optional Handlebars layout template
├── tile.hbs               # Optional tile template
├── config.ts              # Widget configuration
├── [name].lib.ts          # Widget-specific logic
└── _*.scss                # Partial SCSS files
```

## 📦 Prerequisites

- **Node.js**: Version 20.x (use `nvm` to switch: `nvm use`)
- **npm**: Version 8.x or higher
- **Git**: For cloning and submodule management
- **Code Editor**: VS Code recommended for optimal TypeScript support

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Stackla/stackla-widget-templates.git
cd stackla-widget-templates
```

For forked repositories:
```bash
git clone https://your-github-repo-here
cd stackla-widget-templates
```

### 2. Run Setup Script

The setup script handles all initialization:

```bash
./setup.sh
```

This script will:
- Initialize and update git submodules (widget-utils)
- Install all npm dependencies
- Install Playwright with Chromium
- Configure remote repositories

**Alternative Manual Setup** (if setup.sh fails):

```bash
# Initialize submodules
git submodule init
git submodule update --remote --recursive

# Install dependencies
npm install

# Install Playwright (optional, for E2E testing)
npx playwright install --with-deps chromium
```

### 3. Build Dependencies

**Critical**: Always build widget-utils before the main project:

```bash
# Build widget-utils submodule (REQUIRED first step)
npm run build:utils

# Build main project
npm run build
```

### 4. Start Development Server

```bash
npm run start
```

The development server will start at `http://localhost:4003`

### 5. Preview Widgets

Open your browser and navigate to:

```
http://localhost:4003/preview?widgetType=carousel
```

Replace `carousel` with any available widget type (grid, masonry, waterfall, etc.)

🎉 **Congratulations!** You're ready to start building widgets.

## 💻 Development Workflow

### Building

```bash
# Development build with source maps and hot reload
npm run start                 # Starts dev server (localhost:4003)

# Watch mode (auto-rebuild on file changes)
npm run watch

# Production build
npm run build                 # or npm run build:production

# Build for specific environments
npm run build:development     # Development environment
npm run build:staging        # Staging environment
npm run build:pipeline       # CI/CD pipeline

# Build widget-utils submodule
npm run build:utils          # Production build
npm run build:utils:dev      # Development build
```

### Development Server Ports

| Environment | Port | Command |
|------------|------|---------|
| Development | 4003 | `npm run start` |
| Testing | 4003 | `npm run start:test` |
| Pipeline | 4003 | `npm run start:lambda:pipeline` |

### Code Quality

```bash
# Linting
npm run lint                 # Run ESLint + Stylelint
npm run lint:fix            # Auto-fix linting issues
npm run eslint              # Run ESLint only
npm run stylelint           # Run Stylelint only

# Type Checking
npm run typecheck           # TypeScript validation

# Formatting
npm run prettier            # Format code with Prettier
```

### Testing

```bash
# Unit Tests (Vitest)
npm test                    # Run all unit tests

# E2E Tests (Playwright)
npm run test:e2e           # Run all E2E tests
npm run test:e2e:debug     # Debug mode
npm run test:e2e:pipeline  # Run in CI/CD pipeline (sharded)
npm run test:playwright:debug  # Open Playwright UI

# Test Build
npm run test:build         # Build for testing environment
npm run start:test         # Start test server with watch mode
```

## 🎨 Available Widgets

The repository includes multiple pre-built widget templates:

| Widget | Description | Key Features |
|--------|-------------|--------------|
| **Carousel** | Horizontal scrolling carousel | Swiper integration, inline tiles, auto-scroll |
| **Grid** | Traditional grid layout | Responsive columns, masonry option |
| **Masonry** | Pinterest-style layout | Dynamic column layout, waterfall effect |
| **Waterfall** | Vertical scrolling infinite feed | Lazy loading, infinite scroll |
| **Quadrant** | Four-quadrant display | Sectioned content areas |
| **Storyline** | Linear story progression | Sequential content display |
| **Storypage** | Full-page stories | Immersive story experience |
| **Shortvideo** | Video-focused widget | Video playback, mobile-optimized |
| **Nightfall** | Dark-themed widget | Night mode styling |
| **Blankcanvas** | Starter template | Minimal starting point for custom widgets |
| **Starter Project** | Learning template | Educational examples with guided activities |

### Creating a New Widget

1. Copy the `widgets/starter-project` or `widgets/blankcanvas` directory
2. Rename to your widget name (e.g., `widgets/my-widget`)
3. Customize the widget files:
   - `widget.tsx` - Main component logic
   - `widget.scss` - Styling
   - `config.ts` - Widget configuration
   - Templates (`.hbs` files) - Layout and tile structure
4. Build and test your widget:
   ```bash
   npm run build
   npm run start
   # Visit http://localhost:4003/preview?widgetType=my-widget
   ```

## 📁 Project Structure

```
stackla-widget-templates/
├── .github/                      # GitHub workflows and templates
│   ├── workflows/               # CI/CD pipelines
│   │   ├── main.yml            # Main CI pipeline
│   │   ├── release.yml         # Deployment workflow
│   │   └── e2e.yml             # E2E testing workflow
│   └── ISSUE_TEMPLATE/         # Issue templates
├── config/                      # Environment configurations
├── dist/                        # Build output (gitignored)
├── guides/                      # Tutorial guides
│   ├── creating-auto-scrolling-carousel-using-blank-canvas/
│   └── creating-gallery-widget-by-using-the-blank-canvas-widget/
├── packages/                    # npm workspaces
│   └── widget-utils/           # Core utilities (git submodule)
├── src/                        # Core application logic
│   ├── functions/              # AWS Lambda handlers
│   │   └── main/              # Main Lambda function
│   ├── libs/                   # Shared libraries
│   └── tests/                  # Test utilities
├── tests/                      # Test fixtures and E2E tests
│   ├── e2e/                    # Playwright E2E tests
│   │   ├── assertions/        # Reusable test assertions
│   │   ├── locators/          # Component locators
│   │   └── utilities/         # Test utilities
│   └── fixtures/              # Test data
├── types/                      # TypeScript type definitions
├── views/                      # Server-side view templates
├── widgets/                    # Widget implementations
│   ├── carousel/
│   ├── grid/
│   ├── masonry/
│   ├── starter-project/       # Learning template
│   └── [other widgets]/
├── .eslintrc                   # ESLint configuration
├── .nvmrc                      # Node version (20)
├── .prettierrc                 # Prettier configuration
├── .stylelintrc.json          # Stylelint configuration
├── ACCESSIBILITY_IMPLEMENTATION_GUIDE.md  # Accessibility guide
├── ACCESSIBILITY_QUICK_REFERENCE.md      # Quick accessibility reference
├── esbuild.js                 # Custom build configuration
├── package.json               # Project dependencies and scripts
├── playwright.config.ts       # Playwright configuration
├── serverless.ts              # AWS Serverless configuration
├── setup.sh                   # Setup automation script
├── tsconfig.json              # TypeScript configuration
└── vitest.config.ts           # Vitest test configuration
```

## ⚙️ Configuration

### Environment Variables

The build system uses `APP_ENV` to configure behavior:

```bash
export APP_ENV=production    # Production builds
export APP_ENV=staging      # Staging environment
export APP_ENV=development  # Development builds
export APP_ENV=testing      # Testing environment
export APP_ENV=pipeline     # CI/CD pipeline
```

### Widget Endpoints

| Environment | URL |
|------------|-----|
| Production | `https://templates.stackla.com` |
| Staging | `https://templates.teaser.stackla.com` |
| Development | `http://localhost:4003` |
| Testing | `http://localhost:4003` |

### Available HBS Endpoints

The development server provides several Handlebars (HBS) template endpoints for testing and previewing widgets. All endpoints are available when running the development server (`npm run start`).

#### Preview Endpoints

These endpoints render complete HTML pages for widget preview and testing:

##### 1. `/preview` - Widget Preview (Primary Development Endpoint)
**Purpose**: Main endpoint for widget development and testing. Renders widgets with custom templates, CSS, and JS.

**Method**: `GET`

**Query Parameters**:
- `widgetType` (required) - The type of widget to preview (e.g., `carousel`, `grid`, `masonry`, `waterfall`)
- `wid` (optional) - Widget ID, defaults to `668ca52ada8fb`

**Example Usage**:
```bash
# Preview carousel widget
http://localhost:4003/preview?widgetType=carousel

# Preview grid widget with custom ID
http://localhost:4003/preview?widgetType=grid&wid=custom-widget-id
```

**Response**: Full HTML page with embedded widget using custom layout and tile templates from `dist/{widgetType}/`

**Template Used**: `views/preview.hbs`

---

##### 2. `/dev` - Development Mode Preview
**Purpose**: Preview widgets in development mode with connection to widget-ui at `localhost:4002`.

**Method**: `GET`

**Query Parameters**:
- `widgetType` (required) - Widget type to preview
- `wid` (required) - Widget ID (no default, will return 400 error if missing)

**Example Usage**:
```bash
# Preview carousel in dev mode
http://localhost:4003/dev?widgetType=carousel&wid=668ca52ada8fb
```

**Response**: HTML page connecting to local widget-ui development server at `http://localhost:4002`

**Template Used**: `views/dev.hbs`

**Note**: Requires widget-ui development server running on port 4002

---

##### 3. `/docker` - Docker Environment Preview
**Purpose**: Preview widgets in Docker container environment with widget-ui connection.

**Method**: `GET`

**Query Parameters**:
- `widgetType` (required) - Widget type to preview
- `wid` (required) - Widget ID (no default, will return 400 error if missing)

**Example Usage**:
```bash
# Preview widget in Docker environment
http://localhost:4003/docker?widgetType=waterfall&wid=668ca52ada8fb
```

**Response**: HTML page connecting to widget-ui at `http://localhost:4002/docker/`

**Template Used**: `views/docker.hbs`

---

##### 4. `/multi-preview` - Multiple Widget Preview
**Purpose**: Preview multiple instances of the same widget on a single page for testing multi-widget scenarios.

**Method**: `GET`

**Query Parameters**:
- `widgetType` (required) - Widget type to preview

**Example Usage**:
```bash
# Preview multiple carousel widgets on one page
http://localhost:4003/multi-preview?widgetType=carousel
```

**Response**: HTML page with two widget instances (IDs: `668ca52ada8fb` and `1234`)

**Template Used**: `views/multi-preview.hbs`

**Use Case**: Testing widget behavior when multiple instances exist on the same page

---

##### 5. `/staging` - Staging Environment Preview
**Purpose**: Preview widgets as they would appear in staging environment with staging widget-ui.

**Method**: `GET`

**Query Parameters**:
- `widgetType` (required) - Widget type to preview
- `wid` (optional) - Widget ID, defaults to `668ca52ada8fb`

**Example Usage**:
```bash
# Preview in staging mode
http://localhost:4003/staging?widgetType=grid&wid=custom-id
```

**Response**: HTML page connecting to staging widget-ui

**Template Used**: `views/staging.hbs`

---

#### API Endpoints

These endpoints provide JSON responses for widget data and rendered templates:

##### 6. `/development/widgets/:wid/draft` - Draft Widget Data
**Purpose**: Retrieve complete widget configuration including HTML, CSS, JS, and options.

**Method**: `POST`

**URL Parameters**:
- `wid` - Widget ID

**Request Body** (JSON):
```json
{
  "draft": {
    "customCSS": "/* custom styles */",
    "customJS": "// custom scripts",
    "layoutTemplate": "<div>...</div>",
    "tileTemplate": "<div>...</div>"
  }
}
```

**Response** (JSON):
```json
{
  "html": ["<div>tile1</div>", "<div>tile2</div>"],
  "customCSS": "/* styles */",
  "customJS": "// scripts",
  "widgetOptions": {...},
  "stackId": 1451,
  "merchantId": "shopify-64671154416",
  "tileCount": 25,
  "enabled": 1
}
```

**Example Usage**:
```bash
curl -X POST http://localhost:4003/development/widgets/test123/draft \
  -H "Content-Type: application/json" \
  -H "Cookie: widgetType=carousel" \
  -d '{"draft": {...}}'
```

**Note**: Requires `widgetType` cookie to be set

---

##### 7. `/development/widgets/:wid/tiles` - Widget Tiles Data
**Purpose**: Get tile data for a widget (unrendered JSON data).

**Method**: `GET`

**URL Parameters**:
- `wid` - Widget ID

**Query Parameters**:
- `after_id` (optional) - Get tiles after this ID (for pagination/infinite scroll)

**Response** (JSON Array):
```json
[
  {
    "id": "65e16a0b5d7e676caec68f03",
    "source": "instagram",
    "caption": "Sample caption",
    "media": {...},
    ...
  }
]
```

**Example Usage**:
```bash
# Get all tiles
http://localhost:4003/development/widgets/test123/tiles

# Get tiles after ID (pagination)
http://localhost:4003/development/widgets/test123/tiles?after_id=123
```

---

##### 8. `/development/widgets/:wid/tiles/:tid` - Single Tile Data
**Purpose**: Get data for a specific tile by ID.

**Method**: `GET`

**URL Parameters**:
- `wid` - Widget ID
- `tid` - Tile ID

**Response** (JSON Object):
```json
{
  "id": "65e16a0b5d7e676caec68f03",
  "source": "instagram",
  "caption": "Sample caption",
  "media": {...},
  ...
}
```

**Example Usage**:
```bash
http://localhost:4003/development/widgets/test123/tiles/65e16a0b5d7e676caec68f03
```

---

##### 9. `/development/widgets/:wid/rendered/tiles` - Rendered Tile HTML
**Purpose**: Get rendered HTML for tiles using widget's Handlebars templates.

**Method**: `GET`

**URL Parameters**:
- `wid` - Widget ID

**Query Parameters**:
- `widgetType` (required) - Widget type (determines which templates to use)
- `after_id` (optional) - Get tiles after this ID (for pagination)

**Response** (JSON Array of HTML strings):
```json
[
  "<div class=\"tile\" data-id=\"65e16a0b5d7e676caec68f03\">...</div>",
  "<div class=\"tile\" data-id=\"65e16a0b5d7e676caec68f04\">...</div>"
]
```

**Example Usage**:
```bash
# Get all rendered tiles
http://localhost:4003/development/widgets/test123/rendered/tiles?widgetType=carousel

# Get next tile for infinite scroll
http://localhost:4003/development/widgets/test123/rendered/tiles?widgetType=carousel&after_id=123
```

---

#### Mock Product Endpoints

For testing Add-to-Cart (ATC) functionality, the following mock product endpoints are available:

##### `/development/products/asus-tuf-f15-15-6-fhd-144hz-gaming-laptop-1tbgeforce-rtx-3050.js`
**Response**: Gaming laptop product data (JSON)

##### `/development/products/samsung-98-qn90d-neo-qled-4k-smart-tv-2024.js`
**Response**: TV product data (JSON)

##### `/development/products/contrast-felted-sweater-black.js`
**Response**: Sweater product data (JSON)

##### `/development/products/desna-dress.js`
**Response**: Dress product data (JSON)

##### `/development/products/pure-city-vintage-leather-saddle.js`
**Response**: Saddle product data (JSON)

**Example Usage**:
```bash
http://localhost:4003/development/products/asus-tuf-f15-15-6-fhd-144hz-gaming-laptop-1tbgeforce-rtx-3050.js
```

---

#### Testing Endpoint

##### `/development/stackla/cs/image/disable`
**Purpose**: Mock endpoint for testing image disable functionality.

**Method**: `GET`

**Response** (JSON):
```json
{
  "success": true
}
```

---

### Quick Reference: Common Use Cases

**1. Develop a new widget:**
```bash
npm run start
# Visit: http://localhost:4003/preview?widgetType=your-widget
```

**2. Test widget with multiple instances:**
```bash
# Visit: http://localhost:4003/multi-preview?widgetType=carousel
```

**3. Test infinite scroll/load more:**
```bash
# Get initial tiles
http://localhost:4003/development/widgets/test/rendered/tiles?widgetType=waterfall

# Get next batch
http://localhost:4003/development/widgets/test/rendered/tiles?widgetType=waterfall&after_id=last-tile-id
```

**4. Debug widget in dev mode with widget-ui:**
```bash
# Start widget-ui on port 4002 (separate project)
# Then visit: http://localhost:4003/dev?widgetType=carousel&wid=668ca52ada8fb
```

### TypeScript Configuration

Custom JSX configuration in `tsconfig.json`:

```json
{
  "jsx": "react",
  "jsxFactory": "createElement",
  "jsxFragmentFactory": "createFragment"
}
```

This enables React-like JSX syntax without React dependency.

### ESBuild Configuration

Custom build process defined in `esbuild.js`:
- TypeScript compilation
- SCSS processing with PostCSS
- Asset handling and copying
- Source map generation
- SVG sprite generation
- Hot reload support

## 🧪 Testing

### Test Structure

**Playwright E2E Tests** (`tests/e2e/`):
- **assertions/**: Reusable assertions shared across tests
- **locators/**: Component locators encapsulated in closures for reusability
- **utilities/**: General utility functions for test setup

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Debug mode (step through tests)
npm run test:e2e:debug

# Open Playwright UI for interactive debugging
npm run test:playwright:debug

# Run unit tests
npm test

# CI/CD pipeline testing (sharded across 3 containers)
npm run test:e2e:pipeline
```

### Writing Tests

Example test structure:

```typescript
import { test, expect } from '@playwright/test';
import { widgetLocators } from './locators/widget.locators';
import { assertWidgetLoaded } from './assertions/widget.assertions';

test('widget displays correctly', async ({ page }) => {
  await page.goto('http://localhost:4003/preview?widgetType=carousel');
  await assertWidgetLoaded(page);
  
  const tiles = widgetLocators(page).tiles;
  await expect(tiles.first()).toBeVisible();
});
```

## 🚢 Deployment

### AWS Lambda Deployment

The project uses Serverless Framework for deployment:

```bash
# Deploy to staging
sls deploy --stage staging

# Deploy to production  
sls deploy --stage production
```

### CI/CD Pipeline

**GitHub Actions Workflows**:

1. **main.yml** - Continuous Integration
   - Triggers: PRs and pushes to master
   - Steps: Build → Lint → Type Check → Test → E2E Tests
   
2. **release.yml** - Deployment
   - Trigger: Manual workflow dispatch
   - Environments: staging, production
   - Steps: E2E Tests → Build → Deploy to AWS → Sync Assets to S3

### Deployment Configuration

Defined in `serverless.ts`:
- Lambda function configuration
- API Gateway setup
- Deployment bucket settings
- Environment-specific variables

### Manual Deployment

For manual deployments:

```bash
# Build for target environment
npm run build:staging

# Deploy via Serverless Framework
sls deploy --stage staging --region us-west-1

# View deployment info
sls info --stage staging
```

## ♿ Accessibility

This project is committed to WCAG 2.1 AA compliance. Comprehensive accessibility documentation is available:

### Documentation

- **[ACCESSIBILITY_IMPLEMENTATION_GUIDE.md](ACCESSIBILITY_IMPLEMENTATION_GUIDE.md)**: Complete implementation guide
- **[ACCESSIBILITY_QUICK_REFERENCE.md](ACCESSIBILITY_QUICK_REFERENCE.md)**: Quick checklist for developers

### Key Features

- ✅ Semantic HTML structure (`<main>`, `<section>`, `<article>`, `<nav>`)
- ✅ ARIA attributes for screen readers
- ✅ Keyboard navigation support (Tab, Arrow keys, Enter, Space)
- ✅ Focus management with visible indicators
- ✅ High contrast mode support
- ✅ Skip links for efficient navigation
- ✅ Proper heading hierarchy
- ✅ Alternative text for images
- ✅ Color contrast compliance

### Accessibility Checklist

When creating or modifying widgets:

- [ ] Use semantic HTML elements
- [ ] Add appropriate ARIA labels and roles
- [ ] Implement keyboard navigation
- [ ] Ensure visible focus indicators (3px outline minimum)
- [ ] Test with screen readers
- [ ] Verify color contrast ratios (4.5:1 for text)
- [ ] Add skip links for long content
- [ ] Support high contrast mode

## 🤝 Contributing

### Development Guidelines

1. **Follow existing patterns**: Review similar widgets before starting
2. **Minimal changes**: Make surgical, precise modifications
3. **Code quality**: Run lint and typecheck before committing
4. **Test coverage**: Ensure changes don't break existing functionality
5. **Documentation**: Update docs for significant changes

### Before Committing

```bash
# Validate your changes
npm run build:utils      # Build dependencies
npm run build           # Build project
npm run lint            # Check code style
npm run typecheck       # Validate TypeScript
npm test                # Run unit tests
npm run test:e2e       # Run E2E tests
```

### Branch Workflow

1. Create feature branch from `master`
2. Make changes following coding standards
3. Run validation suite
4. Submit pull request with clear description
5. Address CI/CD feedback
6. Merge after approval

### Code Style

- **TypeScript**: Strict mode enabled, follow ESLint rules
- **SCSS**: Follow Stylelint configuration
- **Formatting**: Use Prettier for consistent formatting
- **Comments**: Add only when necessary for complex logic
- **Naming**: Use descriptive, consistent naming conventions

## 📚 Resources

### Documentation

- **Nosto UGC Documentation**: https://docs.nosto.com/ugc
- **Widget Development Guide**: https://docs.nosto.com/ugc/widgets-nextgen/getting-started/creating-your-first-widget
- **Blank Canvas Tutorial**: https://docs.nosto.com/ugc/widgets-nextgen/getting-started/creating-your-first-widget/creating-a-widget-from-blank-canvas

### Learning Resources

- **Starter Project Activity**: `widgets/starter-project/README.md` - Guided learning activity
- **Tutorial Guides**: `guides/` directory contains step-by-step tutorials:
  - Creating auto-scrolling carousel
  - Building gallery widgets

### External Resources

- [Serverless Framework Docs](https://www.serverless.com/framework/docs/)
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [ESBuild Documentation](https://esbuild.github.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🐛 Troubleshooting

### Common Issues

**"Could not resolve @stackla/widget-utils" errors**
```bash
# Solution: Build widget-utils submodule first
npm run build:utils
```

**Playwright installation failures**
```bash
# Use ignore-scripts to bypass Cypress in restricted networks
npm install --ignore-scripts
```

**Submodule not initialized**
```bash
# Reinitialize submodules
git submodule init
git submodule update --remote --recursive
```

**Port already in use**
```bash
# Kill process using port 4003
lsof -ti:4003 | xargs kill -9

# Or use different environment (port 4003)
npm run start:test
```

**Build failures after pulling latest changes**
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build:utils
npm run build
```

## 🙏 Acknowledgments

Developed and maintained by the Stackla (Nosto) team and community contributors.

---

**Ready to build amazing widgets?** Start with the [Quick Start](#-quick-start) guide or explore the [starter project](widgets/starter-project) for a guided learning experience!