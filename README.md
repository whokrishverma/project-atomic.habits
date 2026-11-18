# init.Habits [beta] — restructured

This is a no-build, vanilla HTML/CSS/JavaScript version of the dashboard, split into focused files without intentionally changing the UI or behavior.

## Run

Open `index.html` in a browser. If browser restrictions affect local assets or APIs, serve this folder with a local static server (for example, VS Code Live Server). No package installation is required.

## Structure

```text
.
├── index.html
├── favicon.svg
├── AGENTS.md
├── CLAUDE.md
├── README.md
└── src
    ├── css
    │   └── styles.css
    └── js
        ├── dashboard.js
        └── features
            ├── appearance.js
            ├── habit-create.js
            ├── habits-library.js
            ├── habits-overview.js
            ├── help-feedback.js
            ├── navigation.js
            └── profile.js
```

## AI workflow

- Claude Code: reads `CLAUDE.md`, which points to `AGENTS.md`.
- ChatGPT/Codex and other agents: give them `AGENTS.md` as the project guide.
- Keep `AGENTS.md` as the canonical rules file so Claude and ChatGPT do not drift.

## Important current limitations

Some controls are still UI placeholders, as marked by `TODO` comments in the JavaScript (for example cloud sync, feedback submission, account deletion, and persistence). This restructure does not add a backend or make those actions real.


## Themes
The Appearance panel shows the current theme on a single `$ themes` row; clicking it (or system → themes in the navbar) opens a separate Themes panel in the right column (`[close]` button; `esc` steps back) with a sticky preview and lists 23 selectable themes (15 dark and 8 light), five per group until `[show more]` is clicked. The four swatches for each supplied theme are preserved exactly; supporting surface, border, text, and graph colours are derived to maintain contrast. The selected theme is saved in the browser's local storage on that device. Theme palettes are defined with CSS custom properties in `src/css/styles.css`; selection logic is in `src/js/features/appearance.js`.


## Habits menu panels
`habits → all habits` opens the `$ overview` panel (`habits-overview.js`) and `habits → library` opens `$ habits library` (`habits-library.js`) in the right column. Library `[add]` pre-fills the `$ habit --new` panel; routine packs and the `$ habit --archive` command are placeholders (TODO). Overview habits and library entries are static sample data until persistence exists.


## Stats menu panels
`stats → overview` opens `$ stats --overview` (lifetime overview, streaks, data window presets, completion rates, day of week, habit highlights, activity, past-year contributions, xp & level, top habits). `stats → month` / `stats → week` open the month and week panels. All three live in `src/js/features/stats-panels.js` and are driven by sample data until persistence exists (see TODOs; `[more]` / `[custom]` window presets are placeholders).


## Profile menu panels
`profile → account` / `levels` live in `profile.js`. `profile → pro` opens `$ pro` (pro features, pricing cards) and `profile → achievements` opens `$ achievements` (tiers with `░░░░│░░░░│…` progress bars, milestones, and hidden challenges masked with the `▓█░▒▓▒█░▓▒` glyph pattern). Both are in `src/js/features/profile-panels.js`, use sample data, and checkout / redeem / legal links are placeholders (TODO).
