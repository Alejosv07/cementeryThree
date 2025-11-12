import * as THREE from "three";

((d, w) => {
  //Scene
  const scene = new THREE.Scene();

  //Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    w.innerWidth / innerHeight,
    1,
    100
  );
  camera.position.z = 5;

  scene.add(camera);

  //Canvas
  const canvas = document.querySelector("canvas.webgl");

  //Render
  const render = new THREE.WebGLRenderer({ antialias: true, canvas });
  render.setSize(innerWidth, innerHeight);

  //Resize
  w.addEventListener("resize", () => {
    camera.aspect = w.innerWidth / w.innerHeight;
    camera.updateProjectionMatrix();
    render.setSize(innerWidth, innerHeight);
  });

  const tick = () => {
    render.render(scene, camera);

    w.requestAnimationFrame(tick);
  };

  tick();
})(document, window);
