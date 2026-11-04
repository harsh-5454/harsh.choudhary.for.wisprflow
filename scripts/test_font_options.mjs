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
    window.scrollTo(0, 800);
    window.dispatchEvent(new Event('scroll'));
  `);
  await new Promise(r => setTimeout(r, 400));

  // OPTION 1: Bold Sans (Plus Jakarta Sans, weight 600, color #111110)
  await cdp.evaluate(`
    (() => {
      let el = document.getElementById('font-style');
      if (!el) {
        el = document.createElement('style');
        el.id = 'font-style';
        document.head.appendChild(el);
      }
      el.textContent = \`
        .hero-flanking-subheadings {
          top: 24vh !important;
          width: min(92vw, 60rem) !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          gap: 6rem !important;
        }
        .hero-subheading-block--left {
          max-width: 25rem !important;
          text-align: center !important;
        }
        .hero-subheading-block--right {
          max-width: 24rem !important;
          text-align: center !important;
          white-space: nowrap !important;
        }
        .hero-supporting-paragraph {
          font-family: var(--font-body) !important;
          font-size: 1.15rem !important;
          font-weight: 600 !important;
          line-height: 1.55 !important;
          letter-spacing: -0.015em !important;
          color: #0f0f0e !important;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7), 0 0 12px rgba(248, 247, 243, 0.9) !important;
        }
      \`;
    })()
  `);
  await new Promise(r => setTimeout(r, 300));
  await cdp.captureScreenshot(`${artifactDir}/font_opt1_bold_sans.png`);

  // OPTION 2: Fraunces Serif (optical, weight 450, 1.25rem, color #0f0f0e)
  await cdp.evaluate(`
    (() => {
      const el = document.getElementById('font-style');
      el.textContent = \`
        .hero-flanking-subheadings {
          top: 24vh !important;
          width: min(92vw, 60rem) !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          gap: 6rem !important;
        }
        .hero-subheading-block--left {
          max-width: 25rem !important;
          text-align: center !important;
        }
        .hero-subheading-block--right {
          max-width: 24rem !important;
          text-align: center !important;
          white-space: nowrap !important;
        }
        .hero-supporting-paragraph {
          font-family: var(--font-serif) !important;
          font-size: 1.25rem !important;
          font-weight: 450 !important;
          line-height: 1.45 !important;
          letter-spacing: -0.015em !important;
          color: #0f0f0e !important;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7), 0 0 12px rgba(248, 247, 243, 0.9) !important;
        }
      \`;
    })()
  `);
  await new Promise(r => setTimeout(r, 300));
  await cdp.captureScreenshot(`${artifactDir}/font_opt2_serif.png`);

  // OPTION 3: Plus Jakarta Sans 600, but in a refined centered pair with subtle background badge / subtle backdrop pill or pill-less cardless container
  await cdp.evaluate(`
    (() => {
      const el = document.getElementById('font-style');
      el.textContent = \`
        .hero-flanking-subheadings {
          top: 24.5vh !important;
          width: min(92vw, 56rem) !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          gap: 4rem !important;
        }
        .hero-subheading-block--left {
          flex: 1 1 0 !important;
          max-width: 26rem !important;
          text-align: center !important;
        }
        .hero-subheading-block--right {
          flex: 1 1 0 !important;
          max-width: 24rem !important;
          text-align: center !important;
        }
        .hero-supporting-paragraph {
          font-family: var(--font-body) !important;
          font-size: 1.1875rem !important;
          font-weight: 600 !important;
          line-height: 1.5 !important;
          letter-spacing: -0.018em !important;
          color: #0c0c0a !important;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8), 0 0 14px rgba(248, 247, 243, 0.9) !important;
        }
      \`;
    })()
  `);
  await new Promise(r => setTimeout(r, 300));
  await cdp.captureScreenshot(`${artifactDir}/font_opt3_refined_pair.png`);

  // Capture at 92% scroll (final smile)
  await cdp.evaluate(`
    window.scrollTo(0, 2300);
    window.dispatchEvent(new Event('scroll'));
  `);
  await new Promise(r => setTimeout(r, 800));
  await cdp.captureScreenshot(`${artifactDir}/font_opt3_at_92.png`);

  cdp.close();
}

run().catch(console.error);
