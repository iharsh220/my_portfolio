'use strict';

/* ============================================================
   HARSH GOHIL PORTFOLIO v2 — interactions
   ============================================================ */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const sysDark = window.matchMedia('(prefers-color-scheme: dark)');

// ── THEME (system default → light → dark) ─────────────────────
const Theme = (() => {
  const root = document.documentElement;
  const btn = $('#themeToggle');
  const label = $('#themeLabel');
  const order = ['system', 'light', 'dark'];
  const names = { system: 'Auto', light: 'Light', dark: 'Dark' };
  let mode = 'system';
  try { const s = localStorage.getItem('hg-theme'); if (s === 'light' || s === 'dark') mode = s; } catch (e) {}

  const isDark = () => (mode === 'system' ? sysDark.matches : mode === 'dark');

  function apply() {
    if (mode === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
    if (btn) {
      btn.dataset.mode = mode;
      const t = `Theme: ${mode === 'system' ? 'follow system (' + (isDark() ? 'dark' : 'light') + ')' : mode}`;
      btn.setAttribute('aria-label', t);
      btn.title = t;
    }
    if (label) label.textContent = names[mode];
    window.dispatchEvent(new CustomEvent('themechange', { detail: { dark: isDark() } }));
  }

  btn && btn.addEventListener('click', () => {
    mode = order[(order.indexOf(mode) + 1) % order.length];
    try { mode === 'system' ? localStorage.removeItem('hg-theme') : localStorage.setItem('hg-theme', mode); } catch (e) {}
    apply();
  });
  sysDark.addEventListener('change', () => mode === 'system' && apply());
  apply();
  return { isDark };
})();

// ── PRELOADER + HERO INTRO ────────────────────────────────────
(function initPreloader() {
  const pre = $('#preloader');
  const count = $('#preCount');
  const bar = $('#preBar');

  // Split hero words into chars
  $$('[data-split]').forEach((el, wi) => {
    const text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'char';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = ch;
      s.style.transitionDelay = `${wi * 0.12 + i * 0.035}s`;
      el.appendChild(s);
    });
  });

  function intro() {
    document.body.classList.remove('is-loading');
    $('.hero-title') && $('.hero-title').classList.add('in');
    $$('[data-anim]').forEach((el, i) => setTimeout(() => el.classList.add('in'), 500 + i * 140));
  }

  if (!pre || reduceMotion) { pre && pre.remove(); intro(); return; }

  let n = 0;
  const start = performance.now();
  const DURATION = 1100;
  (function tick(now) {
    n = Math.min(100, Math.round(((now - start) / DURATION) * 100));
    count.textContent = n;
    bar.style.width = n + '%';
    if (n < 100) requestAnimationFrame(tick);
    else {
      pre.classList.add('done');
      setTimeout(intro, 250);
      setTimeout(() => pre.remove(), 1100);
    }
  })(start);
})();

// ── CURSOR ────────────────────────────────────────────────────
(function initCursor() {
  if (!finePointer || reduceMotion) return;
  const ring = $('#cursor');
  const dot = $('#cursorDot');
  const label = $('#cursorLabel');
  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    document.body.classList.add('has-cursor');
  }, { passive: true });
  document.addEventListener('mouseleave', () => document.body.classList.remove('has-cursor'));

  (function loop() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(loop);
  })();

  document.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-cursor], a, button, .tilt-card, input, textarea');
    ring.classList.remove('hover', 'label');
    if (!t) return;
    if (t.dataset.cursor) { label.textContent = t.dataset.cursor; ring.classList.add('label'); }
    else ring.classList.add('hover');
  });
})();

// ── NAV ───────────────────────────────────────────────────────
(function initNav() {
  const nav = $('#nav');
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  const progress = $('#scrollProgress');

  function close() { toggle.classList.remove('open'); links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle('scrolled', y > 40);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    const open = !links.classList.contains('open');
    toggle.classList.toggle('open', open);
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-link', links).forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => e.key === 'Escape' && close());

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      $$('.nav-link').forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]').forEach(s => io.observe(s));
})();

