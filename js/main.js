"use babelify";

/*global THREE, T, window, document */
var THREE = require('three');

var RetroWipe = window.RetroWipe || {};


RetroWipe.init = function () {
    'use strict';

    // on initialise le moteur de rendu
    RetroWipe.renderer = new THREE.WebGLRenderer();

    // si WebGL ne fonctionne pas sur votre navigateur vous pouvez utiliser le moteur de rendu Canvas à la place
    // renderer = new THREE.CanvasRenderer();
    RetroWipe.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(RetroWipe.renderer.domElement);

    // on initialise la scène
    RetroWipe.scene = new THREE.Scene();

    // on initialise la camera que l’on place ensuite sur la scène
    RetroWipe.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    RetroWipe.camera.position.set(0, 0, 100);
    RetroWipe.scene.add(RetroWipe.camera);

    //control camera
    //RetroWipe.control = new OrbitControls(RetroWipe.camera, RetroWipe.renderer.domElement);

    // ligths
    var ambientLight = new THREE.AmbientLight(0x555555);
    RetroWipe.scene.add(ambientLight);

    // mesh loader
    RetroWipe.loader = new THREE.JSONLoader();
    //RetroWipe.loader.load( "data/ship01.js", RetroWipe.AddModelToScene, "data/ship01_layout_2_green.png");
    RetroWipe.loader.load( "data/jamjar.json", RetroWipe.AddModelToScene, "data/jamjar_layout.png");
};

RetroWipe.AddModelToScene = function (geometry) {
  'use strict';
  geometry.computeTangents();
  let material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( "data/jamjar_layout.png" )});
  material.map.magFilter = THREE.NearestFilter;
  material.map.minFilter = THREE.NearestFilter;
  RetroWipe.mesh = new THREE.Mesh(geometry, material);
  RetroWipe.mesh.position.x = RetroWipe.mesh.position.y = RetroWipe.mesh.position.z = 0;
  RetroWipe.mesh.rotation.x = RetroWipe.mesh.rotation.y = RetroWipe.mesh.rotation.z = 0;
  RetroWipe.mesh.scale.x = RetroWipe.mesh.scale.y = RetroWipe.mesh.scale.z = 20;
  RetroWipe.mesh.matrixAutoUpdate = false;
  RetroWipe.mesh.updateMatrix();
  RetroWipe.scene.add(RetroWipe.mesh);

  // launch music and animation
  // RetroWipe.music();
  RetroWipe.animate();
};

RetroWipe.animate = function () {
    'use strict';
    // on appel la fonction animate() récursivement à chaque frame
    window.requestAnimationFrame(RetroWipe.animate);
    // on fait tourner le cube sur ses axes x et y
    RetroWipe.mesh.rotation.y += 0.01;
    RetroWipe.mesh.updateMatrix();

    if(RetroWipe.control != null)
      RetroWipe.control.update();

    // on effectue le rendu de la scène
    RetroWipe.renderer.render(RetroWipe.scene, RetroWipe.camera);
};

RetroWipe.music = function () {
    // http://www.nullsleep.com/treasure/mck_guide/

    'use strict';
    //var mml1 = "l4 o5 [bagfedc<]2 o4[aa+bcc+dd+eff+gg+]4";
    var mml1 = "A [c d e f g4 a16 b16 >c c d e f g4 a16 b16 >c<<]2";
    mml1 += "C [c e g8 g8 a16 b16 >c8 c e g8 g8 a16 b16 >c8<<]4";
    var gen = new T("PluckGen", {env: {type: "perc", r: 500, lv: 0.4}}).play();
    var music_line = new T("mml", {mml: mml1}, gen).start();
};



/// onLoad
window.addEventListener("load", RetroWipe.init);
