HTML   JS  Result
Edit
(function() {
  //scene
  var scene = new THREE.Scene();
  //plane
  var pGeometory = new THREE.PlaneGeometry(1000, 1000);
  var pMaterial = new THREE.MeshPhongMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
  });
  var plane = new THREE.Mesh(pGeometory, pMaterial);
  plane.position.set(0, 0, 0); // rotate, scale
  plane.rotation.x = 90 * Math.PI / 180;
  plane.receiveShadow = true;
  scene.add(plane);
  //box
  var Geometory = new THREE.BoxGeometry(100, 100, 100);
  var Material = new THREE.MeshPhongMaterial({
    color: 0x999999,
    side: THREE.DoubleSide
  });
  var box = new THREE.Mesh(Geometory, Material);
  box.position.set(0, 50, 0); // rotate, scale
  box.castShadow = true;
  scene.add(box);
  //AmbLight Init
  ambientLight = new THREE.AmbientLight(0x6b6b6b);
  scene.add(ambientLight);
  //DirectionalLight&Helper Init
  dirLight = new THREE.DirectionalLight(0xeeeeee);
  dirLight.target = box;
  dirLight.position.set(-100, 300, 30);
  dirLight.castShadow = true;
  dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
  scene.add(dirLight);
  scene.add(dirLightHelper);
  //PointLight&Helper Init
  pointLight = new THREE.PointLight(0xeeeeee);
  pointLight.target = box;
  pointLight.position.set(300, 500, 300);
  pointLightHelper = new THREE.PointLightHelper(pointLight);
  scene.add(pointLight);
  scene.add(pointLightHelper);
  //SpotLight&Helper Init
  spotLight = new THREE.SpotLight(0xeeeeee);
  spotLight.position.set(100, 300, 30);
  spotLight.castShadow = true;
  spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLight);
  scene.add(spotLightHelper);

  //HemLight&Helper Init
  var hemLight = new THREE.HemisphereLight(0x800060, 0xf2d9f2, 1);
  hemLightHelper = new THREE.HemisphereLightHelper(hemLight, 50);
  hemLight.position.set(100, 300, 30);
  scene.add(hemLight);
  scene.add(hemLightHelper);
  console.log(hemLight);

  //camera
  var camera = new THREE.PerspectiveCamera(45, 16/9, 1, 2000);

  camera.position.set(200, 300, 500);
  //camera.lookAt(box.position);

  //helper
  var axis = new THREE.AxisHelper(1000);
  axis.position.set(0, 0, 0);
  scene.add(axis);

  guiControls = new function() {
    //AmbientLight
    this.ambColor = 0x000000;
    //DirectionalLight
    this.dirColor = 0xffffff;
    this.dirLightX = -100;
    this.dirLightY = 300;
    this.dirLightZ = 30;
    this.dirAngle = Math.PI / 3;
    this.dirIntensity = 1;
    this.dirCastShadow = true;
    this.dirShadowBias = 0;
    this.dirTarget = box;
    //PointLight
    this.pointColor = 0xffffff;
    this.pointLightX = -100;
    this.pointLightY = 300;
    this.pointLightZ = 30;
    this.pointIntensity = 1;
    this.pointDistance = 1000;
    this.pointDecay = 1;
    //SpotLight
    this.sptColor = 0xff0000;
    this.lightX = 100;
    this.lightY = 300;
    this.lightZ = 30;
    this.angle = Math.PI / 3;
    this.intensity = 1;
    this.distance = 1000;
    this.exponent = 10;
    this.decay = 1;
    this.castShadow = true;
    this.shadowBias = 0;
    //HemiSphereLight
    this.hemColor = 0xffffff;
    this.hemGColor = 0xffffff;
    this.hemLightX = 200;
    this.hemLightY = 300;
    this.hemLightZ = -30;
    this.hemIntensity = 1;

    //Box
    this.positionX = 0;
    this.positionY = 50;
    this.positionZ = 0;
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;

  }
  datGUI = new dat.GUI();
  //Ambient Light GUI
  ambFolder = datGUI.addFolder('AmbientLight');
  ambFolder.addColor(guiControls, 'ambColor');
  //Directional Light GUI
  dirFolder = datGUI.addFolder('DirectionalLight');
  dirFolder.addColor(guiControls, 'dirColor');
  dirFolder.add(guiControls, 'dirLightX', -1000, 1000);
  dirFolder.add(guiControls, 'dirLightY', 0, 1800);
  dirFolder.add(guiControls, 'dirLightZ', -1000, 1000);
  dirFolder.add(guiControls, 'dirAngle', 0, Math.PI / 2);
  dirFolder.add(guiControls, 'dirIntensity', 0, 2);
  dirFolder.add(guiControls, 'dirCastShadow');
  dirFolder.add(guiControls, 'dirShadowBias', 0, 1);
  //Point Light GUI
  poFolder = datGUI.addFolder('PointLight');
  poFolder.addColor(guiControls, 'pointColor');
  poFolder.add(guiControls, 'pointLightX', -1000, 1000);
  poFolder.add(guiControls, 'pointLightY', 0, 1800);
  poFolder.add(guiControls, 'pointLightZ', -1000, 1000);
  poFolder.add(guiControls, 'pointIntensity', 0, 2);
  poFolder.add(guiControls, 'pointDistance', 0, 1000);
  poFolder.add(guiControls, 'pointDecay', 0, 2);
  //Spot Light GUI
  spFolder = datGUI.addFolder('SpotLight');
  spFolder.addColor(guiControls, 'sptColor');
  spFolder.add(guiControls, 'lightX', -1000, 1000);
  spFolder.add(guiControls, 'lightY', 0, 1800);
  spFolder.add(guiControls, 'lightZ', -1000, 1000);
  spFolder.add(guiControls, 'angle', 0, Math.PI / 2);
  spFolder.add(guiControls, 'intensity', 0, 2);
  spFolder.add(guiControls, 'distance', 0, 1000);
  spFolder.add(guiControls, 'exponent', 0, 20);
  spFolder.add(guiControls, 'decay', 0, 2);
  spFolder.add(guiControls, 'castShadow');
  spFolder.add(guiControls, 'shadowBias', 0, 1);
  //Hemisphere Light Control
  hmFolder = datGUI.addFolder('HemLight');
  hmFolder.addColor(guiControls, 'hemColor');
  hmFolder.addColor(guiControls, 'hemGColor');
  hmFolder.add(guiControls, 'hemLightX', -300, 300);
  hmFolder.add(guiControls, 'hemLightY', 0, 1800);
  hmFolder.add(guiControls, 'hemLightZ', -300, 300);
  hmFolder.add(guiControls, 'hemIntensity', 0, 2);

  //Box Control
  boxFolder = datGUI.addFolder('Box');
  boxFolder.add(guiControls, 'positionX', -300, 300);
  boxFolder.add(guiControls, 'positionY', -300, 300);
  boxFolder.add(guiControls, 'positionZ', -300, 300);
  boxFolder.add(guiControls, 'rotationX', 0, 8);
  boxFolder.add(guiControls, 'rotationY', 0, 8);
  boxFolder.add(guiControls, 'rotationZ', 0, 8);
  datGUI.close();
  //rendering
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x888888, 1);
  renderer.shadowMap.enabled = true;
  document.getElementById('scene').appendChild(renderer.domElement);
  //Control
  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  console.log(guiControls.hemLightX);

  render();

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    //GUI Light CONTROLS
    //Ambient
    ambientLight.color.setHex(guiControls.ambColor);
    //Directional
    dirLight.color.setHex(guiControls.dirColor);
    dirLight.position.x = guiControls.dirLightX;
    dirLight.position.y = guiControls.dirLightY;
    dirLight.position.z = guiControls.dirLightZ;
    dirLight.angle = guiControls.dirAngle;
    dirLight.intensity = guiControls.dirIntensity;
    dirLight.castShadow = guiControls.dirCastShadow;
    dirLight.shadowBias = guiControls.dirShadowBias;
    //Point
    pointLight.color.setHex(guiControls.pointColor);
    pointLight.position.x = guiControls.pointLightX;
    pointLight.position.y = guiControls.pointLightY;
    pointLight.position.z = guiControls.pointLightZ;
    pointLight.intensity = guiControls.pointIntensity;
    pointLight.distance = guiControls.pointDistance;
    pointLight.decay = guiControls.pointDecay;
    //Spot
    spotLight.color.setHex(guiControls.sptColor);
    spotLight.position.x = guiControls.lightX;
    spotLight.position.y = guiControls.lightY;
    spotLight.position.z = guiControls.lightZ;
    spotLight.angle = guiControls.angle;
    spotLight.intensity = guiControls.intensity;
    spotLight.distance = guiControls.distance;
    spotLight.exponent = guiControls.exponent;
    spotLight.decay = guiControls.decay;
    spotLight.castShadow = guiControls.castShadow;
    spotLight.shadowBias = guiControls.shadowBias;
    //Hemisphere
    hemLight.color.setHex(guiControls.hemColor);
    hemLight.groundColor.setHex(guiControls.hemGColor);
    hemLight.position.x = guiControls.hemLightX;
    hemLight.position.y = guiControls.hemLightY;
    hemLight.position.z = guiControls.hemLightZ;
    hemLight.intensity = guiControls.hemIntensity;

    //GUI Obj CONTROLS
    box.rotation.x = guiControls.rotationX;
    box.rotation.y = guiControls.rotationY;
    box.rotation.z = guiControls.rotationZ;
    box.position.x = guiControls.positionX;
    box.position.y = guiControls.positionY;
    box.position.z = guiControls.positionZ;
    dirLightHelper.update();
    pointLightHelper.update();
    spotLightHelper.update();

    hemLightHelper.update();

  }

})();
