import * as THREE from './node_modules/three/src/Three.js';
import WebGL from './webGLCheck.js';

var scene, renderer, camera;

/*
    Next set of variables is for each year's projects
*/

var moving = false;

var start_position = new THREE.Vector3(50, 50, 50);
var end_position = new THREE.Vector3();

var start_look_at = new THREE.Vector3(0, 0, 0);
var end_look_at = new THREE.Vector3();

var perc = 0;
var perc_inc = 0.01;

var ui_id = "directory-ui";
var previous_id = "directory-ui";

var scenes = {
    "directory-ui": {
        objects: [],
        end_pos: new THREE.Vector3(50, 50, 50),
        end_look: new THREE.Vector3(0,0,0)
    },
    "ui-2022": {
        objects: [],
        end_pos: new THREE.Vector3(0, 100, 0),
        end_look: new THREE.Vector3(-30, 100, 0)
    },
    "ui-2023": {
        objects: [],
        end_pos: new THREE.Vector3(0, 100, 0),
        end_look: new THREE.Vector3(0, 100, -30)
    },
}

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

    const light = new THREE.AmbientLight( 0xffffff, 1, 100 );
    light.position.set( 0,100,0 );
    scene.add( light );

    /* change this when done doing navigation things */
    var box = new THREE.BoxBufferGeometry(
        1,
        1,
        1
    );

    var mat1 = new THREE.MeshPhongMaterial(
        {
            color: 0xff0000
        }
    )

    var mat2 = new THREE.MeshPhongMaterial(
        {
            color: 0x00ff00
        }
    )

    var radius = 30;
    for (let i = 0; i < 10; i++)
    {
        var angle = i * Math.PI*2 / 10;
        var angle2 = (i+0.5) * Math.PI*2/10;
        var newPos1 = new THREE.Vector3(Math.cos(angle)*radius-60, 100, Math.sin(angle)*radius);
        var newPos2 = new THREE.Vector3(Math.cos(angle2)*radius, 100, Math.sin(angle2)*radius-60);
        var cube1 = new THREE.Mesh(box, mat1);
        var cube2 = new THREE.Mesh(box, mat2);
        cube1.position.set(newPos1.x, newPos1.y, newPos1.z);
        cube2.position.set(newPos2.x, newPos2.y, newPos2.z);
        scenes["ui-2022"].objects.push(cube1);
        scenes["ui-2023"].objects.push(cube2);
    }
}

var targetQuaternion;
var startQuaternion;
function load_current(new_id)
{
    document.getElementById(ui_id).style.display = "none";
    
    previous_id = ui_id;
    ui_id = new_id;

    moving = true;

    var e_pos = scenes[ui_id].end_pos;
    var e_look = scenes[ui_id].end_look;

    end_position.set(e_pos.x, e_pos.y, e_pos.z);
    end_look_at.set(e_look.x, e_look.y, e_look.z);

    var curr_objects = scenes[ui_id].objects;
    for (let i = 0; i < curr_objects.length; i++)
    {
        scene.add(curr_objects[i]);
    }

    var cameraRotation = camera.rotation.clone();               // camera original rotation
    var cameraQuaternion = camera.quaternion.clone();           // camera original quaternion

    var dummyObject = camera.clone();  

    // set dummyObject's position, rotation and quaternion the same as the camera
    dummyObject.position.set(end_position.x, end_position.y, end_position.z);
    dummyObject.rotation.set(cameraRotation.x, cameraRotation.y, cameraRotation.z);
    dummyObject.quaternion.set(cameraQuaternion.x, cameraQuaternion.y, cameraQuaternion.z);

    dummyObject.lookAt(end_look_at.x, end_look_at.y, end_look_at.z);

    // store its quaternion in a variable
    targetQuaternion = dummyObject.quaternion.clone();
    startQuaternion = cameraQuaternion;
}

function destruct_previous()
{
    var curr_scene = scenes[previous_id].objects;
    for (let i = 0; i < curr_scene.length; i++)
    {
        scene.remove(curr_scene[i]);
    }
}

function update_camera_pos(dt)
{
    if (moving)
    {
        perc += perc_inc;
        camera.position.lerpVectors(start_position, end_position, perc);

        camera.quaternion.slerpQuaternions(startQuaternion, targetQuaternion, perc);
            
        if (Math.abs(camera.position.distanceTo(end_position)) < 1e-10)
        {
            moving = false;
            document.getElementById(ui_id).style.display = "inline-block";

            start_position.set(end_position.x, end_position.y, end_position.z);
            start_look_at.set(end_look_at.x, end_look_at.y, end_look_at.z);

            destruct_previous();

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
    previous_id = ui_id;
    ui_id = "about-me-ui";
    document.getElementById("directory-ui").style.display = "none";
    document.getElementById(ui_id).style.display = "inline-block";
});

document.getElementById("return-card").addEventListener("click", (e) =>
{
    document.getElementById(ui_id).style.display = "none";
    document.getElementById("directory-ui").style.display = "inline-block";
    previous_id = ui_id;
    ui_id = "directory-ui";
});

/* sets up the objects and positions for the 2022 list */
document.getElementById("card-2022").addEventListener("click", (e) =>
{
    load_current("ui-2022");
});

/* sets up the objects and positions for the 2023 list */
document.getElementById("card-2023").addEventListener("click", (e) =>
{
    load_current("ui-2023");
});

/* sets up objects and positions for directory list */
document.getElementById("return-card-2022").addEventListener("click", (e) =>
{
    load_current("directory-ui");
});

/* sets up objects and positions for directory list */
document.getElementById("return-card-2023").addEventListener("click", (e) =>
{
    load_current("directory-ui");
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