import * as three from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GUI } from 'dat.gui'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
const gui = new GUI()
gui.hide()

// //lenis
function lenis() {
    const lenis = new Lenis()

    lenis.on('scroll', (e) => {
        console.log(e)
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)
}

lenis()



const canvas = document.querySelector(".webgl")

const scene = new three.Scene()
const sizes = {
    width: window.innerWidth,
    heigth: window.innerHeight
}

const camera = new three.PerspectiveCamera(55, sizes.width / sizes.heigth)
scene.add(camera)
camera.position.z = 5
// camera.position.y = -1

const loadingmanager = new three.LoadingManager()
loadingmanager.onLoad = () => {
    animate()
}


window.addEventListener("resize", () => {
    sizes.width = window.innerWidth
    sizes.heigth = window.innerHeight

    camera.aspect = sizes.width / sizes.heigth
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.heigth)

    location.reload()



})

// const orbitcontrol = new OrbitControls(camera, canvas)
// scene.add(orbitcontrol)



const box = new three.Mesh(new three.TorusGeometry(), new three.MeshBasicMaterial({
    color: "#ff0000"
}))
// scene.add(box)
let model;
let main;

const textureloade = new three.TextureLoader()
let textures = []

for (let i = 0; i < 4; i++) {
    const texture = textureloade.load(`./${i + 1}.png`)
    texture.flipY = false
    textures.push(texture)
}

// greenmap.colorSpace=three.ACESFilmicToneMapping

// console.log(greenmap);
// greenmap.rotation=50
const material = new three.MeshStandardMaterial({
    // emissive: greenmap,    
    roughness: .5,
    metalness: .4,
    // map: ,
    flatShading: false

})
gui.add(material, "roughness").min(0).max(1).step(.1)
gui.add(material, "metalness").min(0).max(1).step(.1)


const modeloader = new GLTFLoader(loadingmanager)
modeloader.load("./beer-can.glb", (gltf) => {
    model = gltf.scene



    model.scale.set(3, 3, 3)
    model.rotation.y = Math.PI
    // model.position.y = -1
    // model.position.z = 1
    model.traverse((child) => {
        if (child.name == "Packaged_Can_Regular_6P_2") {
            main = child
            child.material = material
            console.log(child);
        }
    })

    if (window.innerWidth < 1080) {
        model.scale.set(4, 4, 4)

    }
    if (window.innerWidth > 1080) {
        model.scale.set(3, 3, 3)
    }


    scene.add(model)





})

function animate() {

    const tl = gsap.timeline({
        defaults: { duration: 2 },
        scrollTrigger: {
            trigger: ".page1",
            start: "top top",
            end: '90% bottom',
            // markers: true,
            scrub: 1
        }

    })

    tl.to(model.rotation, { x: 6.5, }, 1)



    const navbartl = gsap.timeline({
        defaults: {
            duration: .1,
            // ease: "back.inOut"
        },
        scrollTrigger: {
            trigger: "nav",
            scrub: 1,
            start: "10% top",
            end: '90% bottom',
            // markers: true
        }
    })
    navbartl.to(".leftnav,.rightnav", { borderBottom: "none", ease: 1 }, 0)
    // navbartl.to(".logo", {})
    navbartl.to("nav", { borderBottom: "2px solid #F8F7E5", height: "6vh", backdropFilter: "blur(10px)", ease: 0 }, 0)
    navbartl.to(".logo", { height: "4vw", width: "4vw", transform: "translateY(-20%)" }, 0)
    // gsap.to(".logo", { backgroundColor: "black" })


    if (window.innerWidth < 1080) {
        mobileanime()
    }

    if (window.innerWidth > 1080) {
        lapanime()
    }




    // const tl = gsap.timeline({
    //     defaults: {
    //         duration: 1,
    //         ease: "back.inOut"
    //     },
    //     scrollTrigger: {
    //         trigger: "body",
    //         start: "top top",
    //         end: "bottom bottom",
    //         markers: true,
    //         scrub: 1
    //     }
    // })

    // if (model) {
    console.log("trigred");
    // tl.to(model.position, { x: -20,duration:.1 },1)
    // }

}


function mobileanime() {
    gsap.to(".webgl", {
        top: "65vw",
        duration: .5,
        scrollTrigger: {
            trigger: ".page1",
            scrub: 1,
            start: "top top",
            end: 'bottom bottom',
        }
    }, 1)
}

function lapanime() {
    gsap.to(".webgl", {
        top: "47vw",
        duration: .5,
        scrollTrigger: {
            trigger: ".page1",
            scrub: 1,
            start: "top top",
            end: 'bottom bottom',
            // markers: true

        }
    }, 1)
}


const arr = [1, 2, 3, 4]
let i = 1
switchcase(i)

const leftbutton = document.getElementById("arrow-left")
leftbutton.addEventListener("click", () => {
    gsap.to(model.rotation, { y: "-=12.55" })

    i--
    if (i < 0) {
        i = 4
    }
    switchcase(i)
})



