# Test Report

## v1.0.15 — 2026-10-15 — global density

- 2026-10-15: build and both package regression cases pass, including icon/input equal height and centered glyphs across default/sm/lg. Development serving explicitly allows the shared State source and Bootstrap icon font directory; the integration selector follows the actual container-fluid fixture.

- Icon button alignment is also exercised by master's component DOM matrix, including ItemCollection lg → sm with a focused unsent draft. Removed consumer fixed pixel button boxes instead of adding density-specific offsets.

- Built source and browser bundle; master copy is byte-identical to dist/bootstrap.js. Existing theme and link-button changes preserved.
- Interactive fixture: master `/ui/examples/density.html`, verified through Codex in-app browser with native density switching and computed button dimensions.
- Regression scenarios: html/body inheritance, nearest subtree reset, explicit small/large controls/groups, live switching without form remount, both themes and narrow/wide containers. Master Playwright UI density suite also exercises geometry integration with 2,000-row List/DataGrid.

## v1.0.11 - 2026-08-17

- AI validation: build the package, open the test page in the Codex in-app browser, and verify configured primary colors for solid, link, and outline button variables, including outline hover and active states.
- `npm test`: optional standard Playwright regression entry for CI or a manually provisioned environment.
- `npm run build`: Vite produces the self-contained browser bundle and minified bundle.
