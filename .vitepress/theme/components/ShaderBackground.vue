<template>
    <canvas ref="canvasRef" class="shader-bg"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const mouse = new THREE.Vector2()
let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera
let material: THREE.ShaderMaterial, mesh: THREE.Mesh
let animationId: number
let geometry: THREE.BufferGeometry

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`
const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

#define iTime uTime
#define iResolution uResolution
#define iMouse uMouse

vec3 palette( in float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.583);
    return a + b * cos( 6.28318 * (c * t + d) );
}

mat2 rot2D (float angle){
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

float smin(float a, float b, float k){
    float h = max(k - abs(a-b), 0.0)/k;
    return min(a, b) - h*h*h*k*(1.0/6.0);
}

float sdSphere(vec3 p, float s){
    return length(p) - s;
}

float sdBox(vec3 p, vec3 b){
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float map(vec3 p) {
    vec3 spherePos = vec3(sin(iTime) * 3., 0., 0.);
    float sphere = sdSphere(p - spherePos, 1.);

    vec3 q = p;
    q.y -= iTime * .4;
    q = fract(q) - 0.5;
    q.xy *= rot2D(iTime);

    float box = sdBox(q * 4., vec3(.75)) / 4.0;

    float ground = p.y + 0.75; 
    
    return smin(ground, smin(sphere, box, 2.0), 1.0);
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = (fragCoord * 2. - iResolution.xy) / min(iResolution.y, iResolution.x);
    vec2 m = (iMouse.xy * 2. - iResolution.xy) / min(iResolution.y, iResolution.x);

    vec3 ro = vec3(0, 0, -3);
    vec3 rd = normalize(vec3(uv, 1));

    ro.yz *= rot2D(-m.y);
    rd.yz *= rot2D(-m.y);
    ro.xz *= rot2D(-m.x);
    rd.xz *= rot2D(-m.x); 

    float t = 0.;
    int i;
    for(i = 0; i < 80; i++){
        vec3 p = ro + rd * t;
        float d = map(p);
        t += d;
        if(d < .001 || d > 100.) break;
    }
    
    vec3 col = palette(t * 0.1); 
    col *= exp(-0.05 * t); 
    
    gl_FragColor = vec4(col, 1.0) * 0.5;

}
`

onMounted(() => {
    if (!canvasRef.value) return

    renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true, alpha: true})
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    scene = new THREE.Scene()
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    geometry = new THREE.PlaneGeometry(2, 2)
    material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uResolution : { value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            uMouse: { value: mouse }
        }
    })
    
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    
    const tick = () => {
        material.uniforms.uTime.value += 0.01
        renderer.render(scene, camera)
        animationId = requestAnimationFrame(tick)
    }
    tick()

    window.addEventListener('resize', onResize)
})



const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
}

onUnmounted(() =>{
    window.removeEventListener('resize', onResize)
    cancelAnimationFrame(animationId)
    renderer.dispose()
    geometry.dispose()
    material.dispose()
})
</script>

<style scoped>
.shader-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    pointer-events: none;
}
</style>