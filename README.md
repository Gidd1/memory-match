# Memory Match

A browser memory game with a move counter and timer. No build step, no dependencies.

## Games
- **Emoji match:** flip cards to find matching emoji pairs.
- **Flag match:** pair each country's flag with its name.

## Difficulty
- 4 x 3 (6 pairs), 4 x 4 (8 pairs), 6 x 6 (18 pairs)

Best (fewest moves) is saved in the browser for each game and grid size. Results can be shared on WhatsApp.

## Run locally
Open `index.html`, or run `python3 -m http.server 8000` and visit http://localhost:8000.

Flag images load from flagcdn.com, so flag mode needs an internet connection.

## Customise
Edit the `EMOJI` and `FLAGS` lists at the top of `game.js`. Flags use two-letter country codes.

## Publish
1. Create a public repo and upload all files, including `.github/workflows/pages.yml`.
2. In **Settings, Pages**, set **Source** to **GitHub Actions**.
3. Your game goes live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

Visit counts use GoatCounter (see the script at the bottom of `index.html`; remove it if you do not want tracking).

## License
MIT
