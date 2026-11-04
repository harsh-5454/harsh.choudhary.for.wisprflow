import fs from 'fs';

async function run() {
  const res = await fetch('http://localhost:9222/json');
  const targets = await res.json();
  const page = targets.find(t => t.type === 'page' && t.url.includes('5173'));
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const cbs = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && cbs.has(msg.id)) {
      cbs.get(msg.id)(msg.result);
      cbs.delete(msg.id);
    }
  };
  const send = (method, params = {}) => new Promise(res => {
    const curId = id++;
    cbs.set(curId, res);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await new Promise(r => ws.onopen = r);

  // Set device metrics to 1440 width and scroll to top
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Runtime.evaluate', {
    expression: 'window.scrollTo(0, 0); window.dispatchEvent(new Event("scroll"));'
  });
  await new Promise(r => setTimeout(r, 400));

  // Load Syne and Space Grotesk
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        if (!document.getElementById('quirky-fonts-link')) {
          const link = document.createElement('link');
          link.id = 'quirky-fonts-link';
          link.rel = 'stylesheet';
          link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Syne:wght@700;800&family=Cabinet+Grotesk:wght@700;800&display=swap';
          document.head.appendChild(link);
        }
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  // Current
  let snap = await send('Page.captureScreenshot', {
    clip: { x: 0, y: 0, width: 1440, height: 90, scale: 2 }
  });
  fs.writeFileSync('scripts/header_current.png', Buffer.from(snap.data, 'base64'));

  // Option 1: Bricolage Grotesque (Bold 700, opsz 96, font-size: 1.0625rem / 17px - exactly +9.6% over 15.5px)
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        let el = document.getElementById('header-test-style');
        if (!el) {
          el = document.createElement('style');
          el.id = 'header-test-style';
          document.head.appendChild(el);
        }
        el.textContent = \`
          .site-header__brand,
          .site-header__nav-link {
            font-family: var(--font-display) !important;
            font-variation-settings: "opsz" 96, "wdth" 100 !important;
            font-weight: 700 !important;
            font-size: 1.0625rem !important;
            letter-spacing: -0.025em !important;
          }
        \`;
      })()
    `
  });
  await new Promise(r => setTimeout(r, 200));
  snap = await send('Page.captureScreenshot', {
    clip: { x: 0, y: 0, width: 1440, height: 90, scale: 2 }
  });
  fs.writeFileSync('scripts/header_bricolage.png', Buffer.from(snap.data, 'base64'));

  // Option 2: Syne 700 (Very fun, quirky flared wide geometric)
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.getElementById('header-test-style').textContent = \`
          .site-header__brand,
          .site-header__nav-link {
            font-family: "Syne", sans-serif !important;
            font-weight: 700 !important;
            font-size: 1.05rem !important;
            letter-spacing: -0.015em !important;
          }
        \`;
      })()
    `
  });
  await new Promise(r => setTimeout(r, 400));
  snap = await send('Page.captureScreenshot', {
    clip: { x: 0, y: 0, width: 1440, height: 90, scale: 2 }
  });
  fs.writeFileSync('scripts/header_syne.png', Buffer.from(snap.data, 'base64'));

  // Option 3: Space Grotesk 700 (Quirky modernist tech sans)
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.getElementById('header-test-style').textContent = \`
          .site-header__brand,
          .site-header__nav-link {
            font-family: "Space Grotesk", sans-serif !important;
            font-weight: 700 !important;
            font-size: 1.0625rem !important;
            letter-spacing: -0.02em !important;
          }
        \`;
      })()
    `
  });
  await new Promise(r => setTimeout(r, 400));
  snap = await send('Page.captureScreenshot', {
    clip: { x: 0, y: 0, width: 1440, height: 90, scale: 2 }
  });
  fs.writeFileSync('scripts/header_space_grotesk.png', Buffer.from(snap.data, 'base64'));

  // Option 4: Fraunces 700 (Quirky wonky soft serif)
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.getElementById('header-test-style').textContent = \`
          .site-header__brand,
          .site-header__nav-link {
            font-family: var(--font-serif) !important;
            font-variation-settings: "opsz" 72, "WONK" 1 !important;
            font-weight: 700 !important;
            font-size: 1.0625rem !important;
            letter-spacing: -0.015em !important;
          }
        \`;
      })()
    `
  });
  await new Promise(r => setTimeout(r, 200));
  snap = await send('Page.captureScreenshot', {
    clip: { x: 0, y: 0, width: 1440, height: 90, scale: 2 }
  });
  fs.writeFileSync('scripts/header_fraunces.png', Buffer.from(snap.data, 'base64'));

  // Reset
  await send('Runtime.evaluate', {
    expression: `document.getElementById('header-test-style')?.remove();`
  });

  console.log('Done!');
  ws.close();
}

run().catch(console.error);
