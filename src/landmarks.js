// Original low-cost landmarks to make long drives across the city feel distinct.
export function buildLandmarks(T, scene, std, box, addC) {
  const concrete = std(0x777a78, .82), pale = std(0xd1c8b5, .72), metal = std(0x37434a, .55, .55);
  const glass = std(0x254658, .32, .3), brick = std(0x9a624b, .85), green = std(0x426d48, .9);
  const mesh = (geometry, material, x, y, z, cast = false) => {
    const m = new T.Mesh(geometry, material);
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  };

  // Mila's open workshop gives the garage mission a recognizable destination.
  const garage = std(0x596064, .82), workshop = std(0x9b7652, .78), lift = std(0xb63228, .48, .3);
  box(24, .2, 18, concrete, -50, .1, 28, false);
  box(24, .3, 18, metal, -50, 7.3, 28, false);
  box(24, 7, .35, garage, -50, 6.8, 37, false);addC(-50,37,12,.22);
  for (const x of [-62,-38]) { box(.35,7,18,garage,x,6.8,28,false);addC(x,28,.22,9); }
  for (const x of [-62,-57,-43,-38]) { box(4.8,5.7,.35,garage,x,5.8,19,false);addC(x,19,2.4,.22); }
  for (const x of [-57,-43]) box(.45,3.4,.5,lift,x,1.8,29,false);
  box(8,.12,1,workshop,-50,.55,30,false);
  box(4,.25,.25,workshop,-50,2.2,18.5,false);
  for (let x=-53;x<=-47;x+=2) box(.55,.18,.15,std(0xffd068,.35),x,2.2,18.3,false);
  const signCanvas=document.createElement('canvas');signCanvas.width=512;signCanvas.height=128;
  const signCtx=signCanvas.getContext('2d');signCtx.fillStyle='#26333a';signCtx.fillRect(0,0,512,128);signCtx.fillStyle='#ffcf59';signCtx.font='bold 54px Arial';signCtx.textAlign='center';signCtx.fillText('MILA · GARAGE',256,82);
  mesh(new T.PlaneGeometry(9,2.25),new T.MeshBasicMaterial({map:new T.CanvasTexture(signCanvas)}),-50,6,18.7).rotation.y=Math.PI;
  const garageLight=new T.PointLight(0xffd394,1,22);garageLight.position.set(-50,5.8,27);scene.add(garageLight);

  // Small rail depot and loading bays in the east district.
  box(34, 11, 20, brick, 432, 5.5, 252, false);
  box(35, .5, 21, metal, 432, 11.2, 252, false);
  for (let i = 0; i < 5; i++) {
    box(4.8, 2.8, .18, glass, 420 + i * 6, 5.5, 241.8, false);
    box(1.1, 4.7, .22, metal, 417 + i * 6, 2.7, 241.6, false);
  }
  for (const x of [414, 432, 450]) {
    box(8, 2.8, 5, std(x === 432 ? 0xa65b3d : 0x346c75, .8), x, 1.5, 238, false);
    box(8.2, .2, 5.2, metal, x, 3, 238, false);
  }
  addC(432, 252, 17.5, 10.5);

  // A reflective canal and compact crossing by the river exchange.
  const water = new T.Mesh(new T.PlaneGeometry(132, 24), new T.MeshStandardMaterial({ color: 0x315766, roughness: .24, metalness: .42, transparent: true, opacity: .88 }));
  water.rotation.x = -Math.PI / 2;
  water.position.set(540, .08, -480);
  scene.add(water);
  box(132, .5, 8, pale, 540, .42, -480, false);
  for (let x = 480; x <= 600; x += 12) {
    box(.18, .9, .18, metal, x, 1, -484.4, false);
    box(.18, .9, .18, metal, x, 1, -475.6, false);
  }
  box(132, .14, .14, metal, 540, 1.42, -484.4, false);
  box(132, .14, .14, metal, 540, 1.42, -475.6, false);
  // The deck is open to foot traffic; collide only with its two guard rails.
  addC(540, -484.4, 66, .25);
  addC(540, -475.6, 66, .25);

  // West garden square: benches, warm path lights, and a small stone arch.
  box(38, .18, 38, std(0x657552, .95), -240, .14, -240, false);
  for (const x of [-252, -228]) for (const z of [-252, -228]) {
    mesh(new T.SphereGeometry(2.3, 9, 6), green, x, 2.6, z);
    mesh(new T.CylinderGeometry(.28, .36, 2.4, 7), std(0x624a37), x, 1.2, z);
  }
  for (const z of [-252, -240, -228]) {
    box(6, .35, .7, brick, -240, .8, z, false);
    box(6, .25, .25, pale, -240, 1.15, z, false);
  }
  for (const x of [-256, -224]) {
    box(.8, 4.6, .8, pale, x, 2.3, -240, false);
    mesh(new T.SphereGeometry(.42, 8, 6), std(0xffd27b, .4), x, 4.7, -240);
  }

  // A compact, repairable safe flat at the end of the campaign.
  box(14, 7, 10, brick, -560, 3.5, 612, false);
  const roofA = box(15, .5, 6, std(0x3a3e40, .75), -560, 7.05, 609.6, false); roofA.rotation.x = -.46;
  const roofB = box(15, .5, 6, std(0x3a3e40, .75), -560, 7.05, 614.4, false); roofB.rotation.x = .46;
  box(1.7, 3.3, .18, metal, -560, 1.7, 606.85, false);
  for (const x of [-565, -555]) box(2.8, 2, .18, glass, x, 4.2, 606.8, false);
  box(1.2, 3.3, 1.2, concrete, -565.4, 8.3, 615, false);
  box(8, .25, .2, pale, -560, 6.2, 606.75, false);
  addC(-560, 612, 7.2, 5.2);

  // Decorative rail line near the north market, with a platform and shelter.
  box(74, .22, 10, concrete, -660, .12, 510, false);
  for (const x of [-694, -686, -678, -670, -662, -654, -646, -638, -630, -622, -614, -606]) {
    box(.16, .12, 9, metal, x, .34, 510, false);
  }
  for (const x of [-680, -640]) {
    box(.25, 3.4, .25, metal, x, 1.7, 510, false);
    box(17, .22, 8, glass, x, 3.4, 510, false);
  }
}
