// Lightweight, batched facade detail for the expanded procedural city.
// A handful of instanced draws adds depth without adding thousands of Mesh objects.
export function dressCity(T, scene, buildings) {
  const trim = new T.MeshStandardMaterial({ color: 0xc7bba8, roughness: 0.78 });
  const stone = new T.MeshStandardMaterial({ color: 0x77766f, roughness: 0.86 });
  const roof = new T.MeshStandardMaterial({ color: 0x53585b, roughness: 0.7, metalness: 0.28 });
  const glass = new T.MeshStandardMaterial({ color: 0x233845, roughness: 0.34, metalness: 0.36, emissive: 0x07131a });
  const awningMats = [0xc54e40, 0x287c82, 0x546c3d, 0x8b663b].map(color => new T.MeshStandardMaterial({ color, roughness: 0.72 }));
  const cornerGeo = new T.BoxGeometry(1, 1, 1);
  const ledgeGeo = new T.BoxGeometry(1, 1, 1);
  const equipmentGeo = new T.BoxGeometry(1, 1, 1);
  const shopGeo = new T.BoxGeometry(1, 1, 1);
  const dummy = new T.Object3D();
  const corners = [], ledges = [], equipment = [], shopWindows = [], awnings = [];

  for (const b of buildings) {
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      corners.push({ x: b.x + sx * (b.w / 2 - .2), y: b.h / 2, z: b.z + sz * (b.w / 2 - .2), sx: .32, sy: b.h, sz: .32, color: b.tint });
    }
    for (let y = 7; y < b.h - 2; y += b.h > 40 ? 11 : 13) {
      for (const side of [-1, 1]) {
        ledges.push({ x: b.x, y, z: b.z + side * (b.w / 2 + .02), sx: b.w + .18, sy: .16, sz: .2 });
        ledges.push({ x: b.x + side * (b.w / 2 + .02), y, z: b.z, sx: .2, sy: .16, sz: b.w + .18 });
      }
    }
    const rx = b.roofX, rz = b.roofZ, y = b.h + 1;
    equipment.push({ x: rx, y, z: rz, sx: 2.3, sy: 1.4, sz: 1.7 });
    equipment.push({ x: rx + 1.8, y: b.h + 1.7, z: rz - .5, sx: .22, sy: 2.8, sz: .22 });
    if (b.w > 12 && b.h > 11 && Math.random() < .22) {
      const face = b.side || 1;
      const frontZ = b.z + face * (b.w / 2 + .3);
      shopWindows.push({ x: b.x, y: 2.8, z: frontZ, sx: 6.2, sy: 2.1, sz: .16 });
      awnings.push({ x: b.x, y: 4.15, z: frontZ + face * .38, sx: 7.6, sy: .3, sz: 1.15, color: b.neon });
      shopWindows.push({ x: b.x - 4.1, y: 2.3, z: frontZ + face * .5, sx: 1.2, sy: 3.4, sz: .15 });
    }
  }

  function batch(records, geometry, material, colors = false) {
    if (!records.length) return;
    const mesh = new T.InstancedMesh(geometry, material, records.length);
    records.forEach((r, i) => {
      dummy.position.set(r.x, r.y, r.z);
      dummy.scale.set(r.sx, r.sy, r.sz);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (colors && r.color) mesh.setColorAt(i, new T.Color(r.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    scene.add(mesh);
  }

  batch(corners, cornerGeo, trim, true);
  batch(ledges, ledgeGeo, stone);
  batch(equipment, equipmentGeo, roof);
  batch(shopWindows, shopGeo, glass);
  for (let i = 0; i < awningMats.length; i++) batch(awnings.filter((_, n) => n % awningMats.length === i), shopGeo, awningMats[i]);
}
