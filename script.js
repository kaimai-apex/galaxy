// Create container for Three.js canvas
const container = document.createElement('div');
container.id = 'psychedelic-background';
container.style.position = 'fixed';
container.style.top = '0';
container.style.left = '0';
container.style.width = '100%';
container.style.height = '100%';
container.style.zIndex = '-1';
document.body.appendChild(container);

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#webgl'),
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create spiral particles
const particlesCount = 10000;
const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    const radius = Math.random() * 2;
    const spinAngle = radius * 5;
    const randomAngle = Math.random() * Math.PI * 2;
    
    positions[i3] = Math.cos(spinAngle + randomAngle) * radius;
    positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
    positions[i3 + 2] = Math.sin(spinAngle + randomAngle) * radius;

    // Create cosmic colors
    const color = new THREE.Color();
    color.setHSL(Math.random() * 0.2 + 0.5, 1, 0.5);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create comets
const cometCount = 20;
const cometPositions = new Float32Array(cometCount * 3);
const cometColors = new Float32Array(cometCount * 3);
const cometVelocities = new Float32Array(cometCount * 3);

for(let i = 0; i < cometCount; i++) {
    const i3 = i * 3;
    // Random starting position outside the whirlpool
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 2;
    
    cometPositions[i3] = Math.cos(angle) * radius;
    cometPositions[i3 + 1] = (Math.random() - 0.5) * 2;
    cometPositions[i3 + 2] = Math.sin(angle) * radius;

    // Random velocity towards center
    const speed = 0.02 + Math.random() * 0.03;
    cometVelocities[i3] = -cometPositions[i3] * speed;
    cometVelocities[i3 + 1] = (Math.random() - 0.5) * speed;
    cometVelocities[i3 + 2] = -cometPositions[i3 + 2] * speed;

    // Comet colors (brighter and more intense)
    const color = new THREE.Color();
    color.setHSL(Math.random() * 0.2 + 0.5, 1, 0.7);
    cometColors[i3] = color.r;
    cometColors[i3 + 1] = color.g;
    cometColors[i3 + 2] = color.b;
}

const cometGeometry = new THREE.BufferGeometry();
cometGeometry.setAttribute('position', new THREE.BufferAttribute(cometPositions, 3));
cometGeometry.setAttribute('color', new THREE.BufferAttribute(cometColors, 3));

const cometMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const cometMesh = new THREE.Points(cometGeometry, cometMaterial);
scene.add(cometMesh);

// Camera position
camera.position.z = 3;

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// Animation
function animate() {
    requestAnimationFrame(animate);

    // Smooth camera movement
    targetX = (mouseX - window.innerWidth / 2) * 0.001;
    targetY = (mouseY - window.innerHeight / 2) * 0.001;

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;

    // Rotate particles to create whirlpool effect
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;

    // Update particle positions for spiral motion
    const positions = particlesGeometry.attributes.position.array;
    const time = Date.now() * 0.001;

    for(let i = 0; i < positions.length; i += 3) {
        const radius = Math.sqrt(positions[i] * positions[i] + positions[i + 2] * positions[i + 2]);
        const angle = Math.atan2(positions[i + 2], positions[i]) + 0.001 * (1 / (radius + 1));
        
        positions[i] = radius * Math.cos(angle);
        positions[i + 2] = radius * Math.sin(angle);
    }

    particlesGeometry.attributes.position.needsUpdate = true;

    // Color shift effect
    const colors = particlesGeometry.attributes.color.array;
    for(let i = 0; i < colors.length; i += 3) {
        const color = new THREE.Color();
        color.setHSL(Math.sin(time * 0.1 + i * 0.01) * 0.1 + 0.5, 1, 0.5);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }
    particlesGeometry.attributes.color.needsUpdate = true;

    // Update comet positions
    const cometPositions = cometGeometry.attributes.position.array;
    for(let i = 0; i < cometCount; i++) {
        const i3 = i * 3;
        
        // Update position
        cometPositions[i3] += cometVelocities[i3];
        cometPositions[i3 + 1] += cometVelocities[i3 + 1];
        cometPositions[i3 + 2] += cometVelocities[i3 + 2];

        // Check if comet has reached center or gone too far
        const distance = Math.sqrt(
            cometPositions[i3] * cometPositions[i3] +
            cometPositions[i3 + 1] * cometPositions[i3 + 1] +
            cometPositions[i3 + 2] * cometPositions[i3 + 2]
        );

        if(distance < 0.5 || distance > 5) {
            // Reset comet to new starting position
            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 2;
            
            cometPositions[i3] = Math.cos(angle) * radius;
            cometPositions[i3 + 1] = (Math.random() - 0.5) * 2;
            cometPositions[i3 + 2] = Math.sin(angle) * radius;

            // New random velocity
            const speed = 0.02 + Math.random() * 0.03;
            cometVelocities[i3] = -cometPositions[i3] * speed;
            cometVelocities[i3 + 1] = (Math.random() - 0.5) * speed;
            cometVelocities[i3 + 2] = -cometPositions[i3 + 2] * speed;
        }
    }
    cometGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();

// GSAP animations for text
document.addEventListener('click', () => {
    gsap.to('.container', {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            document.querySelector('.container').style.display = 'none';
        }
    });

    // Create wave effect
    const wave = document.createElement('div');
    wave.className = 'wave';
    document.body.appendChild(wave);

    gsap.to(wave, {
        scale: 20,
        opacity: 0,
        duration: 1,
        onComplete: () => wave.remove()
    });
}); 