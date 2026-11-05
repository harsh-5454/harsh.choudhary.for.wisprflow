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

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('DOM.enable');

  const css = `
    .why-me-character-col {
      grid-column: 1 / 7;
    }
    .why-me-attributes-col {
      grid-column: 7 / 13;
      padding-left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    .character-powers-header,
    .character-powers-list,
    .why-me-single-action {
      width: 100%;
      max-width: 44ch;
    }
    .character-powers-header {
      margin-bottom: clamp(1.2rem, 2.2vh, 1.75rem);
    }
    .character-powers-heading {
      font-size: clamp(1.75rem, 2.4vw, 2.35rem);
      line-height: 1.15;
      letter-spacing: -0.025em;
    }
    .character-powers-list {
      display: flex;
      flex-direction: column;
      gap: clamp(1.1rem, 1.8vh, 1.5rem);
    }
    .clay-power-row {
      display: flex;
      align-items: flex-start;
      gap: clamp(1rem, 1.4vw, 1.4rem);
    }
    .clay-power-row__icon-tile {
      flex-shrink: 0;
      width: clamp(48px, 3.8vw, 56px);
      height: clamp(48px, 3.8vw, 56px);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 3px;
    }
    .clay-power-row__main {
      flex: 1 1 0%;
      min-width: 0;
      max-width: none;
      display: flex;
      flex-direction: column;
    }
    .clay-power-row__top {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.4rem;
      width: 100%;
    }
    .clay-power-row__title {
      font-size: clamp(1.15rem, 1.35vw, 1.35rem);
      font-weight: 700;
      letter-spacing: -0.018em;
    }
    .clay-power-row__score {
      font-size: clamp(0.95rem, 1.1vw, 1.1rem);
      font-weight: 650;
      letter-spacing: -0.01em;
    }
    .clay-power-row__bar-track {
      width: 100%;
      height: 16px;
      margin-bottom: 0.5rem;
    }
    .clay-power-row__description {
      font-size: clamp(0.95rem, 1.05vw, 1.0625rem);
      line-height: 1.55;
      color: var(--ink-soft);
    }
    .why-me-single-action {
      margin-top: clamp(1.35rem, 2.5vh, 2rem);
    }
    .why-me-lore-trigger {
      font-size: clamp(1rem, 1.1vw, 1.125rem);
      font-weight: 600;
    }

    @media (max-width: 900px) {
      .why-me-attributes-col {
        grid-column: 1 / -1;
        align-items: flex-start;
      }
      .character-powers-header,
      .character-powers-list,
      .why-me-single-action {
        max-width: 100%;
      }
    }
  `;

  await cdp.evaluate(`
    (() => {
      let style = document.getElementById('test-verify-render');
      if (!style) {
        style = document.createElement('style');
        style.id = 'test-verify-render';
        document.head.appendChild(style);
      }
      style.textContent = \`${css}\`;
    })()
  `);

  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Scroll so we can capture the Wispr section bottom and Character Powers top in one frame if possible,
  // or capture Character Powers full view
  await cdp.evaluate(`
    (() => {
      const el = document.getElementById('why-me');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()
  `);
  await new Promise(r => setTimeout(r, 1000));
  await cdp.captureScreenshot('/tmp/why-me-rendered-1440.png');

  // Let's also capture the right side zoomed in like Image 1 to compare directly with user's upload!
  await cdp.evaluate(`
    (() => {
      window.scrollBy(0, 100);
    })()
  `);
  await new Promise(r => setTimeout(r, 500));
  await cdp.captureScreenshot('/tmp/why-me-rendered-1440-zoomed.png');

  cdp.close();
}

run().catch(console.error);
