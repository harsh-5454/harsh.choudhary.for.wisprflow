import fs from 'fs';
import { spawn } from 'child_process';

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--user-data-dir=/tmp/chrome-about-test-2',
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
    console.log('Target created:', target.webSocketDebuggerUrl);

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

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      return res.result?.value;
    }

    async function captureScreenshot(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(filename, Buffer.from(res.data, 'base64'));
      console.log(`Saved screenshot ${filename}`);
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    // 1440x900 desktop viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // Wait for react app to mount
    for (let i = 0; i < 40; i++) {
      const ready = await evaluate(`!!document.querySelector('.career-index-item') && !!window.__careerScrollTrigger`);
      if (ready) break;
      await new Promise(r => setTimeout(r, 200));
    }
    await new Promise(r => setTimeout(r, 1000));

    // Get ScrollTrigger info
    const info = await evaluate(`
      (() => {
        const st = window.__careerScrollTrigger;
        return {
          hasSt: !!st,
          start: st ? st.start : null,
          end: st ? st.end : null,
          buttonsCount: document.querySelectorAll('.career-index-item').length
        };
      })()
    `);
    console.log('ScrollTrigger status:', info);

    const chapters = [
      { idx: 0, name: '01_grant_thornton' },
      { idx: 1, name: '02_ian' },
      { idx: 2, name: '03_kalaari' },
      { idx: 3, name: '04_garage' },
    ];

    for (const ch of chapters) {
      console.log(`\nNavigating to chapter ${ch.name} (index ${ch.idx})...`);

      await evaluate(`
        (() => {
          const st = window.__careerScrollTrigger;
          if (st) {
            const targetScroll = st.start + (st.end - st.start) * (${ch.idx} / 3);
            window.scrollTo({ top: targetScroll, behavior: 'instant' });
            st.update();
          } else {
            const btns = document.querySelectorAll('.career-index-item');
            if (btns[${ch.idx}]) btns[${ch.idx}].click();
          }
        })()
      `);

      await new Promise(r => setTimeout(r, 1000));

      const state = await evaluate(`
        (() => {
          const worldTrack = document.querySelector('.career-buildings-track');
          const sceneryTrack = document.querySelector('.career-scenery-track');
          const stations = Array.from(document.querySelectorAll('.career-building-station')).map(s => {
            const r = s.getBoundingClientRect();
            const img = s.querySelector('.career-building-image');
            return {
              left: Math.round(r.left),
              right: Math.round(r.right),
              imgSrc: img ? (img.currentSrc || img.src).split('/').pop() : null,
              imgComplete: img ? img.complete : null,
              imgWidth: img ? img.width : null,
              imgHeight: img ? img.height : null,
            };
          });

          return {
            worldTransform: worldTrack ? worldTrack.style.transform : null,
            sceneryTransform: sceneryTrack ? sceneryTrack.style.transform : null,
            stations,
          };
        })()
      `);
      console.log(`State for ${ch.name}:`, JSON.stringify(state, null, 2));

      await captureScreenshot(`scripts/refine_${ch.name}.png`);
    }

    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