const rightbutton = document.getElementById("arrow-right")
rightbutton.addEventListener("click", () => {

    gsap.to(model.rotation, { y: "+=12.55" })
    

    i++
    if (i > 4) {
        i = 1
    }
    switchcase(i)



})


function switchcase(i) {
    switch (i) {
        case 1:
            material.map = textures[i - 1]
            document.querySelector(".beerinfo-left h1").innerHTML = "Hops 'n' Dreams"
            document.querySelector(".underoutline h2").innerHTML = "Hops 'n' Dreams"
            document.querySelector(".beerinfo-left h3").innerHTML = "alc 3.5%"
            document.querySelector(".beerinfo-left p").innerHTML = "water malt wheat 3.5% etc"
            document.querySelector(".beerinfo-right p").innerHTML = "Immerse in gezelligheid and allow yourself to be surprised. Open up all of your senses and sit .It’s time to fully enjoy this moment.Breathe in, breathe out… No form of meditation can compete with this soothing natural blonde."
            document.querySelector(".page1").style.backgroundColor = "#c67b7cd0"
            // gsap.to(material,{color:"red"})
            console.log(material);

            console.log(1);
            break;
        case 2:
            material.map = textures[i - 1]
            document.querySelector(".beerinfo-left h1").innerHTML = "Sunset Brew"
            document.querySelector(".underoutline h2").innerHTML = "Sunset Brew"
            document.querySelector(".beerinfo-left h3").innerHTML = "alc 2.5%"
            document.querySelector(".beerinfo-left p").innerHTML = "water malt wheat 2.5% etc"
            document.querySelector(".beerinfo-right p").innerHTML = "Connect to a world that is packed with taste. From England to India, all the way up to the American tropics, where its bold flavours originate. Who needs coco rum when you can grab a beer like this?"
            document.querySelector(".page1").style.backgroundColor = "#86a7b3d0"
            console.log(2);
            break;
        case 3:
            material.map = textures[i - 1]
            document.querySelector(".beerinfo-left h1").innerHTML = "Frosty Mountain Ale"
            document.querySelector(".underoutline h2").innerHTML = "Frosty Mountain Ale"
            document.querySelector(".beerinfo-left h3").innerHTML = "alc 2.9%"
            document.querySelector(".beerinfo-left p").innerHTML = "water malt wheat 2.9% etc"
            document.querySelector(".beerinfo-right p").innerHTML = "This craft beer classic is brewed without fuss. With excellent quality water, grain, yeast and (a lot of) hops, we return to the essence of this icon. Our subtle flavours are meant to last, so have a seat, settle down and enjoy the moment. "
            document.querySelector(".page1").style.backgroundColor = "#84a390d0"
            console.log(3);
            break;
        case 4:
            material.map = textures[i - 1]
            document.querySelector(".beerinfo-left h1").innerHTML = "Mystic Amber"
            document.querySelector(".underoutline h2").innerHTML = "Mystic Amber"
            document.querySelector(".beerinfo-left h3").innerHTML = "alc 4.5%"
            document.querySelector(".beerinfo-left p").innerHTML = "water malt wheat 4.5% etc"
            document.querySelector(".beerinfo-right p").innerHTML = "Is it still raining? No worries. Just take another deep dive into this full bodied-beer which delicately hits every side of your palette. Pure and honest. Damn delicious. Something about the little things in life…"
            document.querySelector(".page1").style.backgroundColor = "#98af88d0"
            console.log(4);
            break;
    }
}

function lights() {

    const light = new three.DirectionalLight("white", 1)
    const light1 = new three.DirectionalLight("white", 1)
    const light2 = new three.DirectionalLight("white", 1)
    const light3 = new three.DirectionalLight("white", 1)
    light.position.set(0, 0, 5)
    light1.position.set(-0, 0, -5)
    light2.position.x = 5
    light3.position.x = -5
    scene.add(light, light1, light2, light3)

    const lighthelper = new three.DirectionalLightHelper(light, 5, "red")
    const lighthelper1 = new three.DirectionalLightHelper(light1, 5, "red")
    const lighthelper2 = new three.DirectionalLightHelper(light2, 5, "red")
    const lighthelper3 = new three.DirectionalLightHelper(light3, 5, "red")
    // scene.add(lighthelper, lighthelper1, lighthelper2, lighthelper3)


}

lights()
const axeshelper = new three.AxesHelper(10)
scene.add(axeshelper)

const renderer = new three.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.outputColorSpace = three.SRGBColorSpace
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(sizes.width, sizes.heigth)



const clock = new three.Clock()
function tick() {

    const elaptime = clock.getElapsedTime()
    // console.log(Math.sin(elaptime) * .01 * Math.random());

    if (model) {
        model.position.y = Math.sin(elaptime) * .1

        model.rotation.x += Math.sin(elaptime) * - .0003
        model.rotation.z += Math.sin(elaptime) * - .0003

        // model.rotation.z = Math.sin(elaptime)*.01
    }

    renderer.render(scene, camera)

    // box.rotation.y += .1
    window.requestAnimationFrame(tick)
}

tick()
