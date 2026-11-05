import fs from 'fs';
import { spawn } from 'child_process';

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--user-data-dir=/tmp/chrome-about-mobile',
    '--remote-debugging-port=9222',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:9222/json/version');
      if (res.ok) break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  try {
    const newTabRes = await fetch('http://localhost:9222/json/new?http://localhost:5173/about', { method: 'PUT' });
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

    // 390x844 mobile viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    await new Promise(r => setTimeout(r, 2000));

    const res = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/mobile_about_top.png', Buffer.from(res.data, 'base64'));
    console.log('Saved scripts/mobile_about_top.png');

    // Scroll to chapter 1 on mobile
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const ch1 = document.querySelector('.career-vertical-chapter');
          if (ch1) ch1.scrollIntoView();
        })()
      `,
    });
    await new Promise(r => setTimeout(r, 800));

    const res2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/mobile_chapter_1.png', Buffer.from(res2.data, 'base64'));
    console.log('Saved scripts/mobile_chapter_1.png');

    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

