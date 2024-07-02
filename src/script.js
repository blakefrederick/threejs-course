import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

const canvas = document.querySelector('canvas.webgl')

// Create a scene
const scene = new THREE.Scene()

// Geometry
const geometry = new THREE.BoxGeometry(1, 1, 1)

// Textures

const image = new Image()
const texture = new THREE.Texture(image)

image.onload = () => {
    texture.needsUpdate = true
}

image.src = 'cardboard.jpg'

const material = new THREE.MeshBasicMaterial({ map: texture })

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}   

// Camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 1
camera.position.y = 1
camera.position.x = 1
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

// Debug

const gui = new dat.GUI()
gui.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('x position')
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('y position')
gui.add(mesh.position, 'z').min(-3).max(3).step(0.01).name('z position')
gui.add(mesh.rotation, 'x').min(-3).max(3).step(0.01).name('x rotation')
gui.add(mesh.rotation, 'y').min(-3).max(3).step(0.01).name('y rotation')
gui.add(mesh.rotation, 'z').min(-3).max(3).step(0.01).name('z rotation')
gui.add(mesh.scale, 'x').min(0).max(3).step(0.01).name('x scale')
gui.add(mesh.scale, 'y').min(0).max(3).step(0.01).name('y scale')
gui.add(mesh.scale, 'z').min(0).max(3).step(0.01).name('z scale')

const parameter = {
    color: '#000080',
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
    }
}

gui.addColor(parameter, 'color').onChange(() => {
    material.color.set(parameter.color)
})
gui.add(parameter, 'spin')