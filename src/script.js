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
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

// Create the mesh with the array of materials
const mesh = new THREE.Mesh(geometry, materials)
scene.add(mesh)

const sizes = {
    width: 800,
    height: 600
}   

// Camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

camera.position.z = 3
scene.add(camera)

// Renderer

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Controls

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Animation Loop

const animate = () => {
    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)
}

animate()
