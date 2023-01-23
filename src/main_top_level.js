import * as THREE from '../node_modules/three/src/Three.js';
import WebGL from './webGLCheck.js';

var scene, renderer, camera;

function setup() 
{
    /* 
     * create the physical scene
     * all children are appended to the scene tree
     */
    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(1000));

    /* setup renderer for the scene */
    renderer = new THREE.WebGLRenderer({depth:true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x555555);
    document.body.appendChild( renderer.domElement );

    /* creates new camera / sets position / sets looking angle */
    camera = new THREE.PerspectiveCamera( 
        60, /* fov */
        window.innerWidth / window.innerHeight, /* aspect ratio */ 
        0.1, 
        5000 
    );
    camera.position.set( 50, 50, 200 );
    camera.lookAt( 0, 0, 0 );
}

function animate() 
{
    requestAnimationFrame( animate );

    renderer.render( scene, camera );
}

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render(scene, camera);
}

document.getElementById("click-me").addEventListener("click", (e) =>
{
    document.getElementById("directory-ui").style.display = "none";
    document.getElementById("about-me-ui").style.display = "inline-block";
});

document.getElementById("return-card").addEventListener("click", (e) =>
{
    document.getElementById("directory-ui").style.display = "inline-block";
    document.getElementById("about-me-ui").style.display = "none";
});

if ( WebGL.isWebGLAvailable() ) 
{
    // Initiate function or other initializations here
    setup();
    animate();
} 
else 
{
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById( 'container' ).appendChild( warning );
}