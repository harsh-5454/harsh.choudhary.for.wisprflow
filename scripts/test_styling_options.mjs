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

  // VARIANT 1: Symmetrical flanking with wide balanced wraps & punchy bold dark ink
  await cdp.send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 1500));
  await cdp.evaluate(`
    window.scrollTo(0, 800);
    window.dispatchEvent(new Event('scroll'));
  `);
  await new Promise(r => setTimeout(r, 400));

  await cdp.evaluate(`
    (() => {
      let el = document.getElementById('variant-style');
      if (!el) {
        el = document.createElement('style');
        el.id = 'variant-style';
        document.head.appendChild(el);
      }
      el.textContent = \`
        .hero-flanking-subheadings {
          top: 25vh !important;
          width: min(94vw, 68rem) !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
        }
        .hero-subheading-block {
          max-width: 25rem !important;
          flex: 0 1 25rem !important;
          text-align: center !important;
        }
        .hero-subheading-block--right {
          max-width: 24rem !important;
          flex: 0 1 24rem !important;
        }
        .hero-supporting-paragraph {
          font-family: var(--font-body) !important;
          font-size: 1.15rem !important;
          font-weight: 550 !important;
          line-height: 1.55 !important;
          letter-spacing: -0.015em !important;
          color: #121210 !important;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.6), 0 0 12px rgba(248, 247, 243, 0.8) !important;
        }
      \`;
    })()
  `);
  await new Promise(r => setTimeout(r, 300));
  await cdp.captureScreenshot(`${artifactDir}/test_v1_flanking_30.png`);

  // VARIANT 2: Centered two-column editorial pair directly under headline (gap 3rem)
  await cdp.evaluate(`
    (() => {
      const el = document.getElementById('variant-style');
      el.textContent = \`
        .hero-headline-centered {
          top: 9vh !important;
        }
        .hero-flanking-subheadings {
          top: 25.5vh !important;
          width: min(92vw, 48rem) !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          display: flex !important;
          justify-content: center !important;
          gap: 3.5rem !important;
          align-items: flex-start !important;
        }
        .hero-subheading-block {
          flex: 1 1 0 !important;
          max-width: 22rem !important;
          text-align: center !important;
        }
        .hero-supporting-paragraph {
          font-family: var(--font-body) !important;
          font-size: 1.125rem !important;
          font-weight: 550 !important;
          line-height: 1.55 !important;
          letter-spacing: -0.015em !important;
          color: #111110 !important;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.6), 0 0 12px rgba(248, 247, 243, 0.8) !important;
        }
      \`;
    })()
  `);
  await new Promise(r => setTimeout(r, 300));
  await cdp.captureScreenshot(`${artifactDir}/test_v2_centered_pair_30.png`);

  // VARIANT 3: Centered stacked editorial lines (headline -> left block -> right block) in whitespace
  await cdp.evaluate(`
    (() => {
      const el = document.getElementById('variant-style');
      el.textContent = \`
        .hero-headline-centered {
          top: 9vh !important;
        }
        .hero-flanking-subheadings {
          top: 25vh !important;
          width: min(90vw, 36rem) !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 1rem !important;
        }
        .hero-subheading-block {
          max-width: 36rem !important;
          text-align: center !important;
        }
        .hero-supporting-paragraph {
          font-family: var(--font-body) !important;
          font-size: 1.15rem !important;
          font-weight: 550 !important;
          line-height: 1.55 !important;
          letter-spacing: -0.015em !important;
          color: #111110 !important;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.6), 0 0 12px rgba(248, 247, 243, 0.8) !important;
        }
      \`;
    })()
  `);
  await new Promise(r => setTimeout(r, 300));
  await cdp.captureScreenshot(`${artifactDir}/test_v3_stacked_30.png`);

  // VARIANT 4: Flanking, but left-block text-align: right (facing character), right-block text-align: left (facing character)
  // This is a classic editorial composition where flanking text frames the subject!
  await cdp.evaluate(`
    (() => {
      const el = document.getElementById('variant-style');
      el.textContent = \`
        .hero-flanking-subheadings {
          top: 25vh !important;
          width: min(92vw, 64rem) !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          gap: 18rem !important;
        }
        .hero-subheading-block--left {
          max-width: 22rem !important;
          text-align: right !important;
        }
        .hero-subheading-block--right {
          max-width: 22rem !important;
          text-align: left !important;
        }
        .hero-supporting-paragraph {
          font-family: var(--font-body) !important;
          font-size: 1.15rem !important;
          font-weight: 550 !important;
          line-height: 1.55 !important;
          letter-spacing: -0.015em !important;
          color: #111110 !important;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.6), 0 0 12px rgba(248, 247, 243, 0.8) !important;
        }
      \`;
    })()
  `);
  await new Promise(r => setTimeout(r, 300));
  await cdp.captureScreenshot(`${artifactDir}/test_v4_facing_30.png`);

  cdp.close();
}

run().catch(console.error);
