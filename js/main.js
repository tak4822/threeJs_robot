var container, stats;
var camera, scene, renderer, controls,light1, light2, light3, light4, guiControls, datGUI;
var directionalLight, lightSpot, lightSpot2, lightPoint;

// MOUSE CONTROLS
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock();

init();
animate();
function init() {
	container = document.getElementById( 'container' );
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 200000 );
	camera.position.set( -500, 150 ,-200 );
	scene = new THREE.Scene();

	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};
	var texture = new THREE.Texture();

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	}

	var onError = function ( xhr ) {
		console.log(xhr.error);
	};

	//Loading background
	const PATH = 'envMap/uni/';
	const FORMAT = '.png';
	let urls = [
	  PATH + 'right' + FORMAT, PATH + 'left' + FORMAT,
	  PATH + 'top' + FORMAT, PATH + 'bottom' + FORMAT,
	  PATH + 'front' + FORMAT, PATH + 'back' + FORMAT,
	];

	let cubeTextureLoader = new THREE.CubeTextureLoader();
	cubeTextureLoader.load(urls, function (cubeTexture) {

	  let shader = THREE.ShaderLib['cube'];

	  shader.uniforms['tCube'].value = cubeTexture;

	  let material = new THREE.ShaderMaterial({
	    fragmentShader: shader.fragmentShader,
	    vertexShader: shader.vertexShader,
	    uniforms: shader.uniforms,
	    depthWrite: false,
	    side: THREE.BackSide
	  });

	  let universe = new THREE.Mesh(new THREE.BoxGeometry(200000, 200000, 200000), material);
	  scene.add(universe);


		//Loading object
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath( './models/' );
		mtlLoader.load( 'robot.mtl', function( materials ) {

			materials.preload();

			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials( materials );
			objLoader.setPath( './models/' );
			objLoader.load( 'robot.obj', function ( object ) {

				object.rotation.y = 55;
				object.scale.set(30, 30, 30);
				scene.add( object );

			}, onProgress, onError );

		});
	});


	//LIGHTING
	//Directional Light
	directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
	directionalLight.position.set(-200, 0, 0 ).normalize();
	scene.add( directionalLight );

	//SpotLight
	lightSpot = new THREE.SpotLight(0xffffff, 5, 3000);
	lightSpot.position.y = -700;
	scene.add(lightSpot);

	lightSpot2 = new THREE.SpotLight(0xffffff, 2, 3000);
	lightSpot2.position.z = 300;
	lightSpot2.position.x = 700;
	scene.add(lightSpot2);


	//PointLight
	var sphere = new THREE.SphereGeometry( 3, 16, 8 );
	lightPoint1 = new THREE.PointLight( 0xff0040, 2, 50 );
	lightPoint1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
	scene.add( lightPoint1 );
	lightPoint2 = new THREE.PointLight( 0x0040ff, 2, 50 );
	lightPoint2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
	scene.add( lightPoint2 );
	lightPoint3 = new THREE.PointLight( 0x80ff80, 2, 50 );
	lightPoint3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
	scene.add( lightPoint3 );
	lightPoint4 = new THREE.PointLight( 0xffaa00, 2, 50 );
	lightPoint4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
	scene.add( lightPoint4 );

	//renderign
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xffffff);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	//Orbit controller
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	stats = new Stats();
	container.appendChild( stats.dom );
	//Event for resizing
	window.addEventListener( 'resize', onWindowResize, false );



	guiControls = new function() {
		//mouse mouseove
		this.MouseMove = false;
		this.StopAnimation = false;
		this.ChangePosition = {
			front: false,
			back: false
		};
		//DirectionalLight
		this.DirIntensity = 0;
		this.DirectionalLightOn = true;
		//PointLight
		this.PointIntensity = 20;
		this.PointDistance = 0.8;
		this.PointLightOn = true

		//SpotLight
		this.SpotIntensity = 5;
		this.SpotLightOn = true;
	}

	var ChangePosition = {
		front:goFront,
		back: goBack
	};


	//dat GUI
	datGUI = new dat.GUI();
	datGUI.add(guiControls, 'MouseMove');
	datGUI.add(guiControls, 'StopAnimation');
	datGUI.add(ChangePosition, 'front');
	datGUI.add(ChangePosition, 'back');


	dirFolder = datGUI.addFolder('DirectionalLight');
	dirFolder.add(guiControls, 'DirectionalLightOn');
	dirFolder.add(guiControls, 'DirIntensity', 0, 2);
	poFolder = datGUI.addFolder('PointLight');
	poFolder.add(guiControls, 'PointLightOn', 0, 50);
	poFolder.add(guiControls, 'PointIntensity', 0, 50);
	poFolder.add(guiControls, 'PointDistance', 0, 20);

	spFolder = datGUI.addFolder('SpotLight');
	spFolder.add(guiControls, 'SpotLightOn');
	spFolder.add(guiControls, 'SpotIntensity', 0, 10);
}

