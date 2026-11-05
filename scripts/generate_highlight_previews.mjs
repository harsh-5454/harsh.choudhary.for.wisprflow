import fs from 'fs';
import { execSync } from 'child_process';

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

  // Set scroll to 2350
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, 2350);
      window.dispatchEvent(new Event('scroll'));
    `
  });
  await new Promise(r => setTimeout(r, 400));

  async function captureVariant(cssStyle, filename) {
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const p = document.querySelector('.wispr-drum-item--closing .wispr-drum-text');
          p.innerText = 'Which is why Wispr Flow is exactly the kind of place I want to go next.';
          p.style.cssText = '${cssStyle}';
        })()
      `
    });
    await new Promise(r => setTimeout(r, 100));
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/temp_full.png', Buffer.from(ss.data, 'base64'));
    // Crop with python
    execSync(`python3 -c "
from PIL import Image
im = Image.open('scripts/temp_full.png')
# crop around closing text: cols 100 to 600, rows 230 to 320
cropped = im.crop((100, 230, 600, 320))
cropped.save('${filename}')
"`);
    console.log('Saved', filename);
  }

  // Variant 1: Pure tactile Clay Green text (#287a4b)
  await captureVariant(
    'color: #287a4b !important; text-shadow: none !important; font-weight: 700 !important;',
    'scripts/var1_clay_green_text.png'
  );

  // Variant 2: Deep Forest Emerald text (#1e6b3e)
  await captureVariant(
    'color: #1a6338 !important; text-shadow: none !important; font-weight: 700 !important;',
    'scripts/var2_deep_emerald.png'
  );

  // Variant 3: Warm Tactile Clay-Yellow Highlighter Marker (editorial pen mark)
  await captureVariant(
    'color: #171715 !important; background: linear-gradient(120deg, rgba(235, 205, 75, 0.45) 0%, rgba(245, 215, 80, 0.55) 100%) !important; -webkit-box-decoration-break: clone; box-decoration-break: clone; padding: 0.14em 0.38em !important; border-radius: 4px !important; font-weight: 700 !important;',
    'scripts/var3_warm_yellow_highlight.png'
  );

  // Variant 4: Soft Mint / Sage Highlighter Marker
  await captureVariant(
    'color: #102416 !important; background: linear-gradient(120deg, rgba(40, 122, 75, 0.20) 0%, rgba(40, 122, 75, 0.28) 100%) !important; -webkit-box-decoration-break: clone; box-decoration-break: clone; padding: 0.14em 0.38em !important; border-radius: 4px !important; font-weight: 700 !important;',
    'scripts/var4_mint_sage_highlight.png'
  );

  // Variant 5: Under-marker highlight wash (subtle baseline pen line)
  await captureVariant(
    'color: #0c0c0a !important; background: linear-gradient(to top, rgba(40, 122, 75, 0.32) 0%, rgba(40, 122, 75, 0.32) 42%, transparent 42%) !important; -webkit-box-decoration-break: clone; box-decoration-break: clone; padding: 0 0.15em !important; font-weight: 700 !important;',
    'scripts/var5_undermarker_line.png'
  );

  // Variant 6: "Wispr Flow" specifically in clay-green with badge/accent
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const p = document.querySelector('.wispr-drum-item--closing .wispr-drum-text');
        p.style.cssText = 'color: #0c0c0a !important; font-weight: 650 !important;';
        p.innerHTML = 'Which is why <span style="color: #287a4b; font-weight: 800; border-bottom: 2.5px solid #287a4b;">Wispr Flow</span> is exactly the kind of place I want to go next.';
      })()
    `
  });
  await new Promise(r => setTimeout(r, 100));
  const ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/temp_full.png', Buffer.from(ss.data, 'base64'));
  execSync(`python3 -c "
from PIL import Image
im = Image.open('scripts/temp_full.png')
cropped = im.crop((100, 230, 600, 320))
cropped.save('scripts/var6_wispr_flow_only.png')
"`);
  console.log('Saved scripts/var6_wispr_flow_only.png');

  ws.close();
};
