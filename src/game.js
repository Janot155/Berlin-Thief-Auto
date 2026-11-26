import { MISSIONS } from './missions.js';
import { CAMPAIGN_CUTSCENES, CAST, NPC_LINES } from './campaign.js';
import { CutsceneDirector } from './cinematics.js';
import { PerformanceMonitor } from './performance.js';
import { dressCity } from './city-details.js';
import { CASH_JOBS } from './robberies.js';
import { buildLandmarks } from './landmarks.js';

const $=i=>document.getElementById(i),T=THREE,R=Math.random,P=60,GRID=13,W=GRID*P,cv=$('g'),PI=Math.PI;
const rn=new T.WebGLRenderer({canvas:cv,antialias:false,powerPreference:'high-performance',stencil:false,precision:'mediump'}),scene=new T.Scene(),cam=new T.PerspectiveCamera(65,1,.1,700);
scene.fog=new T.FogExp2(0x8fbbe6,.0015);rn.outputEncoding=T.sRGBEncoding;rn.toneMapping=T.ACESFilmicToneMapping;rn.toneMappingExposure=1.3;rn.shadowMap.enabled=true;rn.shadowMap.type=T.PCFSoftShadowMap;
const hemi=new T.HemisphereLight(0xbfd8ff,0x555555,.6),sun=new T.DirectionalLight(0xffffff,1);
sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0004;{const c=sun.shadow.camera;c.left=c.bottom=-80;c.right=c.top=80;c.far=400}
scene.add(hemi,sun,sun.target);
const perf=new PerformanceMonitor(rn,sun,$('debug'));
let nightV=0;const DEEP=new T.Color(0x2a62b8),skyU={top:{value:new T.Color()},hor:{value:new T.Color()},sd:{value:new T.Vector3(0,1,0)},nt:{value:0}};
const sky=new T.Mesh(new T.SphereGeometry(500,32,16),new T.ShaderMaterial({uniforms:skyU,side:T.BackSide,depthWrite:false,vertexShader:'varying vec3 p;void main(){p=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform vec3 top,hor,sd;uniform float nt;varying vec3 p;float h(vec2 q){return fract(sin(dot(q,vec2(12.9,78.2)))*43758.5);}void main(){float y=max(p.y,0.);vec3 c=mix(hor,top,pow(y,.5));float s=max(dot(p,normalize(sd)),0.);c+=vec3(1.,.8,.5)*(pow(s,500.)*3.+pow(s,8.)*.3)*(1.-nt);c+=vec3(step(.996,h(floor(p.xz*260.)))*nt*y);gl_FragColor=vec4(c,1.);}'}));sky.renderOrder=-1;sky.frustumCulled=false;scene.add(sky);
const matCache=new Map(),std=(c,r=.85,m=0)=>{const color=typeof c==='number'?c:c.getHex(),key=color+':'+r+':'+m;if(!matCache.has(key))matCache.set(key,new T.MeshStandardMaterial({color,roughness:r,metalness:m}));return matCache.get(key)};
const add=(g,m,x,y,z,cast=false)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=cast;o.receiveShadow=false;scene.add(o);return o};
const boxGeoCache=new Map(),boxGeometry=(w,h,d)=>{const key=w+':'+h+':'+d;let g=boxGeoCache.get(key);if(!g){g=new T.BoxGeometry(w,h,d);boxGeoCache.set(key,g)}return g},box=(w,h,d,m,x,y,z,c)=>add(boxGeometry(w,h,d),m,x,y,z,c);
const cyl=(a,b,h,s)=>new T.CylinderGeometry(a,b,h,s);
const bmesh=[],col=[],colBuckets=new Map(),addC=(x,z,hx,hz)=>{const b={x,z,hx,hz};col.push(b);const key=`${Math.floor(x/P)}:${Math.floor(z/P)}`;let list=colBuckets.get(key);if(!list)colBuckets.set(key,list=[]);list.push(b)};
let hit=false;
function push(p,r){hit=false;const ax=Math.floor(p.x/P),az=Math.floor(p.z/P);for(let ix=ax-1;ix<=ax+1;ix++)for(let iz=az-1;iz<=az+1;iz++){const list=colBuckets.get(`${ix}:${iz}`);if(!list)continue;for(const b of list){const cx=Math.max(b.x-b.hx,Math.min(p.x,b.x+b.hx)),cz=Math.max(b.z-b.hz,Math.min(p.z,b.z+b.hz));let dx=p.x-cx,dz=p.z-cz,d=dx*dx+dz*dz;if(d<r*r){hit=true;if(d<1e-6)p.x+=r;else{d=Math.sqrt(d);p.x+=dx/d*(r-d);p.z+=dz/d*(r-d)}}}}return hit}
/* ---------- WORLD ---------- */
const rt=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle='#2a2d33';g.fillRect(0,0,128,128);for(let i=0;i<2500;i++){const v=R()*70|0;g.fillStyle='rgba('+v+','+v+','+v+',.35)';g.fillRect(R()*128,R()*128,2,2)}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(90,5);t.anisotropy=8;return t})();
const roadMat=new T.MeshStandardMaterial({map:rt,roughness:.9});
box(2*W+40,.2,2*W+40,std(0x6f7478,.95),0,-.1,0,false);
for(let k=-GRID;k<=GRID;k++){box(2*W+16,.2,16,roadMat,0,0,k*P,false);box(16,.2,2*W+16,roadMat,k*P,0,0,false)}
{const ms=[],d=new T.Object3D();for(let k=-GRID;k<=GRID;k++)for(let u=-W+4;u<=W-4;u+=10){const m=((u%P)+P)%P;if(m<10||m>P-10)continue;for(const v of[0,1]){d.position.set(v?k*P:u,.12,v?u:k*P);d.rotation.y=v?PI/2:0;d.updateMatrix();ms.push(d.matrix.clone())}}
const im=new T.InstancedMesh(new T.BoxGeometry(4,.05,.3),new T.MeshBasicMaterial({color:0xe8e8e8}),ms.length);ms.forEach((m,i)=>im.setMatrixAt(i,m));scene.add(im)}
{const zMat=new T.MeshBasicMaterial({color:0xe2dfd3}),stripes=[],dummy=new T.Object3D();for(let ix=-GRID;ix<=GRID;ix++)for(let iz=-GRID;iz<=GRID;iz++){if(ix%3!==0||iz%3!==0)continue;for(const side of[-1,1])for(let n=-3;n<=3;n++){dummy.position.set(ix*P+n*2,.14,iz*P+side*10);dummy.rotation.y=0;dummy.updateMatrix();stripes.push(dummy.matrix.clone());dummy.position.set(ix*P+side*10,.14,iz*P+n*2);dummy.rotation.y=Math.PI/2;dummy.updateMatrix();stripes.push(dummy.matrix.clone())}}const cross=new T.InstancedMesh(new T.BoxGeometry(1.1,.035,.28),zMat,stripes.length);stripes.forEach((m,i)=>cross.setMatrixAt(i,m));cross.receiveShadow=true;scene.add(cross)}
function wt(lit){const c=document.createElement('canvas');c.width=256;c.height=512;const g=c.getContext('2d');g.fillStyle=lit?'#000':'#b0a898';g.fillRect(0,0,256,512);
if(!lit)for(let i=0;i<900;i++){g.fillStyle='rgba(0,0,0,'+R()*.07+')';g.fillRect(R()*256,R()*512,4,4)}
for(let y=0;y<8;y++)for(let x=0;x<4;x++){const X=x*64,Y=y*64;
if(lit){if(R()<.45){g.fillStyle=R()<.8?'#ffd98a':'#9fd4ff';g.fillRect(X+12,Y+14,40,38)}}
else{g.fillStyle='#8f887c';g.fillRect(X,Y+60,64,4);g.fillStyle='#d8d2c6';g.fillRect(X+8,Y+10,48,46);const gr=g.createLinearGradient(0,Y+14,0,Y+52);gr.addColorStop(0,'#86a3c0');gr.addColorStop(1,'#2a3a4e');g.fillStyle=gr;g.fillRect(X+12,Y+14,40,38);g.fillStyle='#d8d2c6';g.fillRect(X+30,Y+14,4,38);g.fillRect(X+12,Y+31,40,3)}}
const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t}
const CORN=std(0x8f8a80,.9),shopMat=new T.MeshStandardMaterial({color:0x1b2733,roughness:.15,metalness:.6,emissive:0xffcc88,emissiveIntensity:0});
{const ms=[],d=new T.Object3D();for(let a=-GRID;a<=GRID;a++)for(let b=-GRID;b<=GRID;b++)for(const s of[-11,11])for(let q=-7;q<=7;q+=2){d.position.set(a*P+s,.12,b*P+q);d.scale.set(3.4,1,1);d.updateMatrix();ms.push(d.matrix.clone());d.position.set(a*P+q,.12,b*P+s);d.scale.set(1,1,3.4);d.updateMatrix();ms.push(d.matrix.clone())}
const im=new T.InstancedMesh(new T.BoxGeometry(1,.05,1),new T.MeshBasicMaterial({color:0xd8d8d8}),ms.length);ms.forEach((m,i)=>im.setMatrixAt(i,m));scene.add(im)}
const T1=wt(0),T2=wt(1),bm=[],TINT=[0xd9cdb8,0xc4b5a0,0xb7bcc4,0xcfa88a,0xa8b5a2,0xd0d0d0],NEON=[0xff2d95,0x19e6ff,0xfff03a,0x7dff6a];
const BAL=[],BUILDINGS=[];
function bld(x,z,w,h){const side=R()<.5?-1:1;BUILDINGS.push({x,z,w,h,tint:TINT[(R()*6)|0],neon:NEON[(R()*4)|0],side,roofX:x+R()*5-2.5,roofZ:z+R()*5-2.5});addC(x,z,w/2,w/2);if(w>14&&h>16){const step=h>38?10:12;for(let y=6;y<h-3;y+=step){const o=new T.Object3D();o.position.set(x-w*.23,y,z+w/2+.72);o.updateMatrix();BAL.push(o.matrix.clone())}}}
function tower(x,z){add(cyl(1.6,3.2,100,14),std(0xc9ced4,.5,.3),x,50,z);add(new T.SphereGeometry(8.5,20,14),std(0xdfe3e8,.25,.8),x,92,z);add(cyl(.15,.7,34,8),std(0xd22222),x,125,z);addC(x,z,3.2,3.2)}
function gate(x,z){const s=std(0xc9b88a);for(let c=0;c<6;c++)for(let r=0;r<2;r++){const px=x-15+c*6,pz=z+(r?3.5:-3.5);add(cyl(1.1,1.1,14,12),s,px,7,pz);addC(px,pz,1.2,1.2)}box(36,3.5,10,s,x,15.75,z);box(32,3,7,s,x,19,z);box(8,2.2,3,std(0x8a9055),x,21.6,z);box(5,2,1.6,std(0xb8a040,.4,.7),x,23.7,z)}
function park(x,z){const n=26,cr=new T.InstancedMesh(new T.SphereGeometry(2.8,9,6),std(0x36754a),n),tr=new T.InstancedMesh(cyl(.35,.45,3,6),std(0x5a4030),n),d=new T.Object3D();
for(let i=0;i<n;i++){let px,pz;do{px=R()*38-19;pz=R()*38-19}while(Math.abs(px)<6&&Math.abs(pz)<6);d.position.set(x+px,6.5,z+pz);d.updateMatrix();cr.setMatrixAt(i,d.matrix);d.position.y=1.5;d.updateMatrix();tr.setMatrixAt(i,d.matrix);addC(x+px,z+pz,.5,.5)}cr.castShadow=true;scene.add(cr,tr)}
if(BAL.length){const metal=std(0x39434a,.45,.72),slabs=new T.InstancedMesh(new T.BoxGeometry(5,.22,1.5),std(0x857b6c,.8),BAL.length),rails=new T.InstancedMesh(new T.BoxGeometry(4.8,.12,.1),metal,BAL.length),fronts=new T.InstancedMesh(new T.BoxGeometry(.1,.72,.1),metal,BAL.length*2),sides=new T.InstancedMesh(new T.BoxGeometry(.1,.72,1.35),metal,BAL.length*2),d=new T.Object3D();BAL.forEach((m,i)=>{slabs.setMatrixAt(i,m);d.matrix.copy(m);d.decompose(d.position,d.quaternion,d.scale);d.position.z+=.72;d.position.y+=.42;d.updateMatrix();rails.setMatrixAt(i,d.matrix);for(const sign of[-1,1]){const e=new T.Object3D();e.matrix.copy(m);e.decompose(e.position,e.quaternion,e.scale);e.position.y+=.5;e.position.x+=sign*2.35;e.position.z+=.02;e.updateMatrix();fronts.setMatrixAt(i*2+(sign>0?1:0),e.matrix);e.position.x-=sign*4.7;e.updateMatrix();fronts.setMatrixAt(i*2+(sign>0?0:1),e.matrix);const q=new T.Object3D();q.matrix.copy(m);q.decompose(q.position,q.quantY-r.top)*k-320)/sc};toast('Waypoint set')};
/* ---------- INPUT & LOOP ---------- */
const K={};addEventListener('keydown',e=>{if(e.code==='F3'){ $('debug').hidden=!$('debug').hidden;e.preventDefault();return}if(cutsceneDirector.active&&(e.code==='Space'||e.code==='Escape')){cutsceneDirector.skip();e.preventDefault();return}if(state==='dialogue'){if(e.code==='Escape'){if(talker)closeTalk();else{$('talk').hidden=true;state='play'}}return}let code=e.code;if(controlPreset&&code.startsWith('Arrow'))code=({ArrowUp:'KeyW',ArrowDown:'KeyS',ArrowLeft:'KeyA',ArrowRight:'KeyD'})[code]||code;if(code==='Space'&&!K.Space)jumpQueued=true;K[code]=1;if(e.code=='Space'||e.code.startsWith('Arrow'))e.preventDefault();if(e.repeat||state!=='play')return;
if(e.code=='KeyF')toggleCar();else if(e.code=='KeyM'){mapOpen=!mapOpen;$('mw').style.display=mapOpen?'flex':'none';if(mapOpen)document.exitPointerLock();else lock()}
else if(e.code=='KeyC'){if(money>=50){money-=50;jc=(jc+1)%JC.length;dress(me,JC[jc]);toast('New jacket −€50')}else toast('Not enough money')}
else if(e.code=='KeyY'){wx=(wx+1)%4;toast('Weather: '+WXN[wx])}else if(e.code=='KeyR')reload();else if(e.code=='KeyE')interact();else if(e.code=='KeyB')buyStuff();else if(e.code.startsWith('Digit')){const n=+e.code[5];if(n<4&&own[n]&&!cur){wi=n;showGun()}}else if(e.code=='KeyN'){gt=(gt+3)%24;toast('Time skipped')}
else if(e.code=='KeyV')fp=!fp;else if(e.code=='KeyK'){save();toast('Game saved')}else if(e.code=='KeyP'){document.exitPointerLock();if(!hadLock||!locked)menu('pause')}});
addEventListener('keyup',e=>{let code=e.code;if(controlPreset&&code.startsWith('Arrow'))code=({ArrowUp:'KeyW',ArrowDown:'KeyS',ArrowLeft:'KeyA',ArrowRight:'KeyD'})[code]||code;K[code]=0});addEventListener('blur',()=>{for(const k in K)K[k]=0});
addEventListener('mousemove',e=>{if(state!=='play'||mapOpen)return;if(locked||(e.buttons&1)){cy-=e.movementX*SS[si];cp=Math.max(-.2,Math.min(1.2,cp+e.movementY*SS[si]))}});
cv.addEventListener('mousedown',e=>{if(state==='play'&&!locked&&!mapOpen)lock();if(e.button===0)mouseDown=true});addEventListener('mouseup',()=>mouseDown=false);
document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===cv;if(locked)hadLock=true;else if(state==='play'&&hadLock&&!mapOpen)menu('pause')});
setInterval(()=>{if(state==='play')save()},15000);
function animateCutsceneActors(dt){
  const player=new T.Vector3(pl.x,1,pl.z),person=cutsceneDirector.focusId?storyPeople.find(a=>a.id===cutsceneDirector.focusId):null;
  const focus=person&&Math.hypot(person.x-pl.x,person.z-pl.z)<28?new T.Vector3(person.x,1,person.z):player;
  const center=player.clone().add(focus).multiplyScalar(.5),wave=Math.sin(clock*4)*.09,k=1-Math.exp(-dt*8);
  me.visible=!cur;if(!cur){me.L.ra.rotation.x+=(-.28+wave-me.L.ra.rotation.x)*k;me.L.la.rotation.x+=(-.16-wave-me.L.la.rotation.x)*k}
  for(const actor of storyPeople){const d=Math.hypot(actor.x-center.x,actor.z-center.z);actor.g.visible=d<24;if(actor.g.visible){actor.g.L.la.rotation.x+=(-.18-wave-actor.g.L.la.rotation.x)*k;actor.g.L.ra.rotation.x+=(-.25+wave-actor.g.L.ra.rotation.x)*k;actor.g.L.t.rotation.z=Math.sin(clock*1.7+actor.mission)*.035}}
}
let last=performance.now(),lastHud=0;
function frame(now){requestAnimationFrame(frame);const rawDt=Math.max(0,(now-last)/1000),dt=Math.min(.05,rawDt);last=now;
if(state==='play'&&!mapOpen){if(cutsceneDirector.active){animateCutsceneActors(dt);const active=cutsceneDirector.update(dt);if(!active&&endingPending){endingPending=false;endingChoice()}}else update(dt)}else if(state==='menu'){gt=(gt+dt/60)%24;env(dt,0,0);const a=now/9000;cam.position.set(Math.sin(a)*150,70,Math.cos(a)*150);cam.lookAt(0,25,0)}
if(state==='play'&&now-lastHud>125){hud();lastHud=now}
perf.sample(rawDt,now,()=>({npcs:peds.filter(p=>p.g.visible||p.lod.visible).length+storyPeople.filter(p=>p.g.visible).length,cars:cars.filter(c=>c.g.visible).length}));sky.position.copy(cam.position);rn.render(scene,cam)}
applyGfx();dress(me,JC[0]);menu('main');requestAnimationFrame(frame);
