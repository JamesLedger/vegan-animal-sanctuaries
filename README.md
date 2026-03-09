# Animal Sanctuary Directory

A simple React app to browse animal sanctuaries on a map. Data is loaded from a Google Sheet (published as CSV).

## Tech stack

- **Vite** + **React** + **TypeScript**
- **React Router** for routing
- **React Leaflet** for the map (OpenStreetMap)
- **PapaParse** for CSV parsing
- CSS Modules for styling

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set the Google Sheet URL (optional for development)

Create a `.env` file in the project root:

```env
VITE_GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
```

Replace `YOUR_SHEET_ID` with your Google Sheet ID (the long string in the sheet URL between `/d/` and `/edit`).  
If your data is on a **specific sheet tab**, include the tab’s `gid` in the URL (e.g. `...edit?gid=969105921`). The app will export that tab.

If you don’t set this variable, the app uses **mock data** so you can run and test it without a sheet.

### 3. Run locally

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### 4. Build for production

```bash
npm run build
npm run preview
```

### 5. Deploy (Cloudflare Pages)

Install dependencies, then build and deploy the `dist` folder:

```bash
npm install
npm run deploy
```

On first run, Wrangler will prompt you to log in. The `dist` folder is uploaded as static assets (see `[assets]` in `wrangler.toml`). For CI, set `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` as needed.

The app is a static SPA; no `@cloudflare/vite-plugin` is required. If your environment adds it and you see a Vite peer dependency error, the project’s `.npmrc` uses `legacy-peer-deps=true` so `npm install` still succeeds.

## Google Sheet setup

### Required columns

Use one row per sanctuary. Column names are matched case-insensitively.

| Column               | Type    | Notes |
|----------------------|--------|-------|
| `id`                 | string | Optional; falls back to name or generated id |
| `name`               | string | Required |
| `address`            | string | Optional |
| `postcode`           | string | Optional |
| `location`           | string | Optional; lat,lng in one column (e.g. `52.123, -1.456`) – used when latitude/longitude columns are empty |
| `latitude`           | number | Required for map (or use `location` column) |
| `longitude`          | number | Required for map (or use `location` column) |
| `animalTypes`        | string | Comma-separated, e.g. `Cows, Sheep, Pigs` |
| `allowsVisits`       | boolean | See below |
| `cafe`               | boolean | See below |
| `holidayAccommodation` | boolean | See below |
| `canVolunteer`       | boolean | See below |
| `website`            | string | Optional; full URL |
| `facebook`           | string | Optional; full URL |
| `notes`              | string | Optional |
| `image`              | string | Optional |
| `published`          | boolean | Rows with false are hidden |

**Alternate column names** (your sheet can use these and they are mapped automatically):

| Your header           | Maps to                |
|-----------------------|------------------------|
| Sanctuary Name        | name                   |
| Nearest Town, County  | address (combined)     |
| Postcode              | postcode               |
| Location              | lat,lng in one cell (e.g. `52.123, -1.456`) |
| Sheep, Goats, Cows, Pigs, Chickens / Turkeys, etc. | animalTypes (one per column: if cell is Yes, that animal is added) |
| Allows visits?        | allowsVisits           |
| Café                  | cafe                   |
| Holiday Accommodation | holidayAccommodation   |
| Can volunteer         | canVolunteer           |
| Facebook page         | facebook               |
| Website               | website                |
| Notes                 | notes                  |

Rows need **latitude** and **longitude** (or a **Location** column with `lat, lng`) to appear on the map; rows without valid coordinates are skipped.

### Data cleanup checklist

To avoid “duplicate headers” and parsing issues:

1. **One header row only** – Row 1 must be your column names; no title row above it.
2. **Unique column names** – Every column must have a different name (e.g. only one “Website”, one “Notes”). If you have two of the same, rename one (e.g. “Website 2” or “Extra notes”).
3. **No empty columns** – Delete columns you don’t need, or give them a name (e.g. “Spare”); otherwise the CSV can produce duplicate or empty headers.
4. **Name column** – One column must be the sanctuary name (e.g. “Sanctuary Name” or “Name”). It must not be empty for any row you want on the map.
5. **Latitude & longitude** – Use either separate columns or a single **Location** column (e.g. `52.123, -1.456`) so each row can be placed on the map.
6. **Booleans** – Use consistent values: e.g. `Yes` / `No` or `Y` / `N` or `TRUE` / `FALSE` in the columns like Allows visits?, Café, etc.

After cleaning, re-publish the sheet (File → Share → Publish to web) if you had already published it, then refresh the app.

### How booleans are interpreted

The app treats these as **true**: `Yes`, `True`, `1`, `Y`, `On` (case-insensitive).  
Everything else (including `No`, `False`, `0`, empty) is **false**.  
So you can use Yes/No, TRUE/FALSE, or 1/0 in your sheet.

### Publishing the sheet for public reading

1. Open your Google Sheet.
2. **File → Share → Publish to web**.
3. Choose **Entire document** (or the specific sheet).
4. Set format to **Comma-separated values (.csv)** if you use that option, or leave as default; the app uses the “export as CSV” URL.
5. Click **Publish**.

The app fetches using the sheet’s CSV export URL, which is public. No API key is required. Use the normal sheet URL in `VITE_GOOGLE_SHEET_URL`; the app turns it into the correct CSV export URL.

## Routes

- `/` – Map with sanctuary markers and filters
- `/contact` – Contact form (UI only; no backend yet)

## Features

- **Map**: Full-page map, markers for each sanctuary with valid lat/lng, popups with name, animal types, features (visits, cafe, accommodation, volunteer), and website/Facebook links.
- **Filters**: Allows visits, Has cafe, Holiday accommodation, Can volunteer; plus animal type (multi-select from data). Clear filters button.
- **Contact**: Form with name, email, message; validation and success message; ready for a real endpoint later.
- **Data**: Fetched from Google Sheet, parsed and normalised (booleans, animal types array), filtered by `published` and valid coordinates.

## Project structure

```
src/
  components/    Header, Layout, FilterBar, SanctuaryMap, SanctuaryPopup,
                 ContactForm, LoadingState, ErrorState
  pages/         MapPage, ContactPage
  lib/           googleSheets.ts, sanctuaryParser.ts, filters.ts
  types/         sanctuary.ts
  styles/        global.css
```
(Routing lives in `App.tsx`.)
