const { app, BrowserWindow } = require('electron');
const path = require('path');

const DEFAULT_URL = 'https://crm-frontend-blue-six.vercel.app';
const APP_URL = process.env.APP_URL || DEFAULT_URL;

function createLoadingWindow() {
  const loading = new BrowserWindow({
    width: 560,
    height: 340,
    frame: false,
    resizable: false,
    movable: false,
    center: true,
    transparent: true,
    backgroundColor: '#0b1120',
    icon: path.join(__dirname, 'app-icon.ico'),
  });

  loading.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          :root {
            --bg-1: #040d1a;
            --bg-2: #0b1f2d;
            --panel: rgba(10, 19, 31, 0.96);
            --line: rgba(45, 212, 191, 0.38);
            --teal: #20d7c3;
            --teal-soft: #8cf1ea;
            --gold: #f7c948;
            --text: #edf6ff;
            --muted: #9fb9c8;
          }

          html, body {
            margin: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background:
              radial-gradient(circle at top, rgba(32, 215, 195, 0.16), transparent 30%),
              linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 55%, #0f172a 100%);
          }

          .card {
            width: 520px;
            height: 310px;
            position: relative;
            background: linear-gradient(180deg, rgba(9, 20, 31, 0.96), rgba(11, 27, 38, 0.94));
            border: 1px solid var(--line);
            border-radius: 30px;
            box-shadow: 0 28px 90px rgba(2, 8, 23, 0.8);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text);
          }

          .card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(247, 201, 72, 0.06), transparent 28%, rgba(32, 215, 195, 0.08));
          }

          .content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .brand-wrap {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;
          }

          .logo {
            width: 82px;
            height: 82px;
            border-radius: 22px;
            background: linear-gradient(135deg, var(--gold), var(--teal), #0b1f2d 100%);
            box-shadow: 0 16px 30px rgba(32, 215, 195, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            font-weight: 900;
            color: #07121d;
            letter-spacing: 1px;
          }

          .company {
            font-weight: 800;
            font-size: 22px;
            letter-spacing: 2px;
            color: white;
          }

          .tag {
            font-size: 10px;
            letter-spacing: 4px;
            color: var(--teal-soft);
            text-transform: uppercase;
            opacity: 0.9;
          }

          h1 {
            margin: 0;
            font-size: 29px;
            line-height: 1.2;
            letter-spacing: 0.2px;
            font-weight: 700;
            color: var(--text);
          }

          .subtitle {
            margin-top: 10px;
            color: var(--gold);
            font-size: 12px;
            letter-spacing: 0.24em;
            text-transform: uppercase;
            font-weight: 700;
          }

          .stats {
            display: flex;
            gap: 12px;
            margin-top: 22px;
          }

          .pill {
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(247, 201, 72, 0.08);
            border: 1px solid rgba(247, 201, 72, 0.25);
            color: #f8f1d6;
            font-size: 10px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }

          .loader {
            margin-top: 24px;
            width: 190px;
            height: 8px;
            border-radius: 999px;
            background: rgba(148, 163, 184, 0.16);
            overflow: hidden;
            position: relative;
          }

          .loader::before {
            content: '';
            position: absolute;
            inset: 0;
            width: 46%;
            background: linear-gradient(90deg, var(--gold), var(--teal), var(--teal-soft));
            border-radius: inherit;
            animation: slide 1.8s ease-in-out infinite;
            box-shadow: 0 0 18px rgba(32, 215, 195, 0.8);
          }

          @keyframes slide {
            0% { transform: translateX(-120%); }
            100% { transform: translateX(220%); }
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="content">
            <div class="brand-wrap">
              <div class="logo">S</div>
              <div>
                <div class="company">SATYAM</div>
                <div class="tag">Trading Desk</div>
              </div>
            </div>

            <h1>CRM & Operations Suite</h1>
            <div class="subtitle">Launching platform</div>

            <div class="stats">
              <div class="pill">Secure</div>
              <div class="pill">Live</div>
              <div class="pill">Smart</div>
            </div>

            <div class="loader"></div>
          </div>
        </div>
      </body>
    </html>
  `)}`);

  return loading;
}

function createWindow() {
  const loading = createLoadingWindow();
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1200,
    minHeight: 760,
    autoHideMenuBar: true,
    backgroundColor: '#0f172a',
    title: 'Satyam CRM',
    icon: path.join(__dirname, 'app-icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  win.loadURL(APP_URL);

  win.once('ready-to-show', () => {
    setTimeout(() => {
      loading.close();
      win.show();
    }, 1500);
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
