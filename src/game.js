import { MISSIONS } from './missions.js';
import { CAMPAIGN_CUTSCENES, CAST, NPC_LINES } from './campaign.js';
import { CutsceneDirector } from './cinematics.js';
import { PerformanceMonitor } from './performance.js';

const $=i=>document.getElementById(i),T=THREE,R=Math.random,P=60,W=180,cv=$('g'),PI=Math.PI;
const rn=new T.WebGLRenderer({canvas:cv,antialias:false,powerPreference:'high-performance',stencil:false,precision:'mediump'}),scene=new T.Scene(),cam=new T.PerspectiveCamera(65,1,.1,700);
scene.fog=new T.FogExp2(0x8fbbe6,.0035);rn.toneMapping=T.ACESFilmicToneMapping;rn.toneMappingExposure=1.3;rn.shadowMap.enabled=true;rn.shadowMap.type=T.PCFSoftShadowMap;
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
const bmesh=[],col=[],addC=(x,z,hx,hz)=>col.push({x,z,hx,hz});
let hit=false;
function push(p,r){hit=false;for(const b of col){const cx=Math.max(b.x-b.hx,Math.min(p.x,b.x+b.hx)),cz=Math.max(b.z-b.hz,Math.min(p.z,b.z+b.hz));let dx=p.x-cx,dz=p.z-cz,d=dx*dx+dz*dz;if(d<r*r){hit=true;if(d<1e-6)p.x+=r;else{d=Math.sqrt(d);p.x+=dx/d*(r-d);p.z+=dz/d*(r-d)}}}return hit}
/* ---------- WORLD ---------- */
const rt=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle='#2a2d33';g.fillRect(0,0,128,128);for(let i=0;i<2500;i++){const v=R()*70|0;g.fillStyle='rgba('+v+','+v+','+v+',.35)';g.fillRect(R()*128,R()*128,2,2)}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(90,5);t.anisotropy=8;return t})();
const roadMat=new T.MeshStandardMaterial({map:rt,roughness:.9});
box(560,.2,560,std(0x6f7478,.95),0,-.1,0,false);
for(let k=-3;k<=3;k++){box(2*W+16,.2,16,roadMat,0,0,k*P,false);box(16,.2,2*W+16,roadMat,k*P,0,0,false)}
{const ms=[],d=new T.Object3D();for(let k=-3;k<=3;k++)for(let u=-176;u<=176;u+=10){const m=((u%P)+P)%P;if(m<10||m>P-10)continue;for(const v of[0,1]){d.position.set(v?k*P:u,.12,v?u:k*P);d.rotation.y=v?PI/2:0;d.updateMatrix();ms.push(d.matrix.clone())}}
const im=new T.InstancedMesh(new T.BoxGeometry(4,.05,.3),new T.MeshBasicMaterial({color:0xe8e8e8}),ms.length);ms.forEach((m,i)=>im.setMatrixAt(i,m));scene.add(im)}
{const zMat=new T.MeshBasicMaterial({color:0xe2dfd3}),stripes=[],dummy=new T.Object3D();for(let ix=-3;ix<=3;ix++)for(let iz=-3;iz<=3;iz++)for(const side of[-1,1])for(let n=-3;n<=3;n++){dummy.position.set(ix*P+n*2,.14,iz*P+side*10);dummy.rotation.y=0;dummy.updateMatrix();stripes.push(dummy.matrix.clone());dummy.position.set(ix*P+side*10,.14,iz*P+n*2);dummy.rotation.y=Math.PI/2;dummy.updateMatrix();stripes.push(dummy.matrix.clone())}const cross=new T.InstancedMesh(new T.BoxGeometry(1.1,.035,.28),zMat,stripes.length);stripes.forEach((m,i)=>cross.setMatrixAt(i,m));cross.receiveShadow=true;scene.add(cross)}
function wt(lit){const c=document.createElement('canvas');c.width=256;c.height=512;const g=c.getContext('2d');g.fillStyle=lit?'#000':'#b0a898';g.fillRect(0,0,256,512);
if(!lit)for(let i=0;i<900;i++){g.fillStyle='rgba(0,0,0,'+R()*.07+')';g.fillRect(R()*256,R()*512,4,4)}
for(let y=0;y<8;y++)for(let x=0;x<4;x++){const X=x*64,Y=y*64;
if(lit){if(R()<.45){g.fillStyle=R()<.8?'#ffd98a':'#9fd4ff';g.fillRect(X+12,Y+14,40,38)}}
else{g.fillStyle='#8f887c';g.fillRect(X,Y+60,64,4);g.fillStyle='#d8d2c6';g.fillRect(X+8,Y+10,48,46);const gr=g.createLinearGradient(0,Y+14,0,Y+52);gr.addColorStop(0,'#86a3c0');gr.addColorStop(1,'#2a3a4e');g.fillStyle=gr;g.fillRect(X+12,Y+14,40,38);g.fillStyle='#d8d2c6';g.fillRect(X+30,Y+14,4,38);g.fillRect(X+12,Y+31,40,3)}}
const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t}
const CORN=std(0x8f8a80,.9),shopMat=new T.MeshStandardMaterial({color:0x1b2733,roughness:.15,metalness:.6,emissive:0xffcc88,emissiveIntensity:0});
{const ms=[],d=new T.Object3D();for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)for(const s of[-11,11])for(let q=-7;q<=7;q+=2){d.position.set(a*P+s,.12,b*P+q);d.scale.set(3.4,1,1);d.updateMatrix();ms.push(d.matrix.clone());d.position.set(a*P+q,.12,b*P+s);d.scale.set(1,1,3.4);d.updateMatrix();ms.push(d.matrix.clone())}
const im=new T.InstancedMesh(new T.BoxGeometry(1,.05,1),new T.MeshBasicMaterial({color:0xd8d8d8}),ms.length);ms.forEach((m,i)=>im.setMatrixAt(i,m));scene.add(im)}
const T1=wt(0),T2=wt(1),bm=[],TINT=[0xd9cdb8,0xc4b5a0,0xb7bcc4,0xcfa88a,0xa8b5a2,0xd0d0d0],NEON=[0xff2d95,0x19e6ff,0xfff03a,0x7dff6a];
const BAL=[],BUILDINGS=[];
function bld(x,z,w,h){const side=R()<.5?-1:1;BUILDINGS.push({x,z,w,h,tint:TINT[(R()*6)|0],neon:NEON[(R()*4)|0],side,roofX:x+R()*5-2.5,roofZ:z+R()*5-2.5});addC(x,z,w/2,w/2);if(w>14&&h>16){const step=h>38?10:12;for(let y=6;y<h-3;y+=step){const o=new T.Object3D();o.position.set(x-w*.23,y,z+w/2+.72);o.updateMatrix();BAL.push(o.matrix.clone())}}}
function tower(x,z){add(cyl(1.6,3.2,100,14),std(0xc9ced4,.5,.3),x,50,z);add(new T.SphereGeometry(8.5,20,14),std(0xdfe3e8,.25,.8),x,92,z);add(cyl(.15,.7,34,8),std(0xd22222),x,125,z);addC(x,z,3.2,3.2)}
function gate(x,z){const s=std(0xc9b88a);for(let c=0;c<6;c++)for(let r=0;r<2;r++){const px=x-15+c*6,pz=z+(r?3.5:-3.5);add(cyl(1.1,1.1,14,12),s,px,7,pz);addC(px,pz,1.2,1.2)}box(36,3.5,10,s,x,15.75,z);box(32,3,7,s,x,19,z);box(8,2.2,3,std(0x8a9055),x,21.6,z);box(5,2,1.6,std(0xb8a040,.4,.7),x,23.7,z)}
function park(x,z){const n=45,cr=new T.InstancedMesh(new T.ConeGeometry(3,7,8),std(0x2f6b34),n),tr=new T.InstancedMesh(cyl(.35,.45,3,6),std(0x5a4030),n),d=new T.Object3D();
for(let i=0;i<n;i++){let px,pz;do{px=R()*38-19;pz=R()*38-19}while(Math.abs(px)<6&&Math.abs(pz)<6);d.position.set(x+px,6.5,z+pz);d.updateMatrix();cr.setMatrixAt(i,d.matrix);d.position.y=1.5;d.updateMatrix();tr.setMatrixAt(i,d.matrix);addC(x+px,z+pz,.5,.5)}cr.castShadow=true;scene.add(cr,tr)}
if(BAL.length){const metal=std(0x39434a,.45,.72),slabs=new T.InstancedMesh(new T.BoxGeometry(5,.22,1.5),std(0x857b6c,.8),BAL.length),rails=new T.InstancedMesh(new T.BoxGeometry(4.8,.12,.1),metal,BAL.length),fronts=new T.InstancedMesh(new T.BoxGeometry(.1,.72,.1),metal,BAL.length*2),sides=new T.InstancedMesh(new T.BoxGeometry(.1,.72,1.35),metal,BAL.length*2),d=new T.Object3D();BAL.forEach((m,i)=>{slabs.setMatrixAt(i,m);d.matrix.copy(m);d.decompose(d.position,d.quaternion,d.scale);d.position.z+=.72;d.position.y+=.42;d.updateMatrix();rails.setMatrixAt(i,d.matrix);for(const sign of[-1,1]){const e=new T.Object3D();e.matrix.copy(m);e.decompose(e.position,e.quaternion,e.scale);e.position.y+=.5;e.position.x+=sign*2.35;e.position.z+=.02;e.updateMatrix();fronts.setMatrixAt(i*2+(sign>0?1:0),e.matrix);e.position.x-=sign*4.7;e.updateMatrix();fronts.setMatrixAt(i*2+(sign>0?0:1),e.matrix);const q=new T.Object3D();q.matrix.copy(m);q.decompose(q.position,q.quaternion,q.scale);q.position.y+=.5;q.position.x+=sign*2.35;q.position.z-=.02;q.rotation.y=Math.PI/2;q.updateMatrix();sides.setMatrixAt(i*2+(sign>0?1:0),q.matrix)}});[slabs,rails,fronts,sides].forEach(o=>{o.castShadow=true;o.receiveShadow=true;scene.add(o)})}
for(let i=-3;i<3;i++)for(let j=-3;j<3;j++){const cx=(i+.5)*P,cz=(j+.5)*P,sp=(i==0&&j==0)?1:(i==-1&&j==-1)?2:(i==-1&&j==0)?3:0;
box(44,.3,44,std(sp==3?0x3f6b3a:0x8d9096,.95),cx,.15,cz,false);
if(sp==1)tower(cx,cz);else if(sp==2)gate(cx,cz);else if(sp==3)park(cx,cz);
else if(i!=1||j!=0)for(let a=0;a<2;a++)for(let b=0;b<2;b++)bld(cx+(a?9.5:-9.5),cz+(b?9.5:-9.5),17,(i==1&&j==-1)?60+R()*45:(j>=1?10+R()*16:14+R()*26))}
function putInstances(records,geometry,material,place,colorKey){if(!records.length)return null;const inst=new T.InstancedMesh(geometry,material,records.length),d=new T.Object3D();records.forEach((r,i)=>{place(d,r);d.updateMatrix();inst.setMatrixAt(i,d.matrix);if(colorKey)inst.setColorAt(i,new T.Color(r[colorKey]))});inst.instanceMatrix.needsUpdate=true;if(inst.instanceColor)inst.instanceColor.needsUpdate=true;inst.castShadow=false;inst.receiveShadow=false;scene.add(inst);return inst}
const unitBox=new T.BoxGeometry(1,1,1),facadeMat=new T.MeshStandardMaterial({map:T1,emissiveMap:T2,emissive:0xffffff,emissiveIntensity:0,roughness:.85});
const facade=putInstances(BUILDINGS,unitBox,facadeMat,(d,b)=>{d.position.set(b.x,b.h/2,b.z);d.scale.set(b.w,b.h,b.w)} ,'tint');if(facade)bmesh.push(facade);bm.push(facadeMat);
putInstances(BUILDINGS,unitBox,CORN,(d,b)=>{d.position.set(b.x,b.h+.35,b.z);d.scale.set(b.w+.8,.7,b.w+.8)});
putInstances(BUILDINGS,unitBox,shopMat,(d,b)=>{d.position.set(b.x,2,b.z);d.scale.set(b.w+.3,3.4,b.w+.3)});
putInstances(BUILDINGS,unitBox,CORN,(d,b)=>{d.position.set(b.roofX,b.h+1.5,b.roofZ);d.scale.set(3,1.6,3)});
putInstances(BUILDINGS,unitBox,new T.MeshBasicMaterial({color:0xffffff}),(d,b)=>{d.position.set(b.x,4.5,b.z+b.side*(b.w/2+.1));d.scale.set(6,1.2,.2)},'neon');
for(let i=0;i<12;i++){const z=-165+i*30;box(1,4.5,26,std(new T.Color().setHSL(R(),.7,.5),.7),-187,2.25,z);addC(-187,z,.6,13)}
const lampMat=new T.MeshBasicMaterial({color:0x555555}),sigX=new T.InstancedMesh(new T.BoxGeometry(.5,.5,.5),new T.MeshBasicMaterial(),49),sigZ=new T.InstancedMesh(new T.BoxGeometry(.5,.5,.5),new T.MeshBasicMaterial(),49);
{const pm=new T.InstancedMesh(cyl(.12,.15,8,6),std(0x333840),196),lm=new T.InstancedMesh(new T.SphereGeometry(.5,8,6),lampMat,196),d=new T.Object3D();let n=0,q=0;
for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){for(const sx of[-1,1])for(const sz of[-1,1]){d.position.set(a*P+sx*10,4,b*P+sz*10);d.updateMatrix();pm.setMatrixAt(n,d.matrix);d.position.y=8.2;d.updateMatrix();lm.setMatrixAt(n++,d.matrix)}
d.position.set(a*P+10,5.3,b*P-10);d.updateMatrix();sigX.setMatrixAt(q,d.matrix);d.position.y=6.2;d.updateMatrix();sigZ.setMatrixAt(q++,d.matrix)}
scene.add(pm,lm,sigX,sigZ)}
const rainG=new T.BufferGeometry(),RN=260,rx=new Float32Array(RN),ry=new Float32Array(RN),rz=new Float32Array(RN),rp=new Float32Array(RN*6);
for(let i=0;i<RN;i++){rx[i]=R()*80-40;ry[i]=R()*30;rz[i]=R()*80-40}
rainG.setAttribute('position',new T.BufferAttribute(rp,3));const rain=new T.LineSegments(rainG,new T.LineBasicMaterial({color:0xaab8d0,transparent:true,opacity:.5}));rain.frustumCulled=false;scene.add(rain);
const beam=add(cyl(2,2,70,16),new T.MeshBasicMaterial({color:0xffd900,transparent:true,opacity:.35}),0,35,0,false),wbeam=add(cyl(1.5,1.5,70,12),new T.MeshBasicMaterial({color:0x19e6ff,transparent:true,opacity:.35}),0,-99,0,false);
/* ---------- PEOPLE & CARS ---------- */
const JC=[0x2d4a7a,0xb03030,0x2f6a3a,0x161616,0xd9a520];
const HUMAN_SPHERES={10:new T.SphereGeometry(1,10,8),12:new T.SphereGeometry(1,12,8),8:new T.SphereGeometry(1,8,8)},HUMAN_CYLINDERS=new Map();
function human(shirt,pants,cast=false){const g=new T.Group(),L={},skin=std(0xc98d6c,.82),hair=std(0x30251f,.94),shoe=std(0x22252a,.9),eye=std(0xe5d6c5,.8),pM=std(pants,.92).clone(),sM=std(shirt,.88).clone();
const sph=(parent,mat,x,y,z,sx,sy,sz,seg=10)=>{const o=new T.Mesh(HUMAN_SPHERES[seg]||HUMAN_SPHERES[10],mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=cast;parent.add(o);return o};
const cyl=(parent,mat,rt,rb,h,x,y,z)=>{const key=rt+':'+rb+':'+h;let geo=HUMAN_CYLINDERS.get(key);if(!geo){geo=new T.CylinderGeometry(rt,rb,h,10);HUMAN_CYLINDERS.set(key,geo)}const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=cast;parent.add(o);return o};
const limb=(x,mat,arm=false)=>{const root=new T.Group();root.position.set(x,arm?1.43:.93,0);g.add(root);const len=arm?.39:.44,top=arm?.095:.145,bot=arm?.075:.105;cyl(root,mat,bot,top,len,0,-len/2,0);sph(root,mat,0,-len,0,bot*1.05,bot*1.05,bot*1.05,8);const lower=new T.Group();lower.position.y=-len;root.add(lower);cyl(lower,mat,arm?.07:.085,bot*.88,.37,0,-.18,0);sph(lower,skin,0,-.38,0,arm?.07:.09,.075,.075,8);if(arm)sph(lower,skin,0,-.45,.02,.075,.11,.065,8);else{const foot=new T.Mesh(boxGeometry(.2,.12,.34),shoe);foot.position.set(0,-.44,.07);lower.add(foot)}root.userData.lower=lower;return root};
L.ll=limb(-.16,pM);L.rl=limb(.16,pM);L.la=limb(-.37,sM,true);L.ra=limb(.37,sM,true);
L.t=new T.Group();L.t.position.y=.98;g.add(L.t);cyl(L.t,sM,.25,.19,.66,0,.2,0);sph(L.t,sM,0,.48,0,.3,.17,.2);const belt=new T.Mesh(new T.CylinderGeometry(.195,.205,.09,12),std(0x343638,.7));belt.position.y=-.09;L.t.add(belt);
cyl(g,skin,.09,.105,.14,0,1.58,0);sph(g,skin,0,1.76,0,.145,.19,.13,12);sph(g,hair,0,1.87,-.015,.15,.105,.135,10);sph(g,skin,0,1.72,.126,.04,.035,.025,8);
for(const x of[-1,1]){sph(g,eye,x*.052,1.79,.116,.023,.018,.012,8);sph(g,std(0x25201e,.8),x*.052,1.79,.128,.009,.012,.008,6);sph(g,skin,x*.15,1.75,0,.035,.06,.035,8)}
g.L=L;scene.add(g);return g}
const dress=(g,c)=>[g.L.t,g.L.la,g.L.ra].forEach(p=>p.children[0].material.color.setHex(c));
// Distant pedestrians swap to a six-part shared-geometry model. Nearby actors keep
// the articulated model so the walk cycle remains visible where it matters.
const liteCache=new Map(),liteGeo={body:new T.BoxGeometry(.42,.68,.24),head:new T.SphereGeometry(.13,7,5),limb:new T.CylinderGeometry(.075,.095,.72,6)};
function liteMat(color){const key=new T.Color(color).getHex();if(!liteCache.has(key))liteCache.set(key,std(key,.9));return liteCache.get(key)}
function humanLite(shirt,pants){const g=new T.Group(),L={},skin=liteMat(0xc98d6c),top=liteMat(shirt),bottom=liteMat(pants);
const mesh=(geo,mat,parent,x,y,z,sx=1,sy=1,sz=1)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m};
mesh(liteGeo.body,top,g,0,1.2,0);mesh(liteGeo.head,skin,g,0,1.72,.01,1,1.15,1);
const limb=(x,y,mat)=>{const p=new T.Group();p.position.set(x,y,0);g.add(p);mesh(liteGeo.limb,mat,p,0,-.34,0);return p};
L.ll=limb(-.12,.92,bottom);L.rl=limb(.12,.92,bottom);L.la=limb(-.29,1.42,top);L.ra=limb(.29,1.42,top);g.L=L;scene.add(g);return g}
const SP={hatch:{n:'Hatchback',col:0x3b6ea8,w:1.8,h:.75,l:4,max:36,acc:13,brk:30,turn:2.2},sports:{n:'Sports car',col:0xe2231a,w:1.9,h:.6,l:4.4,max:58,acc:24,brk:40,turn:2.6},van:{n:'Van',col:0xe4e4e0,w:2,h:1.5,l:5.2,max:30,acc:9,brk:24,turn:1.7},bus:{n:'Bus',col:0xffd900,w:2.5,h:2.8,l:10,max:24,acc:6,brk:18,turn:1.2,bus:1},sedan:{n:'Executive sedan',col:0x596271,w:1.9,h:.9,l:4.8,max:42,acc:14,brk:33,turn:2},suv:{n:'City SUV',col:0x52634d,w:2.1,h:1.25,l:4.9,max:38,acc:12,brk:28,turn:1.8},taxi:{n:'Berlin taxi',col:0xe2c642,w:1.9,h:.9,l:4.7,max:40,acc:13,brk:32,turn:2,taxi:1},courier:{n:'Courier van',col:0x397b76,w:2,h:1.8,l:5.4,max:32,acc:10,brk:26,turn:1.7},coupe:{n:'Street coupe',col:0x773e68,w:1.85,h:.58,l:4.25,max:54,acc:21,brk:38,turn:2.5},pickup:{n:'Utility pickup',col:0xa76535,w:2.05,h:1.15,l:5.3,max:35,acc:11,brk:26,turn:1.7},police:{n:'Police car',col:0x2043a0,w:1.9,h:.8,l:4.5,max:46,acc:20,brk:34,turn:2.4,pol:1}};
const cars=[];let cur=null;const shellCache=new Map(),wheelGeometry=cyl(.38,.38,.26,12),tireMat=std(0x111315,.92),glassMat=new T.MeshStandardMaterial({color:0x293d49,metalness:.38,roughness:.28}),lightMat=new T.MeshBasicMaterial({color:0xffffff});
function mkCar(k,x,z,h,ai){const s=SP[k],g=new T.Group(),b=new T.Group(),bodyM=std(s.col,.35,.5).clone();g.add(b);
let shell=shellCache.get(k);if(!shell){const profile=new T.Shape();profile.moveTo(-s.l*.5,0);profile.lineTo(s.l*.5,0);profile.lineTo(s.l*.5,s.h*.58);profile.lineTo(s.l*.3,s.h*.67);profile.lineTo(s.l*.17,s.h+.22);profile.lineTo(-s.l*.2,s.h+.22);profile.lineTo(-s.l*.4,s.h*.62);profile.lineTo(-s.l*.5,s.h*.58);profile.closePath();profile.closePath();shell=new T.ExtrudeGeometry(profile,{depth:s.w,bevelEnabled:false,steps:1});shell.translate(0,0,-s.w/2);shell.rotateY(-Math.PI/2);shell.translate(0,.35,0);shellCache.set(k,shell)}
const shellMesh=new T.Mesh(shell,bodyM);b.add(shellMesh);
const cabinW=s.w*.84,cabinH=s.bus?1.8:Math.max(.34,s.h*.66),cabinL=s.bus?s.l*.44:s.l*(s.taxi?.5:.46),cabinY=s.bus?2.25:s.h+.35+s.h*.32,cabinZ=s.bus?s.l*.22:-s.l*.05;
const cabin=new T.Mesh(boxGeometry(cabinW,cabinH,cabinL),glassMat);cabin.position.set(0,cabinY,cabinZ);b.add(cabin);
const wheels=new T.InstancedMesh(wheelGeometry,tireMat,4),d=new T.Object3D();let wi=0;for(const sx of[-1,1])for(const sz of[-1,1]){d.position.set(sx*s.w/2,.38,sz*s.l*.32);d.rotation.set(0,0,PI/2);d.updateMatrix();wheels.setMatrixAt(wi++,d.matrix)}wheels.instanceMatrix.needsUpdate=true;b.add(wheels);
const lights=new T.InstancedMesh(boxGeometry(.28,.13,.08),lightMat,4);wi=0;for(const sx of[-1,1])for(const front of[true,false]){d.position.set(sx*s.w*.32,.72,front?s.l/2:-s.l/2);d.rotation.set(0,0,0);d.scale.set(1,1,1);d.updateMatrix();lights.setMatrixAt(wi,d.matrix);lights.setColorAt(wi,new T.Color(front?0xfff2c0:0xaa1111));wi++}lights.instanceMatrix.needsUpdate=true;lights.instanceColor.needsUpdate=true;b.add(lights);
let bar=null;if(s.pol){bar=new T.Mesh(boxGeometry(.9,.2,.3),new T.MeshBasicMaterial({color:0xff2020}));bar.position.set(0,s.h+1.1,0);b.add(bar)}
g.position.set(x,0,z);g.rotation.y=h;scene.add(g);
const c={s,g,b,bodyM,base:new T.Color(s.col),wh:[],bar,x,z,h,v:0,sv:0,pv:0,dmg:0,ai,tv:0,stuck:0,r:.8+s.l*.17};cars.push(c);return c}
function carPhys(c,dt,thr,str,hb){const s=c.s;
if(thr>0)c.v+=thr*s.acc*(1-Math.max(0,c.v)/s.max)*dt;
else if(thr<0){if(c.v>1)c.v-=s.brk*dt;else c.v-=s.acc*.5*(1-Math.max(0,-c.v)/(s.max*.3))*dt}
c.v-=c.v*.25*dt;if(!thr)c.v-=Math.sign(c.v)*Math.min(Math.abs(c.v),2*dt);if(hb)c.v-=c.v*1.8*dt;
c.sv+=(str-c.sv)*Math.min(1,dt*8);
c.h+=c.sv*s.turn*dt*Math.max(-1,Math.min(1,c.v/5))/(1+Math.abs(c.v)*.03)*(hb?1.6:1);
c.x+=Math.sin(c.h)*c.v*dt;c.z+=Math.cos(c.h)*c.v*dt}
function wall(c){if(push(c,c.r)){const sp=Math.abs(c.v);if(sp>6)c.dmg+=sp*.6;c.v*=sp>6?.45:.92}c.x=Math.max(-W-8,Math.min(W+8,c.x));c.z=Math.max(-W-8,Math.min(W+8,c.z))}
function bump(c){for(const o of cars){if(o===c)continue;const dx=c.x-o.x,dz=c.z-o.z,d=Math.hypot(dx,dz),m=c.r+o.r;if(d<m&&d>.01){c.x+=dx/d*(m-d);c.z+=dz/d*(m-d);c.dmg+=Math.abs(c.v)*.25;c.v*=.6;o.v*=.7}}}
function visual(c,dt){c.g.position.set(c.x,0,c.z);c.g.rotation.y=c.h;c.wh.forEach(p=>p.rotation.x+=c.v*dt/.38);
const ac=Math.max(-30,Math.min(30,(c.v-c.pv)/Math.max(dt,.001)));c.pv=c.v;
c.b.rotation.z+=(-c.sv*Math.min(1,Math.abs(c.v)/30)*.1-c.b.rotation.z)*.15;c.b.rotation.x+=(-ac*.002-c.b.rotation.x)*.1;
c.bodyM.color.copy(c.base).multiplyScalar(1-Math.min(.7,c.dmg/150));if(c.bar)c.bar.material.color.setHex((clock*6|0)%2?0xff2020:0x2060ff)}
mkCar('hatch',20,-6.5,PI/2);mkCar('sports',30,-6.5,PI/2);mkCar('van',40,-6.5,PI/2);mkCar('bus',-60+6.5,20,0);mkCar('sedan',50,-6.5,PI/2);mkCar('suv',60,-6.5,PI/2);mkCar('taxi',70,-6.5,PI/2);mkCar('courier',80,-6.5,PI/2);mkCar('coupe',90,-6.5,PI/2);mkCar('pickup',100,-6.5,PI/2);
const trK=['hatch','sedan','van','sports','bus','suv','taxi','courier','coupe','pickup'];
for(let i=0;i<8;i++){const ax=R()<.5?'x':'z',sg=R()<.5?-1:1,k=(R()*7|0)-3,u=R()*340-170;
const c=mkCar(trK[i%trK.length],ax=='x'?u:k*P-sg*4,ax=='x'?k*P+sg*4:u,ax=='x'?sg*PI/2:(sg>0?0:PI),{ax,sg});c.cruise=11+R()*7}
const peds=[];for(let i=0;i<22;i++){const shirt=new T.Color().setHSL(R(),.5,.45).getHex(),pants=new T.Color().setHSL(R(),.3,.2).getHex(),g=human(shirt,pants),lod=humanLite(shirt,pants);g.visible=false;lod.visible=false;peds.push({stand:R()<.25,g,lod,ax:R()<.5?'x':'z',k:(R()*7|0)-3,sd:R()<.5?-1:1,sg:R()<.5?-1:1,u:R()*340-170,dead:0,ph:R()*9})}
const me=human(JC[0],0x1c1f2a,true),pl={x:12,y:0,z:12,h:0},pv={x:0,z:0};let vy=0,ph=0,jumpQueued=false;
const cutsceneDirector=new CutsceneDirector(cam,$('cin'),$('cinText'),()=>new T.Vector3(pl.x,pl.y+1,pl.z));
const storyPeople=CAST.map(c=>{const g=human(c.shirt,c.pants);g.position.set(c.x,0,c.z);g.rotation.y=c.h;g.visible=false;return{...c,g,visits:0}});
let storyChoices={},talker=null;
const hl=new T.SpotLight(0xfff0cc,0,70,.55,.6);hl.target=new T.Object3D();scene.add(hl,hl.target);
/* ---------- STATE ---------- */
const MS=MISSIONS;
let state='menu',money=300,mi=0,stage=0,mt=0,houseRepair=0,controlPreset=0,hp=100,wanted=0,heat=0,gt=17,clock=0,lp=0,cy=0,cp=.35,fp=false,wx=0,rainA=0,fd=.0035,wp=null,hurtT=0,gfx=perf.quality,si=1,mapOpen=false,locked=false,hadLock=false,jc=0,stats={kills:0,dist:0};
const GN=['Low','Medium','High','Ultra'],SN=['Slow','Normal','Fast'],SS=[.0015,.0025,.004],WXN=['Clear','Cloudy','Rain','Fog'],WF=[.0035,.005,.007,.02],WR=[0,0,1,0],SK='berlinlife.v2';
/* ---------- SAVE ---------- */
function save(){try{localStorage.setItem(SK,JSON.stringify({v:2,m:money,mi,st:stage,mt,hr:houseRepair,x:pl.x,z:pl.z,jc,gt,k:stats.kills,w:own.join(''),q:storyChoices}))}catch(e){}}
function load(){try{let s=JSON.parse(localStorage.getItem(SK)||localStorage.getItem('berlinlife.v1'));if(s&&s.v===1){s.st=0;s.mt=0;s.v=2}if(s&&s.v===2&&[s.m,s.mi,s.x,s.z,s.jc,s.gt].every(Number.isFinite)&&s.mi>=0&&s.mi<=MS.length&&Math.abs(s.x)<W+10&&Math.abs(s.z)<W+10&&s.jc>=0&&s.jc<JC.length)return s}catch(e){}return null}
/* ---------- UI ---------- */
let tto;function toast(t){$('tt').textContent=t;clearTimeout(tto);tto=setTimeout(()=>$('tt').textContent='',2800)}
function menu(kind){state=kind==='pause'?'pause':'menu';$('ov').style.display='flex';const b=[],mb=$('mb');
if(kind==='main'){b.push(['New game',()=>start(null)]);const s=load();if(s)b.push(['Continue',()=>start(s)])}
else b.push(['Resume',resume],['Save game',()=>{save();toast('Game saved')}],['Graphics: '+perf.name(),()=>{perf.cycle();gfx=perf.quality;applyGfx();menu('pause')}],['Weather: '+WXN[wx],()=>{wx=(wx+1)%WXN.length;menu('pause')}],['Movement keys: '+(controlPreset?'Arrows':'WASD'),()=>{controlPreset^=1;menu('pause')}],['Mouse speed: '+SN[si],()=>{si=(si+1)%3;menu('pause')}],['Main menu',()=>{save();menu('main')}]);
mb.innerHTML='';b.forEach(([t,f])=>{const e=document.createElement('button');e.textContent=t;e.onclick=f;mb.appendChild(e)})}
function lock(){/* Pointer lock is optional; drag-look is available without browser permission. */}
function resume(){state='play';$('ov').style.display='none';lock()}
function cutscene(which,phase='intro'){let beats;if(typeof which==='number')beats=CAMPAIGN_CUTSCENES[which]?.[phase];else beats=[{speaker:'NIKO',line:String(which),camera:[18,10,22],look:[0,1,0],duration:3.2}];cutsceneDirector.play(beats)}
function seedCrowd(){for(const p of peds){const x=p.ax==='x'?p.u:p.k*P+p.sd*10.5,z=p.ax==='x'?p.k*P+p.sd*10.5:p.u,d=Math.hypot(x-pl.x,z-pl.z);p.g.position.set(x,0,z);p.lod.position.set(x,0,z);p.g.visible=d<16;p.lod.visible=d>=16&&d<72}for(const a of storyPeople)a.g.visible=Math.hypot(a.x-pl.x,a.z-pl.z)<72}
function start(s){audio();money=300;mi=0;stage=0;mt=0;houseRepair=0;hp=100;wanted=0;jc=0;gt=17;pl.x=12;pl.z=12;stats={kills:0,dist:0};storyChoices={};talker=null;cutsceneDirector.skip();$('talk').hidden=true;
if(s){money=s.m;mi=s.mi;stage=s.st||0;mt=s.mt||0;houseRepair=s.hr||0;pl.x=s.x;pl.z=s.z;jc=s.jc;gt=s.gt;stats.kills=s.k||0;storyChoices=s.q&&typeof s.q==='object'?s.q:{}}
cur=null;dress(me,JC[jc]);resetWeapons(s);cars.filter(c=>c.ai&&c.ai.pol).forEach(rmCar);seedCrowd();resume();if(s&&mi>=MS.length&&storyChoices.ending===undefined)endingChoice()}
function applyGfx(){gfx=perf.quality;resize()}
function resize(){rn.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
addEventListener('resize',resize);
let ac,eo,eg,so,sg;function audio(){if(ac)return;try{ac=new(window.AudioContext||window.webkitAudioContext)();eo=ac.createOscillator();eo.type='sawtooth';eg=ac.createGain();eg.gain.value=0;eo.connect(eg);eg.connect(ac.destination);eo.start();so=ac.createOscillator();so.type='square';sg=ac.createGain();sg.gain.value=0;so.connect(sg);sg.connect(ac.destination);so.start()}catch(e){}}
function drawMapOld(c,sc,full){const g=c.getContext('2d'),w=c.width,h=c.height,ox=full?0:pl.x,oz=full?0:pl.z,hd=cur?cur.h:pl.h,tg=wp||obj();
g.fillStyle='#101317';g.fillRect(0,0,w,h);g.save();g.translate(w/2-ox*sc,h/2-oz*sc);
g.fillStyle='#2b3038';for(let k=-3;k<=3;k++){g.fillRect((-W-8)*sc,(k*P-8)*sc,(2*W+16)*sc,16*sc);g.fillRect((k*P-8)*sc,(-W-8)*sc,16*sc,(2*W+16)*sc)}
for(let i=-3;i<3;i++)for(let j=-3;j<3;j++){g.fillStyle=(i==-1&&j==0)?'#2f5a34':'#444b55';g.fillRect(((i+.5)*P-18)*sc,((j+.5)*P-18)*sc,36*sc,36*sc)}
if(full){g.fillStyle='#e8e9ea';g.font='bold 15px sans-serif';[['TV tower',30,30],['Brandenburg Gate',-30,-30],['Tiergarten',-30,30],['East Side Gallery',-150,0],['Potsdamer Platz',90,-30]].forEach(l=>g.fillText(l[0],l[1]*sc-30,l[2]*sc))}
g.strokeStyle='#ffd900';g.lineWidth=3;g.beginPath();g.moveTo(pl.x*sc,pl.z*sc);g.lineTo(tg.x*sc,pl.z*sc);g.lineTo(tg.x*sc,tg.z*sc);g.stroke();
const dot=(x,z,c)=>{g.fillStyle=c;g.beginPath();g.arc(x*sc,z*sc,5,0,7);g.fill()};
if(mi<MS.length)dot(obj().x,obj().z,'#ffd900');if(wp)dot(wp.x,wp.z,'#19e6ff');cars.forEach(c=>{if(c.ai&&c.ai.pol)dot(c.x,c.z,'#ff3030')});
g.translate(pl.x*sc,pl.z*sc);g.rotate(PI-hd);g.fillStyle='#fff';g.beginPath();g.moveTo(0,-8);g.lineTo(6,7);g.lineTo(-6,7);g.fill();g.restore()}
$('mc').onclick=e=>{const r=e.target.getBoundingClientRect(),k=640/r.width;wp={x:((e.clientX-r.left)*k-320)/(640/(2*W+40)),z:((e.clientY-r.top)*k-320)/(640/(2*W+40))};toast('Waypoint set')};
function obj(){if(mi>=MS.length)return{x:0,z:0};const m=MS[mi];return stage?{x:m[4],z:m[5]}:{x:m[2],z:m[3]}}
/* ---------- GAME LOGIC ---------- */
const angd=(a,b)=>((b-a+PI)%(2*PI)+2*PI)%(2*PI)-PI,V1=new T.Vector3();
function rmCar(c){scene.remove(c.g);cars.splice(cars.indexOf(c),1)}
function spawnPol(){const a=R()*6.28;let x=pl.x+Math.sin(a)*100,z=pl.z+Math.cos(a)*100;if(R()<.5)x=Math.round(x/P)*P;else z=Math.round(z/P)*P;x=Math.max(-W,Math.min(W,x));z=Math.max(-W,Math.min(W,z));mkCar('police',x,z,0,{pol:1})}
function crime(n){if(!wanted)lastSeen=null;wanted=Math.min(3,wanted+n);heat=25;toast('Wanted level '+wanted)}
function hurt(n){hp-=n;if(hp<=0){toast('Busted — €100 fine');money=Math.max(0,money-100);hp=100;wanted=0;cur=null;pl.x=12;pl.z=12;cars.filter(c=>c.ai&&c.ai.pol).forEach(rmCar)}}
function toggleCar(){if(cur){const c=cur;cur=null;pl.x=c.x+Math.cos(c.h)*2.8;pl.z=c.z-Math.sin(c.h)*2.8;pl.y=0;pv.x=pv.z=0;toast('You stepped out');return}
let b=null,bd=6;for(const c of cars){if(c===cur||(c.ai&&c.ai.pol))continue;const d=Math.hypot(c.x-pl.x,c.z-pl.z);if(d<bd){bd=d;b=c}}if(b){if(b.ai&&b.ai.ax){b.ai=null;b.v=0}cur=b;toast('Driving: '+b.s.n)}}
let endingPending=false;
function finish(){const done=mi,m=MS[done],final=done===MS.length-1;money+=m[8];$('rt').textContent=final?'STORY COMPLETE':'MISSION COMPLETE';$('rx').textContent=m[0]+' · +€'+m[8];$('res').style.display='flex';setTimeout(()=>$('res').style.display='none',final?6500:3500);if(final)houseRepair=100;mi++;stage=0;mt=0;endingPending=final;save();cutscene(done,'outro')}
function missions(dt){beam.visible=mi<MS.length;if(mi>=MS.length)return;const m=MS[mi],o=obj(),d=Math.hypot(pl.x-o.x,pl.z-o.z);beam.position.set(o.x,35,o.z);
if(!stage){if(d<8){stage=1;mt=m[7];if(mi===5)gt=20;if(mi===7)wx=2;toast('Mission: '+m[0]);cutscene(mi,'intro');if(mi===6||mi===10)crime(mi===10?2:1);save()}}
else{if(m[7]){mt-=dt;if(mt<=0){toast('Time’s up — try again');stage=0;mt=0;save();return}}
if(d<(cur?10:7)){if(m[6]&&!cur)$('pr').textContent='Arrive by car';else if(mi===6&&wanted>0)$('pr').textContent='Lose the search first';else if(mi===MS.length-1&&houseRepair<100)$('pr').textContent='E — repair your home (€200 each)';else if(m[10]&&!storyChoices['mission-'+mi]){$('pr').textContent='Talk to '+(storyPeople.find(a=>a.id===m[10])?.name||'the contact')}else finish()}}}
function walk(dt){const ix=(K.KeyD?1:0)-(K.KeyA?1:0),iz=(K.KeyW?1:0)-(K.KeyS?1:0),fx=-Math.sin(cy),fz=-Math.cos(cy);let mx=fx*iz-fz*ix,mz=fz*iz+fx*ix;const ml=Math.hypot(mx,mz),cr=K.ControlLeft,sp=cr?2:(K.ShiftLeft||K.ShiftRight)?8.5:4.8;
if(ml>0){mx=mx/ml*sp;mz=mz/ml*sp}else{mx=mz=0}
const k=Math.min(1,dt*10);pv.x+=(mx-pv.x)*k;pv.z+=(mz-pv.z)*k;pl.x+=pv.x*dt;pl.z+=pv.z*dt;
if(jumpQueued&&pl.y<=0){vy=6.5;jumpQueued=false}vy-=18*dt;pl.y+=vy*dt;if(pl.y<=0){pl.y=0;vy=0}
push(pl,.45);for(const c of cars){if(c===cur)continue;const dx=pl.x-c.x,dz=pl.z-c.z,d=Math.hypot(dx,dz),r=c.r*.72+.52;if(d<r){const nx=d>.001?dx/d:1,nz=d>.001?dz/d:0,overlap=r-d;pl.x+=nx*overlap;pl.z+=nz*overlap;const into=pv.x*nx+pv.z*nz;if(into<0){pv.x-=nx*into*1.25;pv.z-=nz*into*1.25}}}pl.x=Math.max(-W+2,Math.min(W-2,pl.x));pl.z=Math.max(-W+2,Math.min(W-2,pl.z));
const s=Math.hypot(pv.x,pv.z);if(s>.4)pl.h+=angd(pl.h,Math.atan2(pv.x,pv.z))*Math.min(1,dt*12);
ph+=s*dt*2.2;const L=me.L,amp=s>.25?Math.min(1,s/4):.035,a=Math.sin(ph)*amp*.8,kA=1-Math.exp(-dt*13);L.ll.rotation.x+=(a-L.ll.rotation.x)*kA;L.rl.rotation.x+=(-a-L.rl.rotation.x)*kA;L.la.rotation.x+=(-a-L.la.rotation.x)*kA;L.ra.rotation.x+=(a-L.ra.rotation.x)*kA;
L.t.position.y=.98+Math.sin(clock*1.6)*.012;me.position.set(pl.x,pl.y,pl.z);me.rotation.y=pl.h;me.scale.y+=( (cr?.75:1)-me.scale.y)*kA}
function update(dt){clock+=dt;gt=(gt+dt/30)%24;lp=((clock/8)|0)%2;
sigX.material.color.setHex(lp?0xff3030:0x2ecc40);sigZ.material.color.setHex(lp?0x2ecc40:0xff3030);
if(cur){const c=cur;carPhys(c,dt,(K.KeyW?1:0)-(K.KeyS?1:0),(K.KeyA?1:0)-(K.KeyD?1:0),K.Space);wall(c);bump(c);pl.x=c.x;pl.z=c.z;pl.h=c.h;stats.dist+=Math.abs(c.v)*dt;cy+=angd(cy,c.h+PI)*Math.min(1,dt*2);cp+=(.25-cp)*dt*.8}else walk(dt);
me.visible=!cur&&!fp;
let polN=0,near=1e9;
for(const c of cars.slice()){if(c===cur){visual(c,dt);continue}const d=Math.hypot(c.x-pl.x,c.z-pl.z);
if(c.ai&&c.ai.pol){polN++;near=Math.min(near,d);if(c.ai.block&&d<45)c.ai.block=0;const sx_=d<90||!lastSeen,tx=sx_?pl.x:lastSeen.x,tz=sx_?pl.z:lastSeen.z,a=Math.atan2(tx-c.x,tz-c.z),df=angd(c.h,a);if(c.ai.block)c.v=0;else carPhys(c,dt,(d>9||!sx_)?1:.2,Math.max(-1,Math.min(1,df*2)),false);wall(c);bump(c);
if(Math.abs(c.v)<1.5&&!c.ai.block)c.stuck+=dt;else c.stuck=0;if(c.stuck>4){rmCar(c);continue}if(d<3.4&&!cur)hurt(15*dt);else if(d<c.r+(cur?cur.r:.5)+.5)hurt(10*dt)}
else if(c.ai){const a=c.ai;let tv=c.cruise;const u=(a.ax=='x'?c.x:c.z)*a.sg,n=Math.ceil(u/P)*P-u;if(((a.ax=='x')!==(lp==0))&&n<15&&n>5)tv=0;
for(const o of cars){if(o===c)continue;const dx=o.x-c.x,dz=o.z-c.z;if(dx*dx+dz*dz>24*24)continue;const f=dx*Math.sin(c.h)+dz*Math.cos(c.h),l=dx*Math.cos(c.h)-dz*Math.sin(c.h);if(f>0&&f<14&&Math.abs(l)<2.6)tv=Math.min(tv,Math.max(0,(f-6)*1.2))}
c.v+=(tv-c.v)*Math.min(1,dt*(tv<c.v?2.5:.8));c.x+=Math.sin(c.h)*c.v*dt;c.z+=Math.cos(c.h)*c.v*dt;
if(a.ax=='x'&&Math.abs(c.x)>W+4)c.x=-Math.sign(c.x)*(W+3);if(a.ax=='z'&&Math.abs(c.z)>W+4)c.z=-Math.sign(c.z)*(W+3);
if(!cur&&Math.abs(c.v)>5&&d<c.r+.6&&hurtT<=0){hurt(20);hurtT=.8;pv.x=Math.sin(c.h)*8;pv.z=Math.cos(c.h)*8}}
else{c.v*=Math.pow(.05,dt);c.x+=Math.sin(c.h)*c.v*dt;c.z+=Math.cos(c.h)*c.v*dt;wall(c)}
c.g.visible=d<58;if(c.g.visible)visual(c,dt)}
hurtT-=dt;combat(dt,near,polN);
for(const p of peds){const x=p.ax=='x'?p.u:p.k*P+p.sd*10.5,z=p.ax=='x'?p.k*P+p.sd*10.5:p.u,d=Math.hypot(x-pl.x,z-pl.z);
if(d>76){p.g.visible=false;p.lod.visible=false;continue}
if(p.dead>0){p.dead-=dt;p.g.visible=d<16;p.lod.visible=d>=16;if(p.dead<=0){p.g.rotation.x=p.lod.rotation.x=0;p.g.position.y=p.lod.position.y=0}continue}
p.flee=Math.max(0,(p.flee||0)-dt);if(d<125&&(!p.stand||p.flee>0))p.u+=p.sg*(p.flee>0?5.2:1.4)*dt;if(Math.abs(p.u)>W+10)p.u=-Math.sign(p.u)*(W+9);
const px=p.ax=='x'?p.u:p.k*P+p.sd*10.5,pz=p.ax=='x'?p.k*P+p.sd*10.5:p.u,heading=Math.atan2(p.ax=='x'?p.sg:0,p.ax=='z'?p.sg:0),detail=d<16,actor=detail?p.g:p.lod;
p.g.visible=detail;p.lod.visible=!detail;p.g.position.set(px,0,pz);p.lod.position.set(px,0,pz);p.g.rotation.y=p.lod.rotation.y=heading;
if(!p.stand||p.flee>0){p.ph+=dt*(p.flee>0?11:6);const a=Math.sin(p.ph)*.6,L=actor.L;L.ll.rotation.x=a;L.rl.rotation.x=-a;L.la.rotation.x=-a;L.ra.rotation.x=a}
if(cur&&Math.abs(cur.v)>5&&Math.hypot(px-cur.x,pz-cur.z)<cur.r+.6){p.dead=6;p.g.rotation.x=p.lod.rotation.x=-1.5;p.g.position.y=p.lod.position.y=.3;stats.kills++;crime(1)}}
for(const a of storyPeople){const d=Math.hypot(a.x-pl.x,a.z-pl.z);a.g.visible=d<125;if(a.g.visible){a.g.L.la.rotation.x=Math.sin(clock*1.4+a.mission)*.08;a.g.L.ra.rotation.x=Math.sin(clock*1.1+a.mission+1)*.05}}
if(wanted>0){heat-=dt*(near>120?3:1);if(heat<=0){wanted--;heat=18;if(!wanted){toast('Wanted level cleared');cars.filter(c=>c.ai&&c.ai.pol).forEach(rmCar)}}if(polN<wanted+1)spawnPol()}
missions(dt);if(scoreAction){scoreAction.t+=dt;if(Math.hypot(pl.x-scoreAction.side.x,pl.z-scoreAction.side.z)>9||cur){toast('Bonus scene cancelled');scoreAction=null}else if(scoreAction.t>=4){money+=scoreAction.side.reward;scoreAction.side.cool=180;toast(scoreAction.side.label+' bonus · +€'+scoreAction.side.reward);radio('Niko: I am sure the receipt for that is somewhere.');scoreAction=null;save()}}
// camera
const cd=cur?6+cur.s.l*.9:5.2,ty=cur?1.5:1.6+pl.y,ox=Math.sin(cy)*Math.cos(cp),oy=Math.sin(cp),oz=Math.cos(cy)*Math.cos(cp);
if(fp&&!cur){cam.position.set(pl.x,pl.y+1.65,pl.z);cam.lookAt(pl.x-ox,pl.y+1.65-oy,pl.z-oz)}
else{const sh=(wi&&!cur)?1.1:0,sx=oz*sh,sz=-ox*sh;V1.set(pl.x+ox*cd+sx,ty+oy*cd+(cur?1.2:0),pl.z+oz*cd+sz);cam.position.lerp(V1,1-Math.pow(1e-4,dt));cam.lookAt(pl.x+sx,ty,pl.z+sz)}
env(dt,pl.x,pl.z);
rain.position.set(pl.x,0,pl.z);if(rain.visible){for(let i=0;i<RN;i++){ry[i]-=40*dt;if(ry[i]<0)ry[i]=30;const j=i*6;rp[j]=rx[i];rp[j+1]=ry[i];rp[j+2]=rz[i];rp[j+3]=rx[i];rp[j+4]=ry[i]+.8;rp[j+5]=rz[i]}rainG.attributes.position.needsUpdate=true}
if(eg){eg.gain.setTargetAtTime(cur?.035:0,ac.currentTime,.1);eo.frequency.setTargetAtTime(40+(cur?Math.abs(cur.v)*5:0),ac.currentTime,.1);so.frequency.setTargetAtTime((clock*2|0)%2?700:950,ac.currentTime,.02);sg.gain.setTargetAtTime(near<90?(1-near/90)*.012:0,ac.currentTime,.1)}}
const NIGHT=new T.Color(0x070b18),DAYC=[0x8fbbe6,0x9aa3ad,0x6f7882,0xaab0b4].map(c=>new T.Color(c)),ORG=new T.Color(0xe8905a),sk=new T.Color();
function env(dt,fx,fz){const a=(gt-6)/12*PI,e=Math.sin(a),day=Math.max(0,Math.min(1,e*2+.25)),k=Math.min(1,dt*.5);
rainA+=(WR[wx]-rainA)*k;fd+=(WF[wx]-fd)*k;sk.copy(NIGHT).lerp(DAYC[wx],day).lerp(ORG,Math.max(0,1-Math.abs(e)/.35)*.45);
skyU.hor.value.copy(sk);skyU.top.value.copy(sk).lerp(DEEP,(wx?.15:.55)*day);skyU.nt.value=1-day;skyU.sd.value.set(Math.cos(a),Math.sin(a),.4);scene.fog.color.copy(sk);scene.fog.density=fd;
const sunset=Math.max(0,1-Math.abs(e)/.62);sun.color.setRGB(1,1-.16*sunset,1-.32*sunset);sun.intensity=Math.max(0,e)*(wx?.85:1.25);sun.position.set(fx+Math.cos(a)*120,30+Math.abs(e)*120,fz+50);sun.target.position.set(fx,0,fz);hemi.intensity=.3+.68*day;rn.toneMappingExposure=1.18+.14*sunset;
const n=1-day;nightV=n;shopMat.emissiveIntensity=n*.9;bm.forEach(m=>m.emissiveIntensity=n);lampMat.color.setHex(n>.5?0xffe9a0:0x555555);roadMat.roughness=.9-.55*rainA;
rain.visible=rainA>.05;rain.material.opacity=.58*rainA;roadMat.roughness=.9-.68*rainA;roadMat.metalness=.12*rainA;
hl.intensity=cur&&n>.4?3:0;if(cur){hl.position.set(cur.x+Math.sin(cur.h)*2.3,1,cur.z+Math.cos(cur.h)*2.3);hl.target.position.set(cur.x+Math.sin(cur.h)*20,0,cur.z+Math.cos(cur.h)*20)}}
function hud(){const o=obj(),tg=wp||o,m=MS[mi];
if(wp&&Math.hypot(pl.x-wp.x,pl.z-wp.z)<12){wp=null;toast('Waypoint reached')}
if(m){$('mtt').textContent=String(mi+1).padStart(2,'0')+' / '+MS.length+' · '+m[0]+(houseRepair>=100?' · HOME RESTORED':'');$('mtx').textContent=stage?(m[1]+(m[7]?'  ⏱ '+Math.max(0,mt|0)+'s':'')):'Go to the yellow marker to start.'}else{$('mtt').textContent='Story complete';$('mtx').textContent='Free roam. Set waypoints with M.'}
$('mn').textContent='€'+money.toLocaleString('en-US');$('st').textContent='★'.repeat(wanted)+'☆'.repeat(3-wanted);$('hi').style.width=Math.max(0,hp)+'%';
const h=Math.floor(gt),mm=Math.floor((gt%1)*60);$('tm').textContent=(h<10?'0':'')+h+':'+(mm<10?'0':'')+mm+' · '+WXN[wx];
$('sp').innerHTML=cur?Math.round(Math.abs(cur.v)*3.6)+'<small> km/h</small>':'';
$('nav').textContent=navTxt;
let p=promptX;if(scoreAction)p='Bonus objective · stay close '+Math.max(0,4-scoreAction.t).toFixed(1)+'s';if(cur)p='F — Get out';else if(mi===MS.length-1&&houseRepair<100&&Math.hypot(pl.x+140,pl.z-150)<10)p='E — Repair your home (€200 each)';else{let person=null,pd=5;for(const a of storyPeople){const d=Math.hypot(a.x-pl.x,a.z-pl.z);if(d<pd){person=a;pd=d}}if(person)p='E — Talk to '+person.name;else for(const c of cars){const d=Math.hypot(c.x-pl.x,c.z-pl.z);if(!(c.ai&&c.ai.pol)&&d<7){p=d<6?'F — Enter '+c.s.n:'Walk closer to '+c.s.n;break}}}
if($('pr').textContent!=='Arrive by car'||!p)$('pr').textContent=p;if(m&&stage&&m[10]&&!storyChoices['mission-'+mi]&&Math.hypot(pl.x-o.x,pl.z-o.z)<7&&!(mi===MS.length-1&&houseRepair<100))$('pr').textContent='E — Talk to '+(storyPeople.find(a=>a.id===m[10])?.name||'the contact');$('pr').style.display=$('pr').textContent?'block':'none';
if(m&&stage&&m[6]&&!cur&&Math.hypot(pl.x-o.x,pl.z-o.z)>=7)$('pr').style.display=$('pr').textContent?'block':'none';
drawMap($('mm'),.6,false);if(mapOpen)drawMap($('mc'),640/(2*W+40)*mz,true)}
/* ---------- GUNS, MARKET, POLICE, NAV ---------- */
const WP=[{n:'Holstered',len:0},{n:'Pistol',d:1.2,rate:.28,mag:12,spr:.008,pel:1,len:.35,f:420},{n:'SMG',d:.7,rate:.085,mag:30,spr:.03,pel:1,len:.5,f:300},{n:'Shotgun',d:1.8,rate:.85,mag:6,spr:.06,pel:6,len:.75,f:180}];
let wi=0,own=[1,1,0,0],mag=[0,12,30,6],res=[0,60,120,30],fireT=0,reloadT=0,mouseDown=false,flash=0,promptX='',navTxt='',lastSeen=null,rbT=0,radT=0,rto,srch=false,mz=1;
const gunM=WP.map((w,i)=>{if(!i)return null;const g=new T.Group(),m=new T.Mesh(new T.BoxGeometry(.07,w.len,.11),std(i==3?0x5a3b22:0x25272c,.4,.6));m.position.y=-.5-w.len/2;g.add(m);if(i>1){const b=new T.Mesh(new T.BoxGeometry(.06,.16,.08),std(0x111111));b.position.set(0,-.62,-.09);g.add(b)}g.visible=false;me.L.ra.add(g);return g});
const rc=new T.Raycaster(),D=new T.Vector3(),trs=[],sps=[],offs=[],rob={on:0,t:0},sideScores=[{x:120,z:-60,label:'Potsdamer kiosk',reward:250,cool:0},{x:-90,z:30,label:'record-shop counter',reward:350,cool:0}],scoreAction=null,cl={x:90,z:27,alive:true,rt:0,cool:0,hands:0};
for(let i=0;i<10;i++){const l=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3()]),new T.LineBasicMaterial({color:0xffe8a0,transparent:true}));l.visible=false;l.frustumCulled=false;l.life=0;scene.add(l);trs.push(l);const s=new T.Mesh(new T.SphereGeometry(.12,6,4),new T.MeshBasicMaterial({color:0xffc060}));s.visible=false;s.life=0;scene.add(s);sps.push(s)}
const mf=new T.Mesh(new T.SphereGeometry(.14,6,4),new T.MeshBasicMaterial({color:0xffd070})),mfL=new T.PointLight(0xffa040,0,14);mf.visible=false;scene.add(mf,mfL);
function tracer(a,b,c){const l=trs.find(x=>x.life<=0)||trs[0],p=l.geometry.attributes.position;p.setXYZ(0,a.x,a.y,a.z);p.setXYZ(1,b.x,b.y,b.z);p.needsUpdate=true;l.material.color.setHex(c||0xffe8a0);l.life=.08;l.visible=true}
function spark(e){const s=sps.find(x=>x.life<=0)||sps[0];s.position.copy(e);s.life=.15;s.visible=true}
function snd(f,d,v){if(!ac)return;const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type='sawtooth';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(40,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(t+d)}
function radio(t){const e=$('rad');e.textContent='📻 '+t;e.style.display='block';clearTimeout(rto);rto=setTimeout(()=>e.style.display='none',3500)}
function mkOff(x,z){offs.push({g:human(0x1d3f8f,0x14213d),x,z,hp:4,st:.5+R(),ph:0})}
function killOff(f){scene.remove(f.g);offs.splice(offs.indexOf(f),1);crime(1);radio('Officer down! All units respond!')}
/* the Späti market */
(function(){const wm=std(0xdad8d0,.8),wl_=(x0,x1,z0,z1)=>{bmesh.push(box(x1-x0,4.2,z1-z0,wm,(x0+x1)/2,2.4,(z0+z1)/2));addC((x0+x1)/2,(z0+z1)/2,(x1-x0)/2,(z1-z0)/2)};
wl_(78,102,31.6,32.2);wl_(77.6,78.2,16,32);wl_(101.8,102.4,16,32);wl_(78,88,16,16.6);wl_(92,102,16,16.6);
box(24,.4,16.6,std(0x2d3a4a),90,4.7,24);box(24,.06,16,std(0xcfd3d6,.6),90,.34,24,false);
for(const [x,z,w] of [[82,21,8],[82,25,8],[90,21,5]]){box(w,1.8,.9,std(0x7a5a3a),x,1.2,z);addC(x,z,w/2,.5);for(let i=0;i<w;i++)box(.7,.5,.5,new T.MeshBasicMaterial({color:NEON[(R()*4)|0]}),x-w/2+.6+i,1.75,z)}
box(8,1.1,1.2,std(0x555e68),96,.9,27.6);addC(96,27.6,4,.6);
const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.fillStyle='#0b3d1e';g.fillRect(0,0,512,128);g.fillStyle='#7dff6a';g.font='bold 84px sans-serif';g.textAlign='center';g.fillText('SPÄTI 24h',256,98);
add(new T.PlaneGeometry(10,2.5),new T.MeshBasicMaterial({map:new T.CanvasTexture(c)}),90,5.6,15.5,false).rotation.y=PI;
const lt=new T.PointLight(0xfff0d0,1.2,26);lt.position.set(90,3.8,24);scene.add(lt)})();
bld(82,43,14,22);bld(98,43,14,30);
cl.g=storyPeople.find(a=>a.id==='clerk').g;cl.g.position.set(cl.x,0,cl.z);cl.g.rotation.y=PI;
function showTalk(person){talker=person;state='dialogue';$('talk').hidden=false;$('talkRole').textContent=person.role;$('talkName').textContent=person.name;pl.h=Math.atan2(person.x-pl.x,person.z-pl.z);me.rotation.y=pl.h;person.g.rotation.y=Math.atan2(pl.x-person.x,pl.z-person.z);
const lines=NPC_LINES[person.id]||['Good to see you.'];$('talkLine').textContent=lines[(person.visits+(storyChoices[person.id]||0))%lines.length];
me.L.ra.rotation.x=-.85;person.g.L.la.rotation.x=-.55;person.g.L.ra.rotation.x=-.25;
const options=$('talkChoices');options.innerHTML='';[['Ask about work',0],['Ask how things are',1]].forEach(([label,n])=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>{storyChoices[person.id]=n;if(state==='dialogue'&&mi<MS.length&&MS[mi][10]===person.id)storyChoices['mission-'+mi]=true;person.visits++;$('talkLine').textContent=n?`${person.name}: ${lines[(person.visits+1)%lines.length]}`:`${person.name}: ${lines[person.visits%lines.length]}`;options.innerHTML='';const done=document.createElement('button');done.textContent='End conversation';done.onclick=closeTalk;options.appendChild(done);save()};options.appendChild(b)})}
function closeTalk(){if(talker){talker.g.L.la.rotation.x=talker.g.L.ra.rotation.x=0}me.L.ra.rotation.x=0;talker=null;$('talk').hidden=true;state='play';save()}
function endingChoice(){state='dialogue';$('talk').hidden=false;$('talkRole').textContent='BERLIN LIFE · FINALE';$('talkName').textContent='What should Alex do next?';$('talkLine').textContent='The city is quieter for a moment. Choose how the story ends.';const options=$('talkChoices');options.innerHTML='';[['A new start','Alex leaves trouble behind and starts over.'],['Family first','Alex puts Jonas and his friends first.'],['The city remembers','Alex exposes Viktor and changes the city.']].forEach(([title,line],i)=>{const b=document.createElement('button');b.textContent=title;b.onclick=()=>{storyChoices.ending=i;state='play';$('talk').hidden=true;save();const speaker=['ALEX','JONAS','LENA'][i];cutsceneDirector.play([{speaker,line,camera:[16,8,18],look:[0,1,0],duration:3.4},{speaker:'DENIZ',line:'Breakfast is on me. I know a place that is open.',camera:[-8,4,10],look:[0,1,0],duration:2.8}])};options.appendChild(b)})}
function interact(){if(state!=='play'||cur||!cl.alive)return;if(mi===MS.length-1&&Math.hypot(pl.x+140,pl.z-150)<10){if(houseRepair>=100){showTalk(storyPeople.find(a=>a.id==='niko'));return}if(money<200){toast('You need €200 for the next repair');return}money-=200;houseRepair=Math.min(100,houseRepair+25);toast('Home repairs '+houseRepair+'% · −€200');if(houseRepair>=100)cutscene('Niko: It is not fancy, but it is ours.');save();return}let near=null,nd=5;for(const p of storyPeople){const d=Math.hypot(pl.x-p.x,pl.z-p.z);if(d<nd){near=p;nd=d}}if(near&&!(near.id==='clerk'&&wi>0&&!(mi<MS.length&&MS[mi][10]==='clerk'))){showTalk(near);return}const side=sideScores.find(s=>Math.hypot(pl.x-s.x,pl.z-s.z)<7);if(side){if(side.cool>0)toast('That fictional side job has cooled off');else if(!wi)toast('Select an item with 1–3 to start this fictional side job');else{scoreAction={side,t:0};crime(1);toast('Bonus scene started. Stay near the counter for four seconds.')}return;}if(Math.hypot(pl.x-cl.x,pl.z-cl.z)>6)return;
if(wi>0){if(cl.cool>0||rob.on)return;rob.on=1;rob.t=0;cl.hands=1;crime(2);radio('Silent alarm at the Späti!');toast('Hold position — emptying the register')}
else if(money>=40&&hp<100){money-=40;hp=Math.min(100,hp+40);toast('First aid −€40')}else toast(hp>=100?'Already healthy':'Not enough money')}
function buyStuff(){if(cur||Math.hypot(pl.x-cl.x,pl.z-cl.z)>6||wi>0)return;
if(!own[2]&&money>=600){money-=600;own[2]=1;mag[2]=30;res[2]=120;toast('Bought SMG −€600')}
else if(!own[3]&&money>=900){money-=900;own[3]=1;mag[3]=6;res[3]=30;toast('Bought shotgun −€900')}
else if(money>=50){money-=50;[1,2,3].forEach(i=>{if(own[i])res[i]=[0,60,120,30][i]});toast('Ammo refilled −€50')}else toast('Not enough money')}
function resetWeapons(s){own=[1,1,0,0];mag=[0,12,30,6];res=[0,60,120,30];wi=0;if(s&&/^[01]{4}$/.test(s.w||''))own=s.w.split('').map(Number);offs.forEach(f=>scene.remove(f.g));offs.length=0;rob.on=0;showGun();wp=s?null:{x:90,z:12};if(!s)toast('GPS set to the Späti — follow the yellow arrows')}
function showGun(){gunM.forEach((g,i)=>{if(g)g.visible=i==wi});reloadT=0;$('xh').style.display=wi?'block':'none'}
function reload(){if(!wi||reloadT>0||mag[wi]>=WP[wi].mag||res[wi]<=0)return;reloadT=1.1;toast('Reloading…')}
function fire(){const w=WP[wi];if(fireT>0||reloadT>0)return;if(mag[wi]<=0){reload();return}
fireT=w.rate;mag[wi]--;flash=.05;snd(w.f,.12,.12);cam.getWorldDirection(D);const o=cam.position.clone().addScaledVector(D,5.2);
me.updateMatrixWorld(true);const mz2=gunM[wi].localToWorld(new T.Vector3(0,-.5-w.len,0));
for(let i=0;i<w.pel;i++){const d=D.clone();d.x+=(R()-.5)*w.spr*2;d.y+=(R()-.5)*w.spr*2;d.z+=(R()-.5)*w.spr*2;shoot(o,d.normalize(),mz2,w.d)}
mf.position.copy(mz2);mfL.position.copy(mz2);let n=0;
for(const p of peds){const dx=p.g.position.x-pl.x,dz=p.g.position.z-pl.z;if(dx*dx+dz*dz<900){n++;p.flee=7;p.sg=(p.ax=='x'?dx:dz)>=0?1:-1}}
if(n&&!wanted)crime(1)}
function shoot(o,d,mz2,dmg){let best=200,tg=null;rc.set(o,d);rc.far=200;const hs=rc.intersectObjects(bmesh);if(hs.length)best=hs[0].distance;
const sph=(x,y,z,r)=>{const lx=x-o.x,ly=y-o.y,lz=z-o.z,t=lx*d.x+ly*d.y+lz*d.z;if(t<0)return 1e9;const px=lx-d.x*t,py=ly-d.y*t,pz=lz-d.z*t;return px*px+py*py+pz*pz<r*r?t:1e9};
for(const p of peds){if(p.dead>0||!p.g.visible)continue;const t=sph(p.g.position.x,1,p.g.position.z,.55);if(t<best){best=t;tg={p}}}
for(const f of offs){const t=sph(f.x,1,f.z,.55);if(t<best){best=t;tg={f}}}
if(cl.alive){const t=sph(cl.x,1,cl.z,.55);if(t<best){best=t;tg={k:1}}}
for(const c of cars){if(c===cur)continue;const t=sph(c.x,1,c.z,c.r);if(t<best){best=t;tg={c}}}
const e=o.clone().addScaledVector(d,best);tracer(mz2,e);spark(e);
if(tg){if(tg.p){tg.p.dead=6;tg.p.g.rotation.x=-1.5;tg.p.g.position.y=.3;stats.kills++;crime(1)}else if(tg.f){tg.f.hp-=dmg;if(tg.f.hp<=0)killOff(tg.f)}else if(tg.k){cl.alive=false;cl.rt=60;rob.on=0;cl.g.rotation.x=-1.5;cl.g.position.y=.3;crime(2)}else{tg.c.dmg+=dmg*10;if(tg.c.ai&&tg.c.ai.pol)crime(1)}}}
function combat(dt,near,polN){fireT-=dt;flash-=dt;
if(reloadT>0){reloadT-=dt;if(reloadT<=0){const n=Math.min(WP[wi].mag-mag[wi],res[wi]);mag[wi]+=n;res[wi]-=n}}
if(wi&&!cur){pl.h+=angd(pl.h,Math.atan2(-Math.sin(cy),-Math.cos(cy)))*Math.min(1,dt*14);me.rotation.y=pl.h;me.L.ra.rotation.x=-1.45;me.L.la.rotation.x=-.3;if((mouseDown&&locked)||K.KeyX)fire()}
mf.visible=flash>0;mfL.intensity=flash>0?2.5:0;
for(const l of trs)if(l.life>0){l.life-=dt;if(l.life<=0)l.visible=false}
for(const s of sps)if(s.life>0){s.life-=dt;s.scale.setScalar(1+(.15-s.life)*8);if(s.life<=0)s.visible=false}
cl.cool=Math.max(0,cl.cool-dt);if(!cl.alive){cl.rt-=dt;if(cl.rt<=0){cl.alive=true;cl.g.rotation.x=0;cl.g.position.y=0}}
cl.g.L.la.rotation.x=cl.g.L.ra.rotation.x=cl.hands?-2.8:0;const dc=Math.hypot(pl.x-cl.x,pl.z-cl.z);
if(rob.on){rob.t+=dt;if(!cl.alive||dc>9||wi==0||cur){rob.on=0;cl.hands=0;toast('Robbery aborted')}else if(rob.t>=6){rob.on=0;cl.hands=0;const g=300+(R()*600|0);money+=g;cl.cool=150;toast('Robbed €'+g+' — get out!');radio('Suspect fleeing the Späti!')}}
$('rob').style.display=rob.on?'block':'none';$('rob').firstChild.style.width=(rob.t/6*100)+'%';
promptX=rob.on?'Robbing… keep your gun on the clerk':(!cur&&cl.alive&&dc<6)?(wi?(cl.cool>0?'Register is empty':'E — Rob the Späti'):'E — First aid €40 · B — Dealer (guns, ammo)'):'';
for(const c of cars.slice()){if(c.ai&&c.ai.pol){if(c.dmg>220){rmCar(c);continue}if(!c.dep&&!c.ai.block&&wanted>0&&offs.length<8&&Math.hypot(c.x-pl.x,c.z-pl.z)<32){c.dep=1;mkOff(c.x+Math.cos(c.h)*2.6,c.z-Math.sin(c.h)*2.6);mkOff(c.x-Math.cos(c.h)*2.6,c.z+Math.sin(c.h)*2.6);radio('Units on foot — suspect in sight')}}}
for(const f of offs.slice()){const dx=pl.x-f.x,dz=pl.z-f.z,d=Math.hypot(dx,dz),sp=d>14?4.6:0;if(d>1&&sp){f.x+=dx/d*sp*dt;f.z+=dz/d*sp*dt}push(f,.45);f.g.position.set(f.x,0,f.z);f.g.rotation.y=Math.atan2(dx,dz);f.ph+=dt*sp*2;const a=Math.sin(f.ph)*.7*(sp?1:0);f.g.L.ll.rotation.x=a;f.g.L.rl.rotation.x=-a;
f.st-=dt;if(d<40&&f.st<=0&&wanted>0){f.st=.9+R()*.7;const ht=R()<(cur?.25:.4);tracer(new T.Vector3(f.x,1.3,f.z),new T.Vector3(pl.x+(ht?0:(R()-.5)*3),1.1,pl.z+(ht?0:(R()-.5)*3)),0xff8080);snd(260,.1,.05);if(ht)hurt(6)}
if(d>160||!wanted){scene.remove(f.g);offs.splice(offs.indexOf(f),1)}}
srch=wanted>0&&near>90;if(near<90)lastSeen={x:pl.x,z:pl.z};
rbT-=dt;if(wanted>=3&&cur&&Math.abs(cur.v)>8&&rbT<=0){rbT=45;const m=Math.abs(Math.sin(cur.h))>Math.abs(Math.cos(cur.h)),bx=Math.max(-W,Math.min(W,cur.x+Math.sin(cur.h)*130)),bz=Math.max(-W,Math.min(W,cur.z+Math.cos(cur.h)*130)),rz=Math.round(cur.z/P)*P,rx=Math.round(cur.x/P)*P;
for(const s of[-3,3]){if(m)mkCar('police',bx,rz+s,0,{pol:1,block:1});else mkCar('police',rx+s,bz,PI/2,{pol:1,block:1})}radio('Roadblock set up ahead!')}
radT-=dt;if(wanted&&radT<=0){radT=8+R()*5;radio(srch?'Lost visual — sweep the last known position.':wanted>2?'All units: suspect armed and dangerous!':'Suspect on the run, pursue!')}
$('st').style.opacity=(srch&&(clock*3|0)%2)?.3:1;
$('wpn').textContent=wi?WP[wi].n+'  '+mag[wi]+' / '+res[wi]+(reloadT>0?' ⟳':''):'';$('stn').textContent=streetName();navHud();lamps()}
/* navigation */
const SNH=['Bernauer Str.','Torstraße','Unter den Linden','Karl-Marx-Allee','Kantstraße','Oranienstraße','Warschauer Str.'],SNV=['Friedrichstraße','Invalidenstr.','Leipziger Str.','Alexanderstr.','Kurfürstendamm','Hermannstraße','Sonnenallee'],ci=v=>Math.max(0,Math.min(6,Math.round(v/P)+3));
function streetName(){for(let k=-3;k<=3;k++)if(Math.abs(pl.z-k*P)<9)return SNH[k+3];for(let k=-3;k<=3;k++)if(Math.abs(pl.x-k*P)<9)return SNV[k+3];return Math.hypot(pl.x-90,pl.z-24)<14?'Späti':'Sidewalk'}
function snapPt(x,z){const rz=Math.max(-W,Math.min(W,Math.round(z/P)*P)),rx=Math.max(-W,Math.min(W,Math.round(x/P)*P));return Math.abs(z-rz)<Math.abs(x-rx)?{x,z:rz,h:1}:{x:rx,z,h:0}}
function route(t){const a=snapPt(pl.x,pl.z),b=snapPt(t.x,t.z),r=[{x:pl.x,z:pl.z},a],mid=(v,w)=>Math.max(-W,Math.min(W,Math.round((v+w)/2/P)*P));
if(a.h&&b.h){if(a.z!==b.z){const c=mid(a.x,b.x);r.push({x:c,z:a.z},{x:c,z:b.z})}}
else if(!a.h&&!b.h){if(a.x!==b.x){const c=mid(a.z,b.z);r.push({x:a.x,z:c},{x:b.x,z:c})}}
else if(a.h)r.push({x:b.x,z:a.z});else r.push({x:a.x,z:b.z});
r.push(b,{x:t.x,z:t.z});return r}
const arr=[];for(let i=0;i<28;i++)arr.push(add(new T.BoxGeometry(1.4,.05,2.6),new T.MeshBasicMaterial({color:0xffd900}),0,-9,0,false));
function navHud(){arr.forEach(a=>a.visible=false);if(mi>=MS.length&&!wp){navTxt='';return}const r=route(wp||obj()),sq=[];
for(let i=1;i<r.length;i++){const dx=r[i].x-r[i-1].x,dz=r[i].z-r[i-1].z,l=Math.hypot(dx,dz);if(l>1)sq.push({dx:dx/l,dz:dz/l,l,x:r[i].x,z:r[i].z})}
let tot=0;sq.forEach(s=>tot+=s.l);let t='Arrived';
if(sq.length){let d=sq[0].l,i=1;while(i<sq.length&&sq[i].dx*sq[i-1].dx+sq[i].dz*sq[i-1].dz>.9){d+=sq[i].l;i++}
if(i<sq.length){const c=sq[i-1].dx*sq[i].dz-sq[i-1].dz*sq[i].dx,nm=Math.abs(sq[i].dz)<.5?SNH[ci(sq[i].z)]:SNV[ci(sq[i].x)];t=Math.abs(c)<.2?'Make a U-turn':'In '+Math.round(d)+' m turn '+(c<0?'left':'right')+' onto '+nm}else t='Continue '+Math.round(d)+' m to destination'}
navTxt=t+' · '+Math.round(tot)+' m left';
const path=r.slice(1,r.length-1);let k=0,s0=2;
for(let i=1;i<path.length&&k<28;i++){const p0=path[i-1],p1=path[i],dx=p1.x-p0.x,dz=p1.z-p0.z,l=Math.hypot(dx,dz);if(l<1)continue;for(;s0<l&&k<28;s0+=7){const a=arr[k++];a.visible=true;a.position.set(p0.x+dx/l*s0,.16,p0.z+dz/l*s0);a.rotation.y=Math.atan2(dx,dz)}s0-=l}}
const LL=[0,1,2].map(()=>{const l=new T.PointLight(0xffd9a0,0,34);scene.add(l);return l});
function lamps(){const c=[],ax=Math.round(pl.x/P),az=Math.round(pl.z/P);for(let a=ax-1;a<=ax+1;a++)for(let b=az-1;b<=az+1;b++)for(const sx of[-10,10])for(const sz of[-10,10]){const x=a*P+sx,z=b*P+sz;c.push([(x-pl.x)**2+(z-pl.z)**2,x,z])}
c.sort((u,v)=>u[0]-v[0]);LL.forEach((l,i)=>{l.position.set(c[i][1],7.5,c[i][2]);l.intensity=nightV>.45?1.6:0})}
function drawMap(c,sc,full){const g=c.getContext('2d'),w=c.width,h=c.height,hd=cur?cur.h:pl.h,cx=full?(mz>1?pl.x:0):pl.x,cz=full?(mz>1?pl.z:0):pl.z;
g.fillStyle='#101317';g.fillRect(0,0,w,h);g.save();g.translate(w/2,h/2);if(!full)g.rotate(hd-PI);g.translate(-cx*sc,-cz*sc);
g.fillStyle='#2b3038';for(let k=-3;k<=3;k++){g.fillRect((-W-8)*sc,(k*P-8)*sc,(2*W+16)*sc,16*sc);g.fillRect((k*P-8)*sc,(-W-8)*sc,16*sc,(2*W+16)*sc)}
for(let i=-3;i<3;i++)for(let j=-3;j<3;j++){g.fillStyle=(i==-1&&j==0)?'#2f5a34':'#444b55';g.fillRect(((i+.5)*P-18)*sc,((j+.5)*P-18)*sc,36*sc,36*sc)}
const r=route(wp||obj());g.strokeStyle='#ffd900';g.lineWidth=full?4:3;g.lineJoin='round';g.beginPath();r.forEach((p,i)=>i?g.lineTo(p.x*sc,p.z*sc):g.moveTo(p.x*sc,p.z*sc));g.stroke();
const dot=(x,z,col,sq)=>{g.fillStyle=col;if(sq)g.fillRect(x*sc-5,z*sc-5,10,10);else{g.beginPath();g.arc(x*sc,z*sc,5,0,7);g.fill()}};
dot(90,24,cl.cool>0?'#777':'#3ddc57',1);if(mi<MS.length){const o=obj();dot(o.x,o.z,'#ffd900')}sideScores.forEach(q=>dot(q.x,q.z,q.cool>0?'#64686c':'#ff9b44',1));if(wp)dot(wp.x,wp.z,'#19e6ff');
if(wanted)cars.forEach(q=>{if(q.ai&&q.ai.pol)dot(q.x,q.z,(clock*4|0)%2?'#ff3030':'#3060ff')});offs.forEach(f=>dot(f.x,f.z,'#ff3030'));
if(full){g.fillStyle='#e8e9ea';g.font='bold 14px sans-serif';[['TV tower',30,30],['Brandenburg Gate',-30,-30],['Tiergarten',-30,30],['East Side Gallery',-150,0],['Potsdamer Platz',90,-30],['Späti',90,24]].forEach(l=>g.fillText(l[0],l[1]*sc-30,l[2]*sc-8));
g.translate(pl.x*sc,pl.z*sc);g.rotate(PI-hd);g.fillStyle='#fff';g.beginPath();g.moveTo(0,-8);g.lineTo(6,7);g.lineTo(-6,7);g.fill()}
g.restore();if(!full){g.fillStyle='#fff';g.beginPath();g.moveTo(w/2,h/2-10);g.lineTo(w/2+7,h/2+8);g.lineTo(w/2-7,h/2+8);g.fill()}}
$('mc').onwheel=e=>{e.preventDefault();mz=Math.max(1,Math.min(4,mz*(e.deltaY<0?1.2:.83)))};
$('mc').onclick=e=>{const r=e.target.getBoundingClientRect(),k=640/r.width,sc=640/(2*W+40)*mz,cx=mz>1?pl.x:0,cz=mz>1?pl.z:0;wp={x:cx+((e.clientX-r.left)*k-320)/sc,z:cz+((e.clientY-r.top)*k-320)/sc};toast('Waypoint set')};
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
let last=performance.now(),lastHud=0;
function frame(now){requestAnimationFrame(frame);const rawDt=Math.max(0,(now-last)/1000),dt=Math.min(.05,rawDt);last=now;
if(state==='play'&&!mapOpen){if(cutsceneDirector.active){const active=cutsceneDirector.update(dt);if(!active&&endingPending){endingPending=false;endingChoice()}}else update(dt)}else if(state==='menu'){gt=(gt+dt/60)%24;env(dt,0,0);const a=now/9000;cam.position.set(Math.sin(a)*150,70,Math.cos(a)*150);cam.lookAt(0,25,0)}
if(state==='play'&&now-lastHud>125){hud();lastHud=now}
perf.sample(rawDt,now,()=>({npcs:peds.filter(p=>p.g.visible||p.lod.visible).length+storyPeople.filter(p=>p.g.visible).length,cars:cars.filter(c=>c.g.visible).length}));sky.position.copy(cam.position);rn.render(scene,cam)}
applyGfx();dress(me,JC[0]);menu('main');requestAnimationFrame(frame);
