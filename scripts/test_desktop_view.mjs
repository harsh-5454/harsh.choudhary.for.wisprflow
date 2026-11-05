import fs from 'fs';

const wsUrl = 'ws://localhost:9333/devtools/page/DABF3CB62B90A152C0B88EAB518E11F7';
const ws = new WebSocket(wsUrl);

ws.onopen = async () => {
  let id = 1;
  function send(method, params = {}) {
    return new Promise(resolve => {
      const msgId = id++;
      const handler = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  // Set desktop viewport 1440x900
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await new Promise(r => setTimeout(r, 400));

  // Find why-wispr-flow section position
  const info = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const sec = document.getElementById('why-wispr-flow');
        const absTop = sec.offsetTop;
        const runway = sec.offsetHeight - window.innerHeight;
        const target = absTop + runway * 0.95;
        window.scrollTo(0, target);
        window.dispatchEvent(new Event('scroll'));
        return { absTop, runway, target };
      })()
    `,
    returnByValue: true
  });
  console.log('Desktop info:', info.result.value);

  await new Promise(r => setTimeout(r, 600));

  // Set Option 1: Clay Green
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const p = document.querySelector('.wispr-drum-item--closing .wispr-drum-text');
        p.innerText = 'Which is why Wispr Flow is exactly the kind of place I want to go next.';
        p.style.cssText = 'color: #287a4b !important; text-shadow: none !important; font-weight: 700 !important;';
      })()
    `
  });
  await new Promise(r => setTimeout(r, 200));

  const ssDesktop = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/desktop_variant_1_clay_green.png', Buffer.from(ssDesktop.data, 'base64'));
  console.log('Saved scripts/desktop_variant_1_clay_green.png');

  ws.close();
};
