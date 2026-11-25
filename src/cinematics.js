// Small, data-driven camera timeline used for every story mission.
export class CutsceneDirector {
  constructor(camera, overlay, caption, getPlayer, performanceMode) {
    this.camera = camera;
    this.overlay = overlay;
    this.caption = caption;
    this.getPlayer = getPlayer;
    this.performanceMode = performanceMode;
    this.lookRig = new THREE.Object3D();
    this.fromRotation = new THREE.Quaternion();
    this.toRotation = new THREE.Quaternion();
    this.gameFar = camera.far;
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
    this.gameFar = this.camera.far;
    this.camera.far = Math.min(this.gameFar, 150);
    this.camera.updateProjectionMatrix();
    this.performanceMode?.beginCinematic();
    document.body.classList.add('cinematic');
    this.setBeat();
  }

  setBeat() {
    const beat = this.beats[this.index];
    const p = this.getPlayer();
    const [x, y, z] = beat.camera || [18, 10, 22];
    const [lx, ly, lz] = beat.look || [0, 1, 0];
    this.from = this.camera.position.clone();
    this.fromRotation.copy(this.camera.quaternion);
    this.to = p.position.clone().add(new THREE.Vector3(x, y, z));
    this.target = p.position.clone().add(new THREE.Vector3(lx, ly, lz));
    this.lookRig.position.copy(this.to);
    this.lookRig.lookAt(this.target);
    this.toRotation.copy(this.lookRig.quaternion);
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
    this.camera.quaternion.slerpQuaternions(this.fromRotation, this.toRotation, smooth);
    if (q >= 1) {
      this.index++;
      if (this.index >= this.beats.length) {
        this.active = false;
        this.overlay.classList.remove('on');
        document.body.classList.remove('cinematic');
        this.restoreView();
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
    this.restoreView();
  }

  restoreView() {
    this.camera.far = this.gameFar;
    this.camera.updateProjectionMatrix();
    this.performanceMode?.endCinematic();
  }
}

