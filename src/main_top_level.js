import * as THREE from './node_modules/three/src/Three.js';
import WebGL from './webGLCheck.js';

var scene, renderer, camera;

/*
    Next set of variables is for each year's projects
*/
var at_2020_pos = false;
var moving_to_2020_pos = false;

var look_x_2020 = 0;
var look_y_2020 = 100;
var look_z_2020 = 0;

var pos_x_2020 = 10;
var pos_y_2020 = 100;
var pos_z_2020 = 10;

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

function update_camera_pos(dt)
{
    if (moving_to_2020_pos)
    {
        if (at_2020_pos) 
        {
            moving_to_2020_pos = false;
            at_2020_pos = false;
        }
        else
        {
            camera.position.x = pos_x_2020;
            camera.position.y = pos_y_2020;
            camera.position.z = pos_z_2020;
            camera.lookAt(
                look_x_2020,
                look_y_2020,
                look_z_2020
            );
            at_2020_pos = true;
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
    moving_to_2020_pos = true;
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