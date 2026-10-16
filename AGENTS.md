
- Color scheme is URL state (?theme=, retained by root search middleware) applied as <html data-theme>; never persist it to storage. Why: shareable comparisons without new storage.
- All colors are tokens in src/styles.css defined per data-theme block; components use tokens only. Why: one file recolors the app.
