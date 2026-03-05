# Scratch Fun Games

A static site that links to TurboWarp/Scratch games. Access is controlled by the [checkaccess](https://github.com/your-org/checkaccess) Worker (playtime rules and game config).

## Setup

1. **Checkaccess Worker**  
   Deploy the checkaccess Worker and configure the `scratchfungames` app in Firebase with your playtime schedule.

2. **Config**  
   In `public/config.js`, set `CHECKACCESS_URL` to your Worker URL (e.g. `https://checkaccess.xxx.workers.dev`).

3. **Deploy**  
   Deploy the `public` folder as a static site (e.g. Netlify). No build step required.

## Local preview

```bash
npm start
```

Serves `public/` at http://localhost:3000.

## Structure

- `public/` – Static site (HTML, CSS, JS). This is what gets deployed.
- `netlify.toml` – Netlify config (publish directory: `public`).
- Playtime checks and game list are provided by the checkaccess Worker; the site only fetches from it.
