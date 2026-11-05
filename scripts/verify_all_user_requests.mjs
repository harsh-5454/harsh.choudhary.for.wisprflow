import fs from 'fs';
import { spawn } from 'child_process';

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--user-data-dir=/tmp/chrome-about-verify-reqs',
    '--remote-debugging-port=9224',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:9224/json/version');
      if (res.ok) break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  try {
    const newTabRes = await fetch('http://localhost:9224/json/new?http://localhost:5173/about', { method: 'PUT' });
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

    await new Promise(r => setTimeout(r, 1500));

    // Capture initial fold at scroll 0
    const resFold = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/about_fold_page_load.png', Buffer.from(resFold.data, 'base64'));
    console.log('Saved scripts/about_fold_page_load.png');

    // Check CareerJourney bounding rect at scroll 0
    const foldState = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const section = document.querySelector('.career-journey-pinned-section');
          const intro = document.querySelector('.about-intro-section');
          return {
            introHeight: intro ? Math.round(intro.getBoundingClientRect().height) : null,
            careerJourneyTop: section ? Math.round(section.getBoundingClientRect().top) : null,
            windowInnerHeight: window.innerHeight,
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Fold measurements at scroll 0:', foldState.result.value);

    // Now capture all 4 scenes
    const scenes = [
      { idx: 0, name: 'gt' },
      { idx: 1, name: 'ian' },
      { idx: 2, name: 'kalaari' },
      { idx: 3, name: 'garage' },
    ];

    for (const sc of scenes) {
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const st = window.__careerScrollTrigger;
            if (st) {
              const targetScroll = st.start + (st.end - st.start) * (${sc.idx} / 3);
              window.scrollTo({ top: targetScroll, behavior: 'instant' });
              st.update();
            }
          })()
        `,
      });

      await new Promise(r => setTimeout(r, 800));

      const res = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`scripts/about_scene_${sc.name}.png`, Buffer.from(res.data, 'base64'));
      console.log(`Saved scripts/about_scene_${sc.name}.png`);
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
