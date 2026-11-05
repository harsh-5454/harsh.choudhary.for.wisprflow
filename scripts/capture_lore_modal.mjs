import fs from 'fs';
import { spawn } from 'child_process';

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--user-data-dir=/tmp/chrome-test-lore-modal',
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

  const newTabRes = await fetch('http://localhost:9223/json/new?http://localhost:5173', { method: 'PUT' });
  const target = await newTabRes.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.onopen = resolve);

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
    deviceScaleFactor: 2,
    mobile: false
  });

  await new Promise(r => setTimeout(r, 2000));

  // Click the lore button
  await send('Runtime.evaluate', {
    expression: 'document.querySelector(".why-me-lore-trigger")?.click();'
  });

  await new Promise(r => setTimeout(r, 1000));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/preview_current_lore_modal.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved scripts/preview_current_lore_modal.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(console.error);
