// A small camera rig keeps story scenes readable: settle quickly, hold on the
// speakers while the dialogue plays, and use the mission contact when nearby.
export class CutsceneDirector {
  constructor(camera, overlay, caption, getPlayer, performanceMode, getFocus) {
    this.camera = camera;
    this.overlay = overlay;
    this.caption = caption;
    this.getPlayer = getPlayer;
    this.getFocus = getFocus;
    this.performanceMode = performanceMode;
    this.lookRig = new THREE.Object3D();
    this.fromRotation = new THREE.Quaternion();
    this.toRotation = new THREE.Quaternion();
    this.gameFar = camera.far;
    this.active = false;
    this.beats = [];
    this.index = 0;
    this.elapsed = 0;
    this.focusId = null;
  }

  play(beats, focusId = null) {
    if (!Array.isArray(beats) || !beats.length) return;
    this.beats = beats;
    this.focusId = focusId;
    this.index = 0;
    this.elapsed = 0;
    this.active = true;
    this.gameFar = this.camera.far;
    this.camera.far = Math.min(this.gameFar, 240);
    this.camera.updateProjectionMatrix();
    this.performanceMode?.beginCinematic();
    document.body.classList.add('cinematic');
    this.setBeat();
  }

  setBeat() {
    const beat = this.beats[this.index];
    const player = this.getPlayer();
    const focus = this.focusId ? this.getFocus?.(this.focusId) : null;
    const closeFocus = focus && player.distanceTo(focus) < 28 ? focus : player;
    const center = player.clone().add(closeFocus).multiplyScalar(.5);
    const [x, , z] = beat.camera || [1, 0, 1];
    const gapX=closeFocus.x-player.x,gapZ=closeFocus.z-player.z,gap=Math.hypot(gapX,gapZ);
    let dirX,dirZ;
    if(closeFocus!==player&&gap>1){
      // Put the camera beside the line between the two speakers, over the
      // open street, rather than on a diagonal that lands inside a building.
      const sign=x>=0?-1:1;dirX=-gapZ/gap*sign;dirZ=gapX/gap*sign;
    }else if(Math.abs(x)>=Math.abs(z)){dirX=Math.sign(x)||1;dirZ=0}
    else{dirX=0;dirZ=Math.sign(z)||1}
    const side = gap>1?Math.min(8.5,Math.max(6.5,gap*.8)):8.5;
    this.from = this.camera.position.clone();
    this.fromRotation.copy(this.camera.quaternion);
    this.to = center.clone().add(new THREE.Vector3(dirX * side, 3.3, dirZ * side));
    this.target = center.clone().add(new THREE.Vector3(0, 1.05, 0));
    this.lookRig.position.copy(this.to);
    this.lookRig.lookAt(this.target);
    this.toRotation.copy(this.lookRig.quaternion);
    this.duration = beat.duration || 2.4;
    this.moveDuration = Math.min(.55, Math.max(.28, this.duration * .2));
    this.elapsed = 0;
    this.caption.textContent = beat.speaker ? `${beat.speaker}: ${beat.line}` : beat.line;
    this.overlay.classList.add('on');
  }

  update(dt) {
    if (!this.active) return false;
    this.elapsed += dt;
    const q = Math.max(0, Math.min(1, this.elapsed / this.moveDuration));
    const smooth = q * q * (3 - 2 * q);
    this.camera.position.lerpVectors(this.from, this.to, smooth);
    this.camera.quaternion.slerpQuaternions(this.fromRotation, this.toRotation, smooth);
    if (this.elapsed >= this.duration) {
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
    this.focusId = null;
    this.camera.far = this.gameFar;
    this.camera.updateProjectionMatrix();
    this.performanceMode?.endCinematic();
  }
}
