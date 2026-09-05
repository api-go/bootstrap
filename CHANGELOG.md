# Changelog

## Unreleased
- **调整**:
  - 将 clean 深色主题的 tertiary / secondary 背景调整为 `#222222` / `#444444`，并同步其 RGB 变量。

## [v1.0.14] - 2026-09-05
- **修复**:
  - 修复 camelCase 语义色配置未写入 Bootstrap 实际变量及 RGB 变量的问题。
  - 拉开 clean 深色主题的 secondary 与 tertiary 背景层级。
- **文档**:
  - 统一 README 与源码中的内置主题名称。

## 1.0.13 (2026-08-25)

### Fixes
- **Neutral Link Buttons**: the default `btn-link` keeps the body text color while semantic link variants continue to follow their configured theme colors.
- **Workspace Dependencies**: local dependencies now use the shared `.profile` installation and cannot be committed accidentally.

## 1.0.12 (2026-08-18)

### Fixes
- **Link Theme Colors**: `btn-link` and semantic links now follow the configured Bootstrap primary color across normal, hover, active, and disabled states.

## 1.0.11 (2026-08-17)

### Fixes
- **Outline Theme Colors**: `btn-outline-*` now follows every runtime semantic color configured through `Bootstrap.config`, including default, hover, active, and disabled states.

## 1.0.9 (2026-06-27)

### Fixes
- **Theme Engine**: Extended `Bootstrap.config` color patch coverage to `nav-pills`, `dropdown-menu` active state, and `navbar-nav .nav-link.active` so navigation components follow the configured primary color instead of Bootstrap default blue.

## 1.0.6 (2026-06-09)

### Breaking Changes
- **ESM Deprecation**: Completely removed ESM exports to align with the "zero-boilerplate" project philosophy. The library now relies solely on global injection via `globalThis`.
- **Build Format**: Switched build output to IIFE format only.

### Improvements
- **Integration**: Simplified dependency handling for `@apigo.cc/state` by using global variables.
- **Docs**: Updated README with new versioning and non-ESM usage instructions.

## 1.0.5 (2026-06-05)

### Features
- **API**: Refactored `Bootstrap.config` to be the unified entry point.
- **Shorthand**: Added support for `[state, key]` array shorthand in `bindDarkMode`.
- **Theme Engine**: Expanded CSS patch coverage to include form switches, checkboxes, range inputs, progress bars, and more.
- **AI Optimized**: Documentation overhaul for better AI usability and zero-config setup.

### Fixes
- Fixed an issue where theme colors did not propagate to component-specific variables like buttons and switches.