function goFront(){
	guiControls.StopAnimation = true;
	document.getElementsByClassName('c')[1].getElementsByTagName("input")[0].checked = true;
	new TWEEN.Tween(camera.position)
    .to({x:-300,y:100,z:50}, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function() {
      camera.lookAt( scene.position );
    })
    .start();
}
function goBack(){
	guiControls.StopAnimation = true;
	document.getElementsByClassName('c')[1].getElementsByTagName("input")[0].checked = true;
	new TWEEN.Tween(camera.position)
    .to({x:300,y:100,z:50}, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function() {
      camera.lookAt( scene.position );
    })
    .start();
}

//MOUSE CONTROLS
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
//MOUSE CONTROLS
function onDocumentMouseMove(event) {
	mouseX = ( event.clientX - windowHalfX ) * 5;
	mouseY = ( event.clientY - windowHalfY ) * 5;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate(time) {
	requestAnimationFrame( animate );
	render();
	stats.update();
	TWEEN.update(time);
}


var angle = 800;
var radius = 300;

function render() {
	// MOUSE CONTROLS
	if(guiControls.MouseMove && !guiControls.StopAnimation){
		camera.position.x += ( mouseX - camera.position.x ) * .01;
		camera.position.y += ( - mouseY - camera.position.y ) * .01;
	} else if (!guiControls.MouseMove && !guiControls.StopAnimation) {
		camera.position.x = radius * Math.cos( angle );
		camera.position.z = radius * Math.sin( angle );
		angle += 0.005;
	}
	camera.lookAt( scene.position );

	//GUI Light CONTROLS
	//Directional
	directionalLight.intensity = guiControls.DirIntensity;
	//PointLight
	lightPoint1.intensity = guiControls.PointIntensity;
	lightPoint2.intensity = guiControls.PointIntensity;
	lightPoint3.intensity = guiControls.PointIntensity;
	lightPoint4.intensity = guiControls.PointIntensity;

	//SpotLight
	lightSpot.intensity = guiControls.SpotIntensity;
	lightSpot2.intensity = guiControls.SpotIntensity;


	var time = Date.now() * 0.0005;
	var delta = clock.getDelta();

	lightPoint1.position.x = Math.sin( time * 1.7 ) * 60 * guiControls.PointDistance;
	lightPoint1.position.y = Math.cos( time * 1.5 ) * 80 * guiControls.PointDistance;
	lightPoint1.position.z = Math.cos( time * 1.3 ) * 60 * guiControls.PointDistance;
	lightPoint2.position.x = Math.cos( time * 1.3 ) * 60 * guiControls.PointDistance;
	lightPoint2.position.y = Math.sin( time * 1.5 ) * 80 * guiControls.PointDistance;
	lightPoint2.position.z = Math.sin( time * 1.7 ) * 60 * guiControls.PointDistance;
	lightPoint3.position.x = Math.sin( time * 1.7 ) * 60 * guiControls.PointDistance;
	lightPoint3.position.y = Math.cos( time * 1.3 ) * 80 * guiControls.PointDistance;
	lightPoint3.position.z = Math.sin( time * 1.5 ) * 60 * guiControls.PointDistance;
	lightPoint4.position.x = Math.sin( time * 1.3 ) * 60 * guiControls.PointDistance;
	lightPoint4.position.y = Math.cos( time * 1.7 ) * 80 * guiControls.PointDistance;
	lightPoint4.position.z = Math.sin( time * 1.5 ) * 60 * guiControls.PointDistance;

	if(guiControls.DirectionalLightOn){
		scene.add(directionalLight);
	}else{
		scene.remove(directionalLight);
	}
	if(guiControls.PointLightOn){
		scene.add(lightPoint1);
		scene.add(lightPoint2);
		scene.add(lightPoint3);
		scene.add(lightPoint4);
	}else{
		scene.remove(lightPoint1);
		scene.remove(lightPoint2);
		scene.remove(lightPoint3);
		scene.remove(lightPoint4);
	}
	if(guiControls.SpotLightOn){
		scene.add(lightSpot);
		scene.add(lightSpot2);
	}else{
		scene.remove(lightSpot);
		scene.remove(lightSpot2);
	}


	renderer.render( scene, camera );
}
