import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

console.log(THREE)

const canvas = document.querySelector('canvas.webgl')

// Create a scene
const scene = new THREE.Scene()

// Custom geometry
const geometry = new THREE.BufferGeometry()

const count = 60
const positionsArray = new Float32Array(count * 3 * 3)

for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 4
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)

const material = new THREE.MeshBasicMaterial({ color: getRandomColor(), wireframe: true })

function getRandomColor() {
    // aesthetic colours only
    const colors = ['#000080', '#800000', '#008000', '#800080', '#008080', '#0000FF', '#8B0000', '#006400', '#8B008B', '#008B8B', '#8B4513', '#00008B', '#FF0000', '#00FF00', '#FF00FF', '#00FFFF', '#FFFF00', '#FF00FF', '#FF4500', '#FFD700', '#FF1493', '#FF69B4', '#FF8C00']
    return colors[Math.floor(Math.random() * colors.length)]
}

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}   

// Camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 0
camera.position.y = 1
camera.position.x = 0
scene.add(camera)

// Renderer

var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true }); // alpha for transparent background

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Event listeners 

window.addEventListener('resize', () => {

    // Update canvas size to fit the window
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
})

window.addEventListener('dblclick', () => {
    
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
})



// Controls

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Animation Loop

const animate = () => {
    requestAnimationFrame(animate)

    controls.update()

    mesh.rotation.x += 0.001
    mesh.rotation.y += 0.002
    mesh.rotation.z += 0.003

    renderer.render(scene, camera)
}

animate()
