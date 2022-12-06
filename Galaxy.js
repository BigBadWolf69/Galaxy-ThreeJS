{/* <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.144.0/three.min.js"></script>
    <script> */}



        const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 95, window.innerWidth / window.innerHeight, 0.1, 10000 );
camera.position.set(2,3,1)
camera.rotation.x = - Math.PI / 3

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



/**
 *  Galaxy Generator
 */

const parameters = {
    count: 100000,
    color: 0xffffff,
    insideColor: 0xff00ff,
    outsideColor: 0xff0000,
    size: 0.001,
    radius: 10,
    branches: 16,
    spin: -1,
    randomness: 0.8,
    randomnessPower: 7
}

let particlesGeometry = null
let particlesMaterial = null
let galaxy = null

const galaxyGenerator = () => {


    //Check if galaxy currently exists
    if(galaxy !== null) {
        particlesMaterial.dispose()
        particlesGeometry.dispose()
        scene.remove(galaxy)
    }

    particlesGeometry = new THREE.BufferGeometry()

    const count = parameters.count
    
    //Create a Float32Array (done in 3s for XYZ) 
    const positions = new Float32Array(count * 3)

    //Colors RGB
    const colors = new Float32Array(count * 3) 
    //New three color
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)


    for(let i = 0; i < count * 3; i++) {

        //Gives index value multiplied by three
        let i3 = i * 3
        const radius = Math.random() * parameters.radius

        const spinAngle = radius * parameters.spin

        //this should give a count of 0, 1, 2 for a branches number of 3 for example
        //the divide by three to get them as thirds
        //get radians (two pie is a circle)
        const branchesAngle =  ((i % parameters.branches) / parameters.branches) * Math.PI * 2

        //Randomness
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) 
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        //if(i <20 ) {console.log(i, branchesAngle);}

        positions[i3 + 0] =  Math.cos(branchesAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius  + randomZ

        //Color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
    particlesGeometry.setAttribute(
        'position', 
         new THREE.BufferAttribute(positions, 3)
    )

    // Add colors
    particlesGeometry.setAttribute(
        'color', 
            new THREE.BufferAttribute(colors, 3)
    )


    
    //Material
    particlesMaterial = new THREE.PointsMaterial({
        color: parameters.color, 
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    galaxy = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(galaxy)
        
}

galaxyGenerator()


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Rotate
    galaxy.rotation.y += 0.001

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


// #canvas {
//     display: block;
//     margin: 0;
//     padding: 0;
//   }
  
// </script>