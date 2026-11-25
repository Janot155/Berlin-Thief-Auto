// Small, data-driven camera timeline used for every story mission.
export class CutsceneDirector {
  constructor(camera, overlay, caption, getPlayer) {
    this.camera = camera;
    this.overlay = overlay;
    this.caption = caption;
    this.getPlayer = getPlayer;
    this.active = false;
    this.beats = [];
    this.index = 0;
    this.elapsed = 0;
  }

  play(beats) {
    if (!Array.isArray(beats) || !beats.length) return;
    this.beats = beats;
    this.index = 0;
    this.elapsed = 0;
    this.active = true;
    document.body.classList.add('cinematic');
    this.setBeat();
  }

  setBeat() {
    const beat = this.beats[this.index];
    const p = this.getPlayer();
    const [x, y, z] = beat.camera || [18, 10, 22];
    const [lx, ly, lz] = beat.look || [0, 1, 0];
    this.from = this.camera.position.clone();
    this.to = p.position.clone().add(new THREE.Vector3(x, y, z));
    this.target = p.position.clone().add(new THREE.Vector3(lx, ly, lz));
    this.duration = beat.duration || 2.4;
    this.elapsed = 0;
    this.caption.textContent = beat.speaker ? `${beat.speaker}: ${beat.line}` : beat.line;
    this.overlay.classList.add('on');
  }

  update(dt) {
    if (!this.active) return false;
    this.elapsed += dt;
    const q = Math.max(0, Math.min(1, this.elapsed / this.duration));
    const smooth = q * q * (3 - 2 * q);
    this.camera.position.lerpVectors(this.from, this.to, smooth);
    this.camera.lookAt(this.target);
    if (q >= 1) {
      this.index++;
      if (this.index >= this.beats.length) {
        this.active = false;
        this.overlay.classList.remove('on');
        document.body.classList.remove('cinematic');
        return false;
      }
      this.setBeat();
    }
    return true;
  }

  skip() {
    if (!this.active) return;
    this.active = false;
    this.overlay.classList.remove('on');
    document.body.classList.remove('cinematic');
  }
}

