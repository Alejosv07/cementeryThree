import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Sky } from "three/addons/objects/Sky.js";

((d, w) => {
  //Canvas
  const canvas = document.querySelector("canvas.webgl");

  //Scene
  const scene = new THREE.Scene();

  //Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    w.innerWidth / innerHeight,
    0.1,
    100
  );

  camera.position.z = 6;
  camera.position.y = 1;
  camera.position.x = 3;

  scene.add(camera);

  //Lights
  const sunLight = new THREE.AmbientLight(0x403f50, 0.1);
  scene.add(sunLight);

  const pointLight = new THREE.PointLight("grey", 1, 2, 10);
  pointLight.position.y = 1;
  pointLight.position.z = 2.05;
  pointLight.position.x = 0.6;
  const pointLight2 = new THREE.PointLight("grey", 0.5, 1, 10);
  pointLight2.position.y = 1;
  pointLight2.position.z = 2.05;
  pointLight2.position.x = -0.6;

  scene.add(pointLight, pointLight2);

  const direcLight = new THREE.DirectionalLight(0xf2efe1, 0.8);
  direcLight.position.set(-5, 5, -5);
  direcLight.lookAt(0, 0, 0);
  direcLight.castShadow = true;
  direcLight.shadow.bias = 0.005;
  scene.add(direcLight);

  //Loader
  const textureLoader = new THREE.TextureLoader();

  //Floor
  const floorSizes = {
    w: 20,
    h: 20,
  };

  const alphaMapFloor = textureLoader.load(
    "texture/floor/black_gradient_radial.png"
  );
  const baseFloor = textureLoader.load(
    "texture/floor/aerial_rocks_04_diff_1k.jpg"
  );
  baseFloor.colorSpace = THREE.SRGBColorSpace;
  const armFloor = textureLoader.load(
    "texture/floor/aerial_rocks_04_arm_1k.jpg"
  );
  const normalFloor = textureLoader.load(
    "texture/floor/aerial_rocks_04_nor_gl_1k.jpg"
  );
  const displacementMapFloor = textureLoader.load(
    "texture/floor/aerial_rocks_04_disp_1k.jpg"
  );

  [baseFloor, armFloor, normalFloor, displacementMapFloor].forEach(
    (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(5, 10);
    }
  );

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(floorSizes.w, floorSizes.h, 100, 100),
    new THREE.MeshStandardMaterial({
      alphaMap: alphaMapFloor,
      alphaTest: 0.2,
      map: baseFloor,
      aoMap: armFloor,
      metalnessMap: armFloor,
      roughnessMap: armFloor,
      normalMap: normalFloor,
      displacementMap: displacementMapFloor,
      displacementScale: 0.3,
    })
  );

  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.3 / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  //Sky
  const sky = new Sky();
  sky.scale.setScalar(1000);
  scene.add(sky);
  sky.material.uniforms["turbidity"].value = 8;
  sky.material.uniforms["rayleigh"].value = 1;
  sky.material.uniforms["mieCoefficient"].value = 0.005;
  sky.material.uniforms["mieDirectionalG"].value = 0.7;
  sky.material.uniforms["sunPosition"].value.set(0.3, -0.08, -0.95);

  //graves
  const baseGrave = textureLoader.load(
    "texture/grave/rabdentse_ruins_wall_diff_1k.jpg"
  );
  baseGrave.colorSpace = THREE.SRGBColorSpace;
  const armGrave = textureLoader.load(
    "texture/grave/rabdentse_ruins_wall_arm_1k.jpg"
  );
  const normalGrave = textureLoader.load(
    "texture/grave/rabdentse_ruins_wall_nor_gl_1k.jpg"
  );
  const displacementMapGrave = textureLoader.load(
    "texture/grave/rabdentse_ruins_wall_disp_1k.jpg"
  );
  const graveGeometry = new THREE.BoxGeometry(0.5, 0.5, 1);
  const graveMaterial = new THREE.MeshStandardMaterial({
    map: baseGrave,
    aoMap: armGrave,
    metalnessMap: armGrave,
    roughnessMap: armGrave,
    normalMap: normalGrave,
  });
  const gravesGroup = new THREE.Group();

  const cruzGeometry = new THREE.BoxGeometry(0.1, 0.1, 1);
  const cruzRightGeometry = new THREE.BoxGeometry(0.05, 0.1, 1);
  const cruzMaterial = new THREE.MeshStandardMaterial({
    map: baseGrave,
    aoMap: armGrave,
    metalnessMap: armGrave,
    roughnessMap: armGrave,
    normalMap: normalGrave,
  });

  scene.add(gravesGroup);

  const createGraves = (quantity = 20) => {
    let randomX = 0;
    let randomZ = 0;

    for (let index = 0; index < quantity; index++) {
      let graveMesh = new THREE.Mesh(graveGeometry, graveMaterial);
      graveMesh.receiveShadow = true;
      graveMesh.castShadow = true;
      const graveGroup = new THREE.Group();
      graveMesh.rotation.x = Math.PI / 2;

      randomX = randomX =
        (Math.random() < 0.5 ? -1 : 1) * (Math.random() * (5 - 3) + 3);
      randomZ = randomZ =
        (Math.random() < 0.5 ? -1 : 1) * (Math.random() * (5 - 4) + 4);

      if (Math.round(Math.random())) {
        const cruzRight = new THREE.Mesh(cruzRightGeometry, cruzMaterial);
        const cruzUp = new THREE.Mesh(cruzGeometry, cruzMaterial);

        cruzUp.position.y = 0.8;
        cruzUp.rotation.x = Math.PI / 2;
        cruzRight.position.y = 0.8;
        cruzRight.scale.z = 0.5;
        cruzUp.scale.z = 0.68;
        graveGroup.add(graveMesh, cruzRight, cruzUp);
      } else {
        graveGroup.add(graveMesh);
      }

      graveGroup.position.x = randomX;
      graveGroup.position.z = randomZ;

      graveGroup.rotation.x = Math.random() - 0.1 - 0.05;
      graveGroup.rotation.y = 0.5;
      gravesGroup.add(graveGroup);
    }
  };

  createGraves();

  //Autor
  const autorCreate = (
    path = "fonts/helvetiker_regular.typeface.json",
    autor = "Alejandro Romero"
  ) => {
    const fontLoader = new FontLoader();
    fontLoader.load(path, (font) => {
      const geometry = new TextGeometry(autor, {
        font: font,
        size: 0.2,
        depth: 0.01,
        curveSegments: 1,
      });

      geometry.center();
      const materialFont = new THREE.MeshStandardMaterial({
        map: baseGrave,
        transparent: true,
        metalness: 0.2,
        roughness: 0.1,
        color: "#454B46",
      });
      const mesh = new THREE.Mesh(geometry, materialFont);

      mesh.position.y = 0.8;
      mesh.position.z = 2;
      scene.add(mesh);
    });
  };
  autorCreate();

  //House
  const createHouse = () => {
    const geometryHouse = new THREE.BoxGeometry(3, 1.6, 4);
    const materialHouse = new THREE.MeshStandardMaterial({
      map: baseGrave,
      aoMap: armGrave,
      metalnessMap: armGrave,
      roughnessMap: armGrave,
      normalMap: normalGrave,
    });
    const baseHouseMesh = new THREE.Mesh(geometryHouse, materialHouse);
    baseHouseMesh.position.y = 1;

    baseHouseMesh.castShadow = true;
    scene.add(baseHouseMesh);
  };
  createHouse();

  //Render
  const render = new THREE.WebGLRenderer({ antialias: true, canvas });
  render.setSize(innerWidth, innerHeight);
  render.setPixelRatio(Math.min(w.devicePixelRatio, 2));
  render.shadowMap.enabled = true;
  render.shadowMap.type = THREE.PCFShadowMap;
  
  //fog
  scene.fog = new THREE.FogExp2("#565450", 0.1);

  //Control
  const control = new OrbitControls(camera, canvas);
  control.enableDamping = true;

  //Resize
  w.addEventListener("resize", () => {
    camera.aspect = w.innerWidth / w.innerHeight;
    camera.updateProjectionMatrix();
    render.setSize(innerWidth, innerHeight);
    render.setPixelRatio(Math.min(w.devicePixelRatio, 2));
  });

  const tick = () => {
    render.render(scene, camera);
    control.update();
    w.requestAnimationFrame(tick);
  };

  tick();
})(document, window);
