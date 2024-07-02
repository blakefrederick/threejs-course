import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

const canvas = document.querySelector('canvas.webgl')

// Create a scene
const scene = new THREE.Scene()

// Geometry
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

// Textures
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => {
    console.log('onStart loading texture start')
}
loadingManager.onProgress = () => {
    console.log('onProgress loading texture progress')
}
loadingManager.onError = () => {
    console.log('onError loading texture error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const cardboardTexture = textureLoader.load('cardboard.jpg', 
    () => {
        console.log('loading texture start')
    },
    () => {
        console.log('loading texture progress')
    },
    () => {
        console.log('loading texture error')
    }
)

const baseballTexture = textureLoader.load('baseball.jpg', 
    () => {
        console.log('loading baseballTexture texture start')
    },
    () => {
        console.log('loading baseballTexture texture progress')
    },
    () => {
        console.log('loading baseballTexture texture error')
    }
)

// Box - Cardboard texture applied
const boxMaterial = new THREE.MeshBasicMaterial({ map: cardboardTexture })
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(boxMesh)

// Sphere - Baseball texture applied
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMaterial = new THREE.MeshBasicMaterial({ map: baseballTexture })
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)

sphereMesh.position.set(-2, 1, 0)
scene.add(sphereMesh)

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
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true }) // alpha for transparent background
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

// window.addEventListener('dblclick', () => {
//     const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

//     if (!fullscreenElement) {
//         if (canvas.requestFullscreen) {
//             canvas.requestFullscreen()
//         } else if (canvas.webkitRequestFullscreen) {
//             canvas.webkitRequestFullscreen()
//         }
//     } else {
//         if (document.exitFullscreen) {
//             document.exitFullscreen()
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen()
//         }
//     }
// })

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Animation Loop
const animate = () => {
    requestAnimationFrame(animate)

    controls.update()

    boxMesh.rotation.x += 0.001
    boxMesh.rotation.y += 0.002
    boxMesh.rotation.z += 0.003

    renderer.render(scene, camera)
}

animate()


// Debug

const gui = new dat.GUI()
gui.add(boxMesh.position, 'x').min(-3).max(3).step(0.01).name('x position')
gui.add(boxMesh.position, 'y').min(-3).max(3).step(0.01).name('y position')
gui.add(boxMesh.position, 'z').min(-3).max(3).step(0.01).name('z position')
gui.add(boxMesh.rotation, 'x').min(-3).max(3).step(0.01).name('x rotation')
gui.add(boxMesh.rotation, 'y').min(-3).max(3).step(0.01).name('y rotation')
gui.add(boxMesh.rotation, 'z').min(-3).max(3).step(0.01).name('z rotation')
gui.add(boxMesh.scale, 'x').min(0).max(3).step(0.01).name('x scale')
gui.add(boxMesh.scale, 'y').min(0).max(3).step(0.01).name('y scale')
gui.add(boxMesh.scale, 'z').min(0).max(3).step(0.01).name('z scale')

const parameter = {
    color: '#000080',
    spinBox: () => {
        gsap.to(boxMesh.rotation, { duration: 1, y: boxMesh.rotation.y + Math.PI * 2 })
    },
    spinSphere: () => {
        gsap.to(sphereMesh.rotation, { duration: 2, y: sphereMesh.rotation.y + Math.PI * 8, x: sphereMesh.rotation.x + Math.PI / 1.1 })
    },
    flyAwaySphere: () => {
        gsap.to(sphereMesh.position, { duration: 3, z: sphereMesh.position.z - 200 })
    },
    flyAwayBox: () => {
        gsap.to(boxMesh.position, { duration: 3, z: boxMesh.position.z - 200 })
    },
    comeBack: () => {
        gsap.to(boxMesh.position, { duration: 3, z: 0 }),
        gsap.to(sphereMesh.position, { duration: 3, z: 0 })
    }
}

gui.addColor(parameter, 'color').onChange(() => {
    boxMaterial.color.set(parameter.color)
})
gui.add(parameter, 'flyAwaySphere')
gui.add(parameter, 'flyAwayBox')
gui.add(parameter, 'comeBack')
gui.add(parameter, 'spinBox')
gui.add(parameter, 'spinSphere')