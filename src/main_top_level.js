import * as THREE from './node_modules/three/src/Three.js';
import { QuadraticBezierCurve } from './node_modules/three/src/Three.js';
import WebGL from './webGLCheck.js';

var scene, renderer, camera;

/*
    Next set of variables is for each year's projects
*/

var moving = false;
var reached_destination = false;

var start_position = new THREE.Vector3(50, 50, 200);
var end_position = new THREE.Vector3();

var start_look_at = new THREE.Vector3(0, 0, 0);
var end_look_at = new THREE.Vector3();
var new_look_at = new THREE.Vector3();

var perc = 0;
var perc_inc = 0.005;

var ui_id = "";

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

    camera.position.set(start_position.x, start_position.y, start_position.z);
    camera.lookAt( start_look_at );
}

function setup_2020()
{
    moving = true;
    end_position.set(10, 100, 10);
    end_look_at.set(0, 100, 0)

    ui_id = "ui-2020";

    /* change this when done doing navigation things */
    var box = new THREE.BoxBufferGeometry(
        1,
        1,
        1
    );

    var mat = new THREE.MeshBasicMaterial(
        {
            color: 0xffffff
        }
    )

    var cube = new THREE.Mesh(box, mat);
    cube.position.set(end_look_at.x, end_look_at.y, end_look_at.z);
    scene.add(cube);
}

function destruct_2020()
{

}

function update_camera_pos(dt)
{
    if (moving)
    {
        perc += perc_inc;
        camera.position.lerpVectors(start_position, end_position, perc);

        new_look_at.lerpVectors(start_look_at, end_look_at, perc);
        camera.lookAt(new_look_at);
            
        if (Math.abs(camera.position.distanceTo(end_position)) < 1e-10)
        {
            moving = false;
            document.getElementById(ui_id).style.display = "inline-block";
            perc = 0;
        }
    }
}

function animate() 
{
    requestAnimationFrame( animate );

    var now = new Date();
    var dt = (now - prevTime) / 1000;
    prevTime = now;

    update_camera_pos(dt);

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

document.getElementById("about-me-card").addEventListener("click", (e) =>
{
    document.getElementById("directory-ui").style.display = "none";
    document.getElementById("about-me-ui").style.display = "inline-block";
});

document.getElementById("return-card").addEventListener("click", (e) =>
{
    document.getElementById("directory-ui").style.display = "inline-block";
    document.getElementById("about-me-ui").style.display = "none";
});

document.getElementById("card-2020").addEventListener("click", (e) =>
{
    document.getElementById("directory-ui").style.display = "none";
    setup_2020();
});

document.getElementById("ui-2020-return").addEventListener("click", (e) =>
{
    document.getElementById("ui-2020").style.display = "none";
    document.getElementById("directory-ui").style.display = "inline-block";
});

document.getElementById("ui-2021-return").addEventListener("click", (e) =>
{
    document.getElementById("ui-2021").style.display = "none";
    document.getElementById("directory-ui").style.display = "inline-block";
});

document.getElementById("ui-2022-return").addEventListener("click", (e) =>
{
    document.getElementById("ui-2022").style.display = "none";
    document.getElementById("directory-ui").style.display = "inline-block";
});

document.getElementById("ui-2023-return").addEventListener("click", (e) =>
{
    document.getElementById("ui-2023").style.display = "none";
    document.getElementById("directory-ui").style.display = "inline-block";
});

if ( WebGL.isWebGLAvailable() ) 
{
    // Initiate function or other initializations here
    setup();
    var prevTime = new Date();
    animate();
} 
else 
{
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById( 'container' ).appendChild( warning );
}