// ── HERO 3D SCENE (Three.js) ──────────────────────────────────
function initHero3D() {
  const canvas = $('#heroCanvas');
  if (!canvas || !window.THREE) return;
  const THREE = window.THREE;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { return; }
  document.documentElement.classList.add('webgl-on');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  // Liquid iridescent blob (simplex-noise displacement)
  const NOISE = `
    vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
    vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
    vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
      vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
      vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
      float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);
      vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;
      vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
      vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
      return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;

  const blobUniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0.38 },
    uHover: { value: 0 },
    uC1: { value: new THREE.Color('#d4ff3a') },
    uC2: { value: new THREE.Color('#ff3d8b') },
    uC3: { value: new THREE.Color('#7b5cff') },
    uC4: { value: new THREE.Color('#22e3ff') },
  };
  const blobMat = new THREE.ShaderMaterial({
    uniforms: blobUniforms,
    vertexShader: `
      uniform float uTime; uniform float uAmp; uniform float uHover;
      varying vec3 vN; varying vec3 vView; varying float vNoise;
      ${NOISE}
      void main(){
        float n = snoise(position * 0.9 + vec3(uTime * 0.22));
        n += 0.45 * snoise(position * 2.1 - vec3(uTime * 0.3));
        vNoise = n;
        vec3 p = position + normal * n * (uAmp + uHover * 0.18);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vN = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform vec3 uC4; uniform float uTime;
      varying vec3 vN; varying vec3 vView; varying float vNoise;
      void main(){
        float f = pow(1.0 - max(dot(vN, vView), 0.0), 2.2);
        float t = vNoise * 0.5 + 0.5;
        vec3 base = mix(uC3, uC2, smoothstep(0.15, 0.75, t));
        base = mix(base, uC1, smoothstep(0.62, 1.0, t + vN.y * 0.25));
        vec3 col = mix(base, uC4, f * 0.85);
        float spec = pow(max(dot(reflect(-vView, vN), normalize(vec3(0.4, 0.8, 0.6))), 0.0), 28.0);
        col += spec * 0.65 + f * 0.25;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });

  const group = new THREE.Group();
  scene.add(group);
  const isMobile = () => window.innerWidth < 760;
  const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, isMobile() ? 48 : 96), blobMat);
  group.add(blob);

  const shellMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.08 });
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(2.55, 1), shellMat);
  group.add(shell);

  // Orbit rings with moons
  const ringMats = [];
  const rings = [
    { r: 2.9, tilt: [1.2, 0.3], color: '#d4ff3a', speed: 0.5 },
    { r: 3.4, tilt: [-0.9, 0.6], color: '#ff3d8b', speed: -0.35 },
    { r: 3.9, tilt: [0.4, -1.1], color: '#7b5cff', speed: 0.25 },
  ].map(o => {
    const g = new THREE.Group();
    g.rotation.set(o.tilt[0], o.tilt[1], 0);
    const lm = new THREE.MeshBasicMaterial({ color: o.color, transparent: true, opacity: 0.35 });
    ringMats.push(lm);
    g.add(new THREE.Mesh(new THREE.TorusGeometry(o.r, 0.008, 8, 160), lm));
    const moon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20), new THREE.MeshBasicMaterial({ color: o.color }));
    moon.position.x = o.r;
    g.add(moon);
    group.add(g);
    return { g, speed: o.speed };
  });

  // Star field
  const COUNT = isMobile() ? 500 : 1200;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const r = 6 + Math.random() * 16;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[i * 3 + 2] = r * Math.cos(ph) - 6;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const starMat = new THREE.PointsMaterial({ size: 0.035, transparent: true, opacity: 0.8, sizeAttenuation: true });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  function themeColors(dark) {
    starMat.color.set(dark ? '#ffffff' : '#2a2540');
    starMat.opacity = dark ? 0.75 : 0.45;
    shellMat.color.set(dark ? '#ffffff' : '#121018');
    shellMat.opacity = dark ? 0.08 : 0.12;
    ringMats.forEach(m => (m.opacity = dark ? 0.35 : 0.6));
    blobUniforms.uC1.value.set(dark ? '#d4ff3a' : '#c2f000');
  }
  themeColors(Theme.isDark());
  window.addEventListener('themechange', e => themeColors(e.detail.dark));

  function layout() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (isMobile()) { group.position.set(0, 1.9, 0); group.scale.setScalar(0.62); }
    else if (w < 1100) { group.position.set(2.2, 0.3, 0); group.scale.setScalar(0.8); }
    else { group.position.set(2.9, 0.1, 0); group.scale.setScalar(1); }
  }
  layout();
  window.addEventListener('resize', layout, { passive: true });

  // Interaction
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', e => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  const raycaster = new THREE.Raycaster();
  let hoverTarget = 0;

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  const clock = new THREE.Clock();
  const baseY = () => group.position.y;
  let scrollK = 0;

  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const speed = reduceMotion ? 0.15 : 1;
    blobUniforms.uTime.value += dt * speed;

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    if (finePointer) {
      raycaster.setFromCamera({ x: mouse.tx, y: -mouse.ty }, camera);
      hoverTarget = raycaster.intersectObject(blob).length ? 1 : 0;
    }
    blobUniforms.uHover.value += (hoverTarget - blobUniforms.uHover.value) * 0.06;

    scrollK = Math.min(window.scrollY / window.innerHeight, 1.2);

    blob.rotation.y += dt * 0.15 * speed;
    blob.rotation.x = mouse.y * 0.4;
    shell.rotation.y -= dt * 0.08 * speed;
    shell.rotation.z += dt * 0.05 * speed;
    rings.forEach(r => (r.g.rotation.z += dt * r.speed * speed));
    stars.rotation.y += dt * 0.012 * speed;

    group.rotation.y = mouse.x * 0.35 + scrollK * 1.2;
    group.rotation.x = mouse.y * 0.15;
    camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (-mouse.y * 0.4 - camera.position.y) * 0.04;
    camera.position.z = 9 + scrollK * 3.5;
    camera.lookAt(0, baseY() * 0.3, 0);

    renderer.render(scene, camera);
  }
  frame();
}

