import fs from 'fs';
import { spawn } from 'child_process';

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--user-data-dir=/tmp/chrome-about-between',
    '--remote-debugging-port=9223',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:9223/json/version');
      if (res.ok) break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  try {
    const newTabRes = await fetch('http://localhost:9223/json/new?http://localhost:5173/about', { method: 'PUT' });
    const target = await newTabRes.json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    const callbacks = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const cb = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) cb.reject(msg.error);
        else cb.resolve(msg.result);
      }
    };

    function send(method, params = {}) {
      const id = msgId++;
      return new Promise((resolve, reject) => {
        callbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await new Promise(r => setTimeout(r, 2000));

    // Scroll to halfway between station 0 and station 1
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const st = window.__careerScrollTrigger;
          if (st) {
            const targetScroll = st.start + (st.end - st.start) * (0.5 / 3);
            window.scrollTo({ top: targetScroll, behavior: 'instant' });
            st.update();
          }
        })()
      `,
    });
    await new Promise(r => setTimeout(r, 800));

    const res = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/preview_scrolling_between_buildings.png', Buffer.from(res.data, 'base64'));
    console.log('Saved scripts/preview_scrolling_between_buildings.png');

    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
