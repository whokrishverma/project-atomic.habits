# Project instructions

## Project overview
- This is the vanilla HTML, CSS, and JavaScript `init.Habits` dashboard.
- Keep the current visual design, copy, interactions, and responsive behavior unless the task explicitly requests a change.
- This project currently has no build system, framework, backend, or database. Do not introduce one without asking.

## Architecture
- `index.html`: page structure and markup. Keep it focused on semantic HTML.
- `src/css/styles.css`: all page styles and design tokens.
- `src/js/dashboard.js`: initial dashboard data/rendering (calendar, contribution grid, suggestion list).
- `src/js/features/`: one file per interactive feature.
- Keep each feature's event listeners and behavior in its own file.
- Load scripts in `index.html` with `defer`, preserving dependency/order where relevant.

## Working rules
- Before editing, inspect `AGENTS.md`, `README.md`, and only the files relevant to the requested feature.
- Make the smallest focused change. Do not rewrite unrelated files or restyle unrelated components.
- Do not duplicate existing UI, CSS tokens, helpers, or event behavior. Reuse existing patterns.
- Do not move code across feature files unless the task requires it.
- Preserve existing element IDs, classes, `data-*` attributes, and cross-feature hooks unless all references are updated.
- If a feature needs shared behavior, explain the dependency and keep the shared API small.
- Do not claim placeholder actions are connected to a real backend. Existing TODOs are intentional placeholders.
- Avoid adding dependencies for tasks that can be solved with the current vanilla stack.

## Validation
- After changes, check for missing files, broken script paths, duplicate IDs, and JavaScript syntax errors.
- Test the affected interaction in a browser when possible.
- If browser testing is unavailable, state what was and was not verified.
- Report changed files and any remaining TODOs.

## Collaboration between Claude and ChatGPT
- Treat this file as the source of truth for project-wide rules.
- When asking another AI to implement logic, provide the relevant feature file(s), related HTML IDs/classes, and this file.
- Integrate changes into the existing feature file rather than creating a competing implementation.


## Theme system
- The 23 supported themes are `github-dark`, `ansi-dark`, `nord`, `material-dark`, `gruvbox-dark`, `catppuccin-mocha`, `solarized-cream`, `dracula`, `tokyo-night`, `monokai`, `one-dark`, `ayu-dark`, `ayu-mirage`, `kanagawa`, `everforest-dark`, `light-basic`, `solarized-light`, `github-light`, `rose-pine-dawn`, `one-light`, `ayu-light`, `everforest-light`, and `catppuccin-latte`. Gruvbox Dark is based on a full-dashboard reference; Catppuccin Mocha is an estimated reconstruction from its preview palette.
- Theme palettes are CSS custom-property overrides on `:root[data-theme]` in `src/css/styles.css`. Components should consume semantic variables rather than hardcoded surface/text colours.
- The Appearance panel only shows a `$ themes` summary row; the full picker lives in the separate `#tpnl` Themes panel, opened from that row or from system → themes in the navbar (`data-open="themes"`). `[close]` closes Themes; `esc` steps back to Appearance when Themes was opened from there, otherwise closes it. The panel has a sticky live preview, placeholder theme-sync / follow-system toggles, `[pro]`-locked themes (`data-pro`), and placeholder custom-theme and marketplace rows.
- Theme selection and persistence (`localStorage` key `initHabitsTheme`) live in `src/js/features/appearance.js`.
- Keep habit/category identity colours separate from the selected theme's general accent palette.