// ── 3D TILT CARDS + GLARE ─────────────────────────────────────
(function initTilt() {
  if (!finePointer || reduceMotion) return;
  $$('.tilt-card').forEach(card => {
    const max = parseFloat(card.dataset.tilt || 10);
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.classList.add('tilting');
      card.style.setProperty('transform', `perspective(1000px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateZ(10px)`, 'important');
      card.style.setProperty('--mx', px * 100 + '%');
      card.style.setProperty('--my', py * 100 + '%');
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilting');
      card.style.removeProperty('transform');
    });
  });
})();

// ── MAGNETIC BUTTONS ──────────────────────────────────────────
(function initMagnetic() {
  if (!finePointer || reduceMotion) return;
  $$('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      el.style.translate = `${x}px ${y}px`;
    });
    el.addEventListener('pointerleave', () => { el.style.translate = ''; });
  });
})();

// ── SCROLL REVEAL + COUNTERS + TIMELINE ───────────────────────
(function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const d = parseInt(e.target.dataset.delay || 0, 10);
      setTimeout(() => e.target.classList.add('revealed'), d);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal-up, .reveal-left, .reveal-right').forEach(el => io.observe(el));

  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / 1400, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('.stat-num[data-target]').forEach(c => cio.observe(c));

  const tl = $('#timeline');
  const fill = $('#timelineFill');
  if (tl && fill) {
    const update = () => {
      const r = tl.getBoundingClientRect();
      const p = (window.innerHeight * 0.6 - r.top) / r.height;
      fill.style.transform = `scaleY(${Math.max(0, Math.min(1, p))})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
})();

// ── DEMO THEATRE ──────────────────────────────────────────────
(function initDemos() {
  const projects = window.DEMO_PROJECTS || [];
  const tabs = $('#demoTabs');
  const list = $('#playlist');
  const panel = $('#projectPanel');
  const video = $('#demoVideo');
  const playBtn = $('#stagePlay');
  const npTitle = $('#npTitle');
  const npDesc = $('#npDesc');
  const url = $('#stageUrl');
  if (!tabs || !video || !projects.length) return;

  const fmt = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const winIcon = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.4 9.8 2v9.5H0zM11 1.8 24 0v11.4H11zM0 12.6h9.8V22L0 20.6zM11 12.6h13V24l-13-1.8z"/></svg>';

  let current = projects[0];
  let index = 0;

  tabs.innerHTML = projects.map(p => `
    <button class="demo-tab" role="tab" data-project="${p.id}" aria-selected="false">
      <span class="tab-ico">${p.icon}</span>
      <span><strong>${esc(p.name)}</strong><small>${p.videos.length} video${p.videos.length > 1 ? 's' : ''} · ${esc(p.tagline)}</small></span>
    </button>`).join('');

  function renderProject(p) {
    current = p;
    $$('.demo-tab', tabs).forEach(t => t.setAttribute('aria-selected', String(t.dataset.project === p.id)));
    const dl = p.download ? `
      <a class="download-box" href="${p.download.href}" download data-cursor="Get .exe">
        <span class="win">${winIcon}</span>
        <span><strong>${esc(p.download.label)}</strong><small>${esc(p.download.meta)}</small></span>
        <span class="dl-arrow">↓</span>
      </a>
      <p class="dl-note">${esc(p.download.note)}</p>` : '';
    panel.innerHTML = `
      <h4>${esc(p.name)}</h4>
      <p>${esc(p.description)}</p>
      <div class="chips">${p.stack.map(s => `<span>${esc(s)}</span>`).join('')}</div>
      ${dl}`;
    list.innerHTML = p.videos.map((v, i) => `
      <li>
        <button class="pl-item" data-i="${i}">
          <span class="pl-thumb">
            <img src="${v.poster}" alt="" loading="lazy" />
            <span class="pl-dur">${fmt(v.duration)}</span>
            <span class="pl-eq"><i></i><i></i><i></i></span>
          </span>
          <span class="pl-meta">
            <span class="pl-num">EP ${String(i + 1).padStart(2, '0')}</span>
            <span class="pl-title">${esc(v.title)}</span>
          </span>
        </button>
      </li>`).join('');
    load(0, false);
  }

  function load(i, autoplay) {
    index = i;
    const v = current.videos[i];
    video.poster = v.poster;
    video.src = v.src;
    npTitle.textContent = `${String(i + 1).padStart(2, '0')} · ${v.title}`;
    npDesc.textContent = v.desc;
    url.textContent = `demo://${current.id}/${v.src.split('/').pop()}`;
    $$('.pl-item', list).forEach((b, j) => b.classList.toggle('active', j === i));
    playBtn.classList.remove('hidden');
    if (autoplay) video.play().catch(() => {});
  }

  tabs.addEventListener('click', e => {
    const t = e.target.closest('.demo-tab');
    if (!t || t.dataset.project === current.id) return;
    renderProject(projects.find(p => p.id === t.dataset.project));
  });
  list.addEventListener('click', e => {
    const b = e.target.closest('.pl-item');
    if (!b) return;
    load(parseInt(b.dataset.i, 10), true);
    if (window.innerWidth < 1100) $('#stage').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  });

  playBtn.addEventListener('click', () => video.play().catch(() => {}));
  playBtn.dataset.cursor = 'Play';
  video.addEventListener('play', () => {
    playBtn.classList.add('hidden');
    $$('.pl-item', list).forEach((b, j) => b.classList.toggle('playing', j === index));
  });
  video.addEventListener('pause', () => $$('.pl-item', list).forEach(b => b.classList.remove('playing')));
  video.addEventListener('ended', () => { if (index < current.videos.length - 1) load(index + 1, true); });

  // "Watch demo" buttons on project cards
  $$('[data-open-demo]').forEach(b => b.addEventListener('click', () => {
    const p = projects.find(x => x.id === b.dataset.openDemo);
    if (p && p !== current) renderProject(p);
    $('#demos').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }));

  // Deep link: /#demos/qlik-bots
  const m = location.hash.match(/^#demos\/([\w-]+)/);
  renderProject(projects.find(p => m && p.id === m[1]) || projects[0]);
})();

// ── CONTACT FORM ──────────────────────────────────────────────
(function initContactForm() {
  const form = $('#contactForm');
  const feedback = $('#formFeedback');
  const btn = $('#submitBtn');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'form-feedback';
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      feedback.textContent = 'Please fill in all fields.';
      feedback.className = 'form-feedback error';
      return;
    }

    btn.querySelector('.btn-text').style.display = 'none';
    btn.querySelector('.btn-loader').style.display = 'inline';
    btn.disabled = true;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (data.success) {
        feedback.textContent = '✅ ' + data.message;
        feedback.className = 'form-feedback success';
        form.reset();
      } else {
        feedback.textContent = '❌ ' + (data.error || 'Something went wrong.');
        feedback.className = 'form-feedback error';
      }
    } catch {
      feedback.textContent = '❌ Network error. Please try again.';
      feedback.className = 'form-feedback error';
    } finally {
      btn.querySelector('.btn-text').style.display = 'inline';
      btn.querySelector('.btn-loader').style.display = 'none';
      btn.disabled = false;
    }
  });
})();

// ── CHAT BOT ──────────────────────────────────────────────────
(function initChat() {
  const bubble = $('#chatBubble');
  const popup = $('#chatPopup');
  const close = $('#chatClose');
  if (!bubble || !popup) return;
  const iconOpen = $('.chat-open', bubble);
  const iconClose = $('.chat-close', bubble);
  const set = open => {
    popup.classList.toggle('open', open);
    iconOpen.style.display = open ? 'none' : 'inline';
    iconClose.style.display = open ? 'inline' : 'none';
    bubble.setAttribute('aria-label', open ? 'Close chat' : 'Open chat');
  };
  bubble.addEventListener('click', () => set(!popup.classList.contains('open')));
  close.addEventListener('click', () => set(false));
})();

// ── MISC ──────────────────────────────────────────────────────
$('#year') && ($('#year').textContent = new Date().getFullYear());
initHero3D();
