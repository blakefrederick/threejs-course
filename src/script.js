import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

console.log(THREE)

const canvas = document.querySelector('canvas.webgl')

// Create a scene
const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const materials = []

// Generate a different colour for each face
for (let i = 0; i < 6; i++) {
    const material = new THREE.MeshBasicMaterial({ color: getRandomColor() })
    materials.push(material)
}

function getRandomColor() {
    // aesthetic colours only
    const colors = ['#000080', '#800000', '#008000', '#800080', '#008080', '#0000FF', '#8B0000', '#006400', '#8B008B', '#008B8B', '#8B4513', '#00008B', '#FF0000', '#00FF00', '#FF00FF', '#00FFFF', '#FFFF00', '#FF00FF', '#FF4500', '#FFD700', '#FF1493', '#FF69B4', '#FF8C00']
    return colors[Math.floor(Math.random() * colors.length)]
}

const mesh = new THREE.Mesh(geometry, materials)
scene.add(mesh)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}   

// Camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

camera.position.z = 3
camera.position.y = 1
camera.position.x = 1
scene.add(camera)

// Renderer

var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true }); // alpha for transparent background

renderer.setSize(sizes.width, sizes.height)

window.addEventListener('resize', () => {

    // Update canvas size to fit the window
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
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
