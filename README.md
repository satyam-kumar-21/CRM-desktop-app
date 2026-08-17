# Satyam CRM Desktop

Single portable Windows app that opens the live Satyam CRM web interface in a native desktop window.

## What you get

After building, you get **one file**:

`dist/SatyamCRM-Portable.exe`

Copy this file to Desktop (or share it with anyone). Double-click to open — no installation required.

## Requirements for end users

- Windows 10 or 11 (64-bit)
- Internet connection (the app loads the live CRM from Vercel)

## Run locally (development)

```bash
npm install
npm start
```

## Build the portable EXE

From PowerShell in this folder:

```powershell
$env:CSC_IDENTITY_AUTO_DISCOVERY='false'
npm run dist
```

Or use the helper script:

```bash
npm run dist:ps
```

Output: `dist/SatyamCRM-Portable.exe`

## Share with others

1. Run `npm run dist` (or `npm run dist:ps` on Windows)
2. Send `dist/SatyamCRM-Portable.exe` to anyone
3. They save it anywhere (Desktop, Downloads, etc.) and double-click to launch

No Node.js, no setup, no installer — just the one `.exe` file.

## Optional: point to a different URL

```powershell
$env:APP_URL='https://your-custom-url.com'
npm start
```

Default URL: `https://crm-frontend-blue-six.vercel.app`
