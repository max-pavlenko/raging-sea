import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const gui = new dat.GUI({ width: 340 })
const debugObject = {
    depthColor: '#dbba00',
    surfaceColor: '#0056B9',
}

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const waterGeometry = new THREE.PlaneGeometry(3, 2, 512, 512)

const waterMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uElevation: { value: 0.2 },
        uFrequency: { value: new THREE.Vector2(4, 2) },
        uTime: { value: 0 },
        uSpeed: { value: 1.2 },
        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uWavesMultiplier: { value: 4.0 },
        uWavesNoiseHeight: { value: .145  },
    }
})

gui.add(waterMaterial.uniforms.uElevation, 'value').min(0).max(1).step(0.001).name('Elevation')
gui.add(waterMaterial.uniforms.uSpeed, 'value').min(.5).max(5).step(0.001).name('Speed')
gui.add(waterMaterial.uniforms.uFrequency.value, 'x').min(0).max(10).step(0.001).name('Frequency X')
gui.add(waterMaterial.uniforms.uFrequency.value, 'y').min(0).max(10).step(0.001).name('Frequency Y')
gui.add(waterMaterial.uniforms.uWavesMultiplier, 'value').min(0).max(10).step(0.001).name('Waves Noise')
gui.add(waterMaterial.uniforms.uWavesNoiseHeight, 'value').min(0).max(1).step(0.001).name('Waves Noise Height')
gui.addColor(debugObject, 'depthColor').onFinishChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
});
gui.addColor(debugObject, 'surfaceColor').onFinishChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
});

const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 2.5, 1)
camera.lookAt(water.position)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    waterMaterial.uniforms.uTime.value = elapsedTime
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
