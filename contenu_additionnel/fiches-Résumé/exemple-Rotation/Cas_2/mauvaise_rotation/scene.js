"use strict";


main();

function main() {

    const sceneThreeJs = {
        sceneGraph: null,
        camera: null,
        renderer: null,
        controls: null
    };

    initEmptyScene(sceneThreeJs);
    init3DObjects(sceneThreeJs.sceneGraph);


    animationLoop(sceneThreeJs);
}

// Initialise les objets composant la scène 3D
function init3DObjects(sceneGraph) {


    const elementsToAdd = [];

    // Un plan en dessous des objets animés
    const Lp = 8;
    const planeGeometry = primitive.Quadrangle(Vector3(-Lp,-2,-Lp),Vector3(-Lp,-2,Lp),Vector3(Lp,-2,Lp),Vector3(Lp,-2,-Lp));
    const plane = new THREE.Mesh( planeGeometry,MaterialRGB(0.8,0.8,0.8) );
    plane.name = "plane";
    plane.receiveShadow = true;
    sceneGraph.add(plane);

    const bodyGeometry = new THREE.BoxGeometry(2, 5, 2);
    const body = new THREE.Mesh(bodyGeometry,MaterialRGB(0.2,0.6,0.8));
    body.position.set(-4, 0.5, 4);
    body.name = "body";
    body.castShadow = true;
    body.receiveShadow = true;
    sceneGraph.add(body);

    const sphereGeometry = primitive.Sphere(new THREE.Vector3(0,1, 1.25), 0.5);
    const sphere = new THREE.Mesh(sphereGeometry,MaterialRGB(0.3,0.3,0.3));
    sphere.name = "sphere";
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    body.add(sphere);

    const brasGeometry = primitive.Cylinder( Vector3(0,1,1.25), Vector3(0,4,1.25),0.2 );
    const bras = new THREE.Mesh( brasGeometry,MaterialRGB(0.9,0.5,0.9) );
    bras.name = "bras";
    bras.castShadow = true;
    bras.receiveShadow = true;
    sphere.add(bras);
}

// Demande le rendu de la scène 3D
function render( sceneThreeJs ) {
    sceneThreeJs.renderer.render(sceneThreeJs.sceneGraph, sceneThreeJs.camera);
}

function animate(sceneThreeJs, time) {

    const t = time/1000;//time in second
    const sphere = sceneThreeJs.sceneGraph.getObjectByName("sphere");

    // Rotation autour centre objet rattaché élément statique
    sphere.rotation.z -= 0.01;




    // Transformation du cylindre vert
    //const Tinv_green = new THREE.Matrix4().makeTranslation(-1,-1,-1);
    //const R_green = new THREE.Matrix4().makeRotationAxis(new Vector3(1,0,0), 0.01);
    //const T_green = new THREE.Matrix4().makeTranslation( 1, 1, 1);

    //const M_green = new THREE.Matrix4().multiply(T_green).multiply(R_green).multiply(Tinv_green);

    //cylinder.applyMatrix(M_green);


    // Transformation du cylindre rouge
    //const Tinv_red = new THREE.Matrix4().makeTranslation(-1,-3,-1);
    //const R_red = new THREE.Matrix4().makeRotationAxis(new Vector3(0,1,0), 0.2);
    //const T_red = new THREE.Matrix4().makeTranslation( 1, 3, 1);

    //const M_red = new THREE.Matrix4().multiply(T_red).multiply(R_red).multiply(Tinv_red);
    //cylinderSon.applyMatrix(M_red);




    render(sceneThreeJs);
}






// Fonction d'initialisation d'une scène 3D sans objets 3D
//  Création d'un graphe de scène et ajout d'une caméra et d'une lumière.
//  Création d'un moteur de rendu et ajout dans le document HTML
function initEmptyScene(sceneThreeJs) {

    sceneThreeJs.sceneGraph = new THREE.Scene();

    sceneThreeJs.camera = sceneInit.createCamera(-13,9,21);
    sceneInit.insertAmbientLight(sceneThreeJs.sceneGraph);
    sceneInit.insertLight(sceneThreeJs.sceneGraph,Vector3(-3,5,10));

    const spotLight2 = new THREE.SpotLight(0xffffff,0.4);
    spotLight2.position.copy(sceneThreeJs.camera.position);

    spotLight2.castShadow = true;
    spotLight2.shadow.mapSize.width = 2048;
    spotLight2.shadow.mapSize.height = 2048;

    sceneThreeJs.sceneGraph.add(spotLight2);


    sceneThreeJs.renderer = sceneInit.createRenderer();
    sceneInit.insertRenderInHtml(sceneThreeJs.renderer.domElement);

    sceneThreeJs.controls = new THREE.OrbitControls( sceneThreeJs.camera );

    window.addEventListener('resize', function(event){onResize(sceneThreeJs);} );
}

// Fonction de gestion d'animation
function animationLoop(sceneThreeJs) {

    // Fonction JavaScript de demande d'image courante à afficher
    requestAnimationFrame(

        // La fonction (dite de callback) recoit en paramètre le temps courant
        function(timeStamp){
            animate(sceneThreeJs,timeStamp); // appel de notre fonction d'animation
            animationLoop(sceneThreeJs); // relance une nouvelle demande de mise à jour
        }

     );

}

// Fonction appelée lors du redimensionnement de la fenetre
function onResize(sceneThreeJs) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneThreeJs.camera.aspect = width / height;
    sceneThreeJs.camera.updateProjectionMatrix();

    sceneThreeJs.renderer.setSize(width, height);
}

function Vector3(x,y,z) {
    return new THREE.Vector3(x,y,z);
}

function MaterialRGB(r,g,b) {
    const c = new THREE.Color(r,g,b);
    return new THREE.MeshLambertMaterial( {color:c} );
}
