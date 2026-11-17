# init.Habits [beta] — restructured

This is a no-build, vanilla HTML/CSS/JavaScript version of the dashboard, split into focused files without intentionally changing the UI or behavior.

## Run

Open `index.html` in a browser. If browser restrictions affect local assets or APIs, serve this folder with a local static server (for example, VS Code Live Server). No package installation is required.

## Structure

```text
.
├── index.html
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
The Appearance panel includes 23 selectable themes (15 dark and 8 light). The four swatches for each supplied theme are preserved exactly; supporting surface, border, text, and graph colours are derived to maintain contrast. The selected theme is saved in the browser's local storage on that device. Theme palettes are defined with CSS custom properties in `src/css/styles.css`; selection logic is in `src/js/features/appearance.js`.
