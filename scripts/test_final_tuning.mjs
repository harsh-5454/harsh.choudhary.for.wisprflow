import fs from 'fs';

async function getWsUrl() {
  const res = await fetch('http://localhost:9222/json');
  const targets = await res.json();
  const page = targets.find(t => t.type === 'page' && t.url.includes('5173'));
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
  await new Promise(r => setTimeout(r, 1200));

  await cdp.evaluate(`
    (() => {
      let el = document.getElementById('final-tuning-style');
      if (!el) {
        el = document.createElement('style');
        el.id = 'final-tuning-style';
        document.head.appendChild(el);
      }
      el.textContent = \`
        .hero-headline-centered {
          top: clamp(6%, 8vh, 10.5%) !important;
        }
        .hero-flanking-subheadings {
          top: clamp(23%, 26vh, 29%) !important;
          width: min(94vw, 71rem) !important;
          left: calc(50% - 1.25rem) !important;
          transform: translateX(-50%) !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          gap: clamp(6rem, 9vw, 10rem) !important;
        }
        .hero-subheading-block--left {
          flex: 0 1 27rem !important;
          max-width: 27rem !important;
          text-align: center !important;
        }
        .hero-subheading-block--right {
          flex: 0 1 24rem !important;
          max-width: 24rem !important;
          text-align: center !important;
          white-space: nowrap !important;
        }
        .hero-supporting-paragraph {
          font-family: var(--font-body) !important;
          font-size: clamp(1.05rem, 1.2vw, 1.1875rem) !important;
          font-weight: 600 !important;
          line-height: 1.52 !important;
          letter-spacing: -0.018em !important;
          color: #0c0c0a !important;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8), 0 0 14px rgba(248, 247, 243, 0.9) !important;
        }
      \`;
    })()
  `);

  // 1. Scroll to 30%
  await cdp.evaluate(`
    window.scrollTo(0, 800);
    window.dispatchEvent(new Event('scroll'));
  `);
  await new Promise(r => setTimeout(r, 400));
  await cdp.captureScreenshot(`${artifactDir}/tuned_30pct.png`);

  // 2. Scroll to 92% (final smile)
  await cdp.evaluate(`
    window.scrollTo(0, 2300);
    window.dispatchEvent(new Event('scroll'));
  `);
  await new Promise(r => setTimeout(r, 800));
  await cdp.captureScreenshot(`${artifactDir}/tuned_92pct.png`);

  cdp.close();
}

run().catch(console.error);
