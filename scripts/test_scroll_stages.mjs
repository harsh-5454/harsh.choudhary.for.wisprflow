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
  console.log('Connected to CDP at', wsUrl);

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('DOM.enable');

  // Enforce desktop viewport 1440x900
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await cdp.send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 2200));

  const metrics = await cdp.evaluate(`
    (() => {
      const container = document.querySelector('.hero-scroll-container');
      const dist = container.offsetHeight - window.innerHeight;
      return {
        containerHeight: container.offsetHeight,
        windowHeight: window.innerHeight,
        maxScroll: dist
      };
    })()
  `);
  console.log('Hero Container Metrics:', metrics);
  const maxScroll = metrics.maxScroll;

  const artifactDir = '/Users/harshchoudhary/.gemini/antigravity/brain/c7b50bb7-fa7f-40cf-82d4-f451097ffb64';

  console.log('\n--- TEST 1: Initial Load (0% scroll) ---');
  let info = await cdp.evaluate(`
    (() => {
      const heading = document.querySelector('.hero-headline-centered');
      const leftSub = document.querySelector('.hero-subheading-block--left');
      const rightSub = document.querySelector('.hero-subheading-block--right');
      const siteHeader = document.querySelector('.site-header');
      const scrollPill = document.querySelector('.hero-scroll-pill');
      const video = document.querySelector('video');

      const headerStyle = siteHeader ? window.getComputedStyle(siteHeader) : null;
      const leftRect = leftSub ? leftSub.getBoundingClientRect() : null;
      const rightRect = rightSub ? rightSub.getBoundingClientRect() : null;
      const headingRect = heading ? heading.getBoundingClientRect() : null;

      return {
        videoPaused: video ? video.paused : null,
        currentTime: video ? video.currentTime : null,
        headingOpacity: heading ? window.getComputedStyle(heading).opacity : null,
        leftSubOpacity: leftSub ? window.getComputedStyle(leftSub).opacity : null,
        rightSubOpacity: rightSub ? window.getComputedStyle(rightSub).opacity : null,
        scrollPillExists: scrollPill !== null,
        headerBg: headerStyle ? headerStyle.backgroundColor : null,
        headerBorder: headerStyle ? headerStyle.borderBottom : null,
        headingTop: headingRect ? headingRect.top : null,
        leftSubTop: leftRect ? leftRect.top : null,
        rightSubTop: rightRect ? rightRect.top : null,
        gapBetweenSubs: (leftRect && rightRect) ? (rightRect.left - leftRect.right) : null,
      };
    })()
  `);
  console.log('Stage 1 (Opening 0%):', info);
  await cdp.captureScreenshot(`${artifactDir}/stage1_opening.png`);

  console.log('\n--- TEST 2: Scroll a little (12% scroll) ---');
  await cdp.evaluate(`
    window.scrollTo(0, ${Math.round(maxScroll * 0.12)});
    window.dispatchEvent(new Event('scroll'));
  `);
  await new Promise(r => setTimeout(r, 800));
  info = await cdp.evaluate(`
    (() => {
      const heading = document.querySelector('.hero-headline-centered');
      const leftSub = document.querySelector('.hero-subheading-block--left');
      const rightSub = document.querySelector('.hero-subheading-block--right');
      const video = document.querySelector('video');
      return {
        currentTime: video ? video.currentTime : null,
        headingOpacity: heading ? window.getComputedStyle(heading).opacity : null,
        leftSubOpacity: leftSub ? window.getComputedStyle(leftSub).opacity : null,
        rightSubOpacity: rightSub ? window.getComputedStyle(rightSub).opacity : null,
      };
    })()
  `);
  console.log('Stage 2 (12% scroll):', info);
  await cdp.captureScreenshot(`${artifactDir}/stage2_little_scroll.png`);

  console.log('\n--- TEST 3: Scroll a little more (30% scroll) ---');
  await cdp.evaluate(`
    window.scrollTo(0, ${Math.round(maxScroll * 0.30)});
    window.dispatchEvent(new Event('scroll'));
  `);
  await new Promise(r => setTimeout(r, 800));
  info = await cdp.evaluate(`
    (() => {
      const heading = document.querySelector('.hero-headline-centered');
      const leftSub = document.querySelector('.hero-subheading-block--left');
      const rightSub = document.querySelector('.hero-subheading-block--right');
      const video = document.querySelector('video');
      return {
        currentTime: video ? video.currentTime : null,
        headingOpacity: heading ? window.getComputedStyle(heading).opacity : null,
        leftSubOpacity: leftSub ? window.getComputedStyle(leftSub).opacity : null,
        rightSubOpacity: rightSub ? window.getComputedStyle(rightSub).opacity : null,
      };
    })()
  `);
  console.log('Stage 3 (30% scroll):', info);
  await cdp.captureScreenshot(`${artifactDir}/stage3_more_scroll.png`);

  console.log('\n--- TEST 4: Scroll down through video (75% scroll) ---');
  await cdp.evaluate(`
    window.scrollTo(0, ${Math.round(maxScroll * 0.75)});
    window.dispatchEvent(new Event('scroll'));
  `);
  await new Promise(r => setTimeout(r, 1000));
  info = await cdp.evaluate(`
    (() => {
      const heading = document.querySelector('.hero-headline-centered');
      const leftSub = document.querySelector('.hero-subheading-block--left');
      const rightSub = document.querySelector('.hero-subheading-block--right');
      const video = document.querySelector('video');
      const siteHeader = document.querySelector('.site-header');
      const headerStyle = siteHeader ? window.getComputedStyle(siteHeader) : null;
      return {
        currentTime: video ? video.currentTime : null,
        headingOpacity: heading ? window.getComputedStyle(heading).opacity : null,
        leftSubOpacity: leftSub ? window.getComputedStyle(leftSub).opacity : null,
        rightSubOpacity: rightSub ? window.getComputedStyle(rightSub).opacity : null,
        headerBg: headerStyle ? headerStyle.backgroundColor : null,
      };
    })()
  `);
  console.log('Stage 4 (75% scroll):', info);
  await cdp.captureScreenshot(`${artifactDir}/stage4_video_progress.png`);

  console.log('\n--- TEST 5: Scroll near end of video / final smile (95% scroll) ---');
  await cdp.evaluate(`
    window.scrollTo(0, ${Math.round(maxScroll * 0.95)});
    window.dispatchEvent(new Event('scroll'));
  `);
  await new Promise(r => setTimeout(r, 1000));
  info = await cdp.evaluate(`
    (() => {
      const heading = document.querySelector('.hero-headline-centered');
      const leftSub = document.querySelector('.hero-subheading-block--left');
      const rightSub = document.querySelector('.hero-subheading-block--right');
      const video = document.querySelector('video');
      return {
        currentTime: video ? video.currentTime : null,
        headingOpacity: heading ? window.getComputedStyle(heading).opacity : null,
        leftSubOpacity: leftSub ? window.getComputedStyle(leftSub).opacity : null,
        rightSubOpacity: rightSub ? window.getComputedStyle(rightSub).opacity : null,
      };
    })()
  `);
  console.log('Stage 5 (95% scroll - Final Smile, Text Stays Visible):', info);
  await cdp.captureScreenshot(`${artifactDir}/stage5_final_smile_text_visible.png`);

  console.log('\n--- TEST 6: Scroll past hero (unpins and scrolls naturally) ---');
  await cdp.evaluate(`
    window.scrollTo(0, ${Math.round(maxScroll * 1.08)});
    window.dispatchEvent(new Event('scroll'));
  `);
  await new Promise(r => setTimeout(r, 800));
  info = await cdp.evaluate(`
    (() => {
      const heroContainer = document.querySelector('.hero-scroll-container');
      const heroRect = heroContainer ? heroContainer.getBoundingClientRect() : null;
      const wisprSection = document.querySelector('.wispr-section');
      const wisprRect = wisprSection ? wisprSection.getBoundingClientRect() : null;
      return {
        heroContainerTop: heroRect ? heroRect.top : null,
        wisprSectionTop: wisprRect ? wisprRect.top : null,
      };
    })()
  `);
  console.log('Stage 6 (Unpinned scroll into Section 2):', info);
  await cdp.captureScreenshot(`${artifactDir}/stage6_unpinned_scroll.png`);

  cdp.close();
  console.log('\nALL CDP VERIFICATION TESTS COMPLETED!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
