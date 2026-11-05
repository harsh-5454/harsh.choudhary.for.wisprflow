import { spawn } from 'child_process';

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--user-data-dir=/tmp/chrome-about-dom-check',
    '--remote-debugging-port=9225',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:9225/json/version');
      if (res.ok) break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  try {
    const newTabRes = await fetch('http://localhost:9225/json/new?http://localhost:5173/about', { method: 'PUT' });
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

    await new Promise(r => setTimeout(r, 1500));

    const domInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const hasProgressRow = !!document.querySelector('.career-progress-row');
          const hasKeySkills = Array.from(document.querySelectorAll('*')).some(el => el.textContent && el.textContent.includes('KEY SKILLS'));
          const hasMakerReflection = Array.from(document.querySelectorAll('*')).some(el => {
            const t = (el.textContent || '').toLowerCase();
            return t.includes("maker's reflection") || t.includes('maker reflection');
          });
          const milestoneElements = Array.from(document.querySelectorAll('.career-chapter-milestone')).map(el => el.textContent.trim());

          // Also check IAN role title when scrolled to station 1
          const st = window.__careerScrollTrigger;
          let ianRole = null;
          if (st) {
            window.scrollTo({ top: st.start + (st.end - st.start) * (1 / 3), behavior: 'instant' });
            st.update();
            const roleEl = document.querySelector('.career-role-title');
            ianRole = roleEl ? roleEl.textContent.trim() : null;
          }

          return {
            hasProgressRow,
            hasKeySkills,
            hasMakerReflection,
            milestoneElements,
            ianRole,
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('DOM verification results:', JSON.stringify(domInfo.result.value, null, 2));

    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
