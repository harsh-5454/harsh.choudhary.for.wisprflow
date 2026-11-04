import fs from 'fs';

async function getWsUrl() {
  const res = await fetch('http://localhost:9222/json');
  const targets = await res.json();
  const page = targets.find(t => t.type === 'page' && t.url.includes('5173'));
  if (!page) throw new Error('No page target found for 5173');
  return page.webSocketDebuggerUrl;
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(msg.error);
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  async captureScreenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filename, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot ${filename}`);
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  const wsUrl = await getWsUrl();
  const cdp = new CDPClient(wsUrl);
  await cdp.connect();

  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const artifactDir = '/Users/harshchoudhary/.gemini/antigravity/brain/c7b50bb7-fa7f-40cf-82d4-f451097ffb64';

  await cdp.send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 1800));

  const info = await cdp.evaluate(`
    (() => {
      const el = document.getElementById('why-wispr-flow');
      return {
        top: el.offsetTop,
        height: el.offsetHeight,
        windowHeight: window.innerHeight,
      };
    })()
  `);
  console.log('Wispr Section Metrics:', info);

  const wisprStart = info.top;
  const runway = info.height - info.windowHeight;

  // 1. Wispr Drum - Item 0 focus (p = 0.02)
  console.log('\n--- TEST 1: Wispr Section Item 0 Focus ---');
  await cdp.evaluate(`
    window.scrollTo(0, ${wisprStart + 50});
    window.dispatchEvent(new Event('scroll'));
  `);
  await new Promise(r => setTimeout(r, 600));
  await cdp.captureScreenshot(`${artifactDir}/wispr_stage1_item0.png`);

  // 2. Wispr Drum - Item 1 focus (p = 0.33)
  console.log('\n--- TEST 2: Wispr Section Item 1 Focus ---');
  await cdp.evaluate(`
    window.scrollTo(0, ${Math.round(wisprStart + runway * 0.33)});
    window.dispatchEvent(new Event('scroll'));
  `);
  await new Promise(r => setTimeout(r, 600));
  await cdp.captureScreenshot(`${artifactDir}/wispr_stage2_item1.png`);

  // 3. Wispr Drum - Item 2 focus (p = 0.67)
  console.log('\n--- TEST 3: Wispr Section Item 2 Focus ---');
  await cdp.evaluate(`
    window.scrollTo(0, ${Math.round(wisprStart + runway * 0.67)});
    window.dispatchEvent(new Event('scroll'));
  `);
  await new Promise(r => setTimeout(r, 600));
  await cdp.captureScreenshot(`${artifactDir}/wispr_stage3_item2.png`);

  // 4. Wispr Drum - Item 3 focus (p = 0.98)
  console.log('\n--- TEST 4: Wispr Section Item 3 Closing Focus ---');
  await cdp.evaluate(`
    window.scrollTo(0, ${Math.round(wisprStart + runway * 0.98)});
    window.dispatchEvent(new Event('scroll'));
  `);
  await new Promise(r => setTimeout(r, 600));
  await cdp.captureScreenshot(`${artifactDir}/wispr_stage4_item3.png`);

  cdp.close();
}

run().catch(console.error);
