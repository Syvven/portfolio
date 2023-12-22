import * as THREE from './node_modules/three/src/Three.js';
import {GLTFLoader} from './GLTFLoader.js';

var gltfLoader = null;
class Kiwi 
{
    constructor(init_scale)
    {
        this.loaded = false;
        this.y_offset = 7.5;
        this.init_scale = init_scale
    }

    async load_kiwi(trans, rot)
    {
        if (gltfLoader == null) gltfLoader = new GLTFLoader();
        var gltf = await gltfLoader.loadAsync('../models/kiwi.glb');
        this.obj = gltf.scene;

        this.obj.scale.set(this.init_scale, this.init_scale, this.init_scale);
        this.obj.traverse((o) => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
            }
        });

        this.mixer = new THREE.AnimationMixer(this.obj);
        this.mixer.clipAction(gltf.animations[0]).play();
        this.loaded = true;

        this.set_position(trans)
        this.rotate(rot)
    }

    set_position(x, y, z)
    {
        this.obj.position.x = x;
        this.obj.position.y = y;
        this.obj.position.z = z; 
    }

    set_position(vec)
    {
        this.obj.position.x = vec.x; 
        this.obj.position.y = vec.y;
        this.obj.position.z = vec.z; 
    }

    rotate(vec)
    {
        this.obj.rotation.x += vec.x;
        this.obj.rotation.y += vec.y;
        this.obj.rotation.z += vec.z;
    }
}

export default Kiwi