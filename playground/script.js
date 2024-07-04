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

// Keyboard controls
const keyboard = {}
window.addEventListener('keydown', (event) => {
    keyboard[event.key] = true
})
window.addEventListener('keyup', (event) => {
    keyboard[event.key] = false
})

// Event listeners for control buttons
const controlButtons = document.querySelectorAll('.control-button')

controlButtons.forEach(button => {
    let intervalId
    const direction = button.classList[1]
    const handleButtonPress = () => {
        moveCamera(direction)
        intervalId = setInterval(() => {
            moveCamera(direction)
        }, 10)
    }
    const handleButtonRelease = () => {
        clearInterval(intervalId)
    }
    button.addEventListener('mousedown', handleButtonPress)
    button.addEventListener('mouseup', handleButtonRelease)
    button.addEventListener('touchstart', handleButtonPress)
    button.addEventListener('touchend', handleButtonRelease)
})

const moveCamera = (direction) => {
    const moveFactor = 7.77
    switch (direction) {
        case 'up':
            camera.position.z -= 0.01 * moveFactor
            break
        case 'down':
            camera.position.z += 0.01 * moveFactor
            break
        case 'left':
            camera.position.x -= 0.01 * moveFactor
            break
        case 'right':
            camera.position.x += 0.01 * moveFactor
            break
        case 'raise':
            camera.position.y += 0.01 * moveFactor
            break
        case 'sink':
            camera.position.y -= 0.01 * moveFactor
            break
        default:
            break
    }

    if (direction === undefined) {
        const moveFactor = 3.33
        if (keyboard['w']) {
            camera.position.z -= 0.1 * moveFactor
        }
        if (keyboard['s']) {
            camera.position.z += 0.1 * moveFactor
        }
        if (keyboard['a']) {
            camera.position.x -= 0.1 * moveFactor
        }
        if (keyboard['d']) {
            camera.position.x += 0.1 * moveFactor
        }
        if (keyboard['q']) {
            camera.position.y += 0.1 * moveFactor
        }
        if (keyboard['e']) {
            camera.position.y -= 0.1 * moveFactor
        }
    }
}

// Axes Helper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

// Grid Helper
const gridHelper = new THREE.GridHelper(100, 100)
gridHelper.material.opacity = 0.15
gridHelper.material.transparent = true
scene.add(gridHelper)

// Animation Loop
const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    moveCamera()
    boxMesh.rotation.x += 0.001
    boxMesh.rotation.y += 0.002
    boxMesh.rotation.z += 0.003
    renderer.render(scene, camera)
}
animate()


// Debug

const gui = new dat.GUI()
gui.add(boxMesh.scale, 'x').min(0).max(300).step(1).name('x scale')
gui.add(boxMesh.scale, 'y').min(0).max(300).step(1).name('y scale')
gui.add(boxMesh.scale, 'z').min(0).max(300).step(1).name('z scale')

const parameter = {
    color: '#000080',
    spinBox: () => {
        gsap.to(boxMesh.rotation, { duration: 1 * Math.random(), y: boxMesh.rotation.y + (Math.PI * 2) / Math.random() / 2 })
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
    },
    multiplySphere: () => {
        const newSphere = sphereMesh.clone()
        newSphere.position.set(
            camera.position.x - (2 * Math.random() * 5),
            camera.position.y + (1 * Math.random() * 3),
            camera.position.z - (0 + Math.random() * 4)
        )
        scene.add(newSphere)
    },
    flyAwayAll: () => {
        scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                gsap.to(object.position, { duration: 3, z: object.position.z - 200 })
            }
        })
    },
    comeBackAll: () => {
        scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                gsap.to(object.position, { duration: 0.5 * Math.random(), z: 50 * Math.random() })
            }
        })
    },
    spinAll: () => {
        scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                gsap.to(object.rotation, { duration: 1 * Math.random(), y: object.rotation.y + (Math.PI * 2) / Math.random() / 2 })
            }
        })
    },
    rain1000Baseballs: () => {
        for (let i = 0; i < 1000; i++) {
            const newSphere = sphereMesh.clone()
            newSphere.position.set(
            camera.position.x - (2 * Math.random() * 100) + (0 + Math.random() * 100),
            camera.position.y + (1 * Math.random() * 50),
            camera.position.z - (0 + Math.random() * 100) + (0 + Math.random() * 100)
            )
            scene.add(newSphere)
            gsap.to(newSphere.position, { duration: 3, y: -10, ease: "power2.out" })
        }
    },
    drop1000boxes: () => {
        for (let i = 0; i < 1000; i++) {
            const newBox = boxMesh.clone()
            newBox.position.set(
            camera.position.x - (2 * Math.random() * 100) + (0 + Math.random() * 100),
            camera.position.y + (1 * Math.random() * 50),
            camera.position.z - (0 + Math.random() * 100) + (0 + Math.random() * 100)
            )
            scene.add(newBox)
            gsap.to(newBox.position, { duration: 1, y: -10 * Math.random(), ease: "power1.out" })
        }
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
gui.add(parameter, 'multiplySphere')
gui.add(parameter, 'flyAwayAll')
gui.add(parameter, 'comeBackAll')
gui.add(parameter, 'spinAll')
gui.add(parameter, 'rain1000Baseballs')
gui.add(parameter, 'drop1000boxes')