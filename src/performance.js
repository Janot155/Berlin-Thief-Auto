const QUALITY = [
  { name: 'Low', pixel: 0.6, shadow: 0, map: 256 },
  { name: 'Medium', pixel: 0.8, shadow: 0, map: 512 },
  { name: 'High', pixel: 1, shadow: 1, map: 768 },
  { name: 'Ultra', pixel: 1.25, shadow: 1, map: 1024 }
];

export class PerformanceMonitor {
  constructor(renderer, light, panel) {
    this.renderer = renderer;
    this.light = light;
    this.panel = panel;
    try { const saved = Number(localStorage.getItem('berlinlife.quality') ?? 0); this.quality = Number.isFinite(saved) ? Math.min(1, Math.max(0, saved)) : 0; }
    catch { this.quality = 2; }
    this.frames = 0;
    this.total = 0;
    this.fps = 0;
    this.frameMs = 0;
    this.lastPanel = 0;
    this.set(this.quality);
  }

  set(level) {
    this.quality = Math.max(0, Math.min(3, level | 0));
    const q = QUALITY[this.quality];
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, q.pixel));
    this.renderer.shadowMap.enabled = !!q.shadow;
    this.light.castShadow = !!q.shadow;
    this.light.shadow.mapSize.set(q.map, q.map);
    this.light.shadow.camera.updateProjectionMatrix();
    try { localStorage.setItem('berlinlife.quality', String(this.quality)); } catch {}
    return q.name;
  }

  cycle() { return this.set((this.quality + 1) % QUALITY.length); }
  name() { return QUALITY[this.quality].name; }

  sample(dt, now, counts = {}) {
    this.frames++;
    this.total += dt;
    this.frameMs = dt * 1000;
    if (now - this.lastPanel < 250) return;
    this.fps = this.total ? this.frames / this.total : 0;
    this.frames = 0;
    this.total = 0;
    this.lastPanel = now;
    if (!this.panel || this.panel.hidden) return;
    if (typeof counts === 'function') counts = counts();
    const info = this.renderer.info;
    const memory = performance.memory ? `${Math.round(performance.memory.usedJSHeapSize / 1048576)} MB` : 'n/a';
    this.panel.textContent = `FPS ${this.fps.toFixed(0)} · ${this.frameMs.toFixed(1)} ms\nDraw calls ${info.render.calls} · triangles ${info.render.triangles.toLocaleString()}\nNPCs ${counts.npcs || 0} · cars ${counts.cars || 0} · quality ${this.name()}\nJS memory ${memory}`;
  }
}

