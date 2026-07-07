// === ABI PORTAL V5 — ECLIPSE & CUSTOM GREEN GLOBE WITH COUNTRY BORDERS ===
// Three.js r128 | Solar Eclipse, Shooting Star Trail, Procedural GeoJSON Globe

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x010103, 0.001);

const camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 0.1, 2000);
camera.position.z = 240;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// === HELPERS ===
function smoothstep(a, b, x) {
    const t = Math.max(0, Math.min(1, (x-a)/(b-a)));
    return t*t*(3-2*t);
}

function createGlowTexture(size, c1, c2, c3='rgba(0,0,0,0)') {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
    g.addColorStop(0,c1); g.addColorStop(0.2,c2); g.addColorStop(1,c3);
    ctx.fillStyle=g; ctx.fillRect(0,0,size,size);
    return new THREE.CanvasTexture(c);
}

function latLongToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 90) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));

    return new THREE.Vector3(x, y, z);
}

// === GLOBE GROUP ===
const globeGroup = new THREE.Group();
scene.add(globeGroup);
const radius = 90;

// Initialize Globe Mesh (Texture will load asynchronously)
const sphereGeo = new THREE.SphereGeometry(radius, 64, 64);
const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White base to not darken map
    roughness: 0.8,
    metalness: 0.1,
    emissive: 0x050a10, 
    emissiveIntensity: 0.5
});
const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
globeMesh.receiveShadow = true;
globeGroup.add(globeMesh);

// --- EARTH DUST PARTICLES ---
const dustGeo = new THREE.BufferGeometry();
const origPos = sphereGeo.attributes.position.array;
const dustPos = new Float32Array(origPos.length);
const dustVelocities = [];

for (let i = 0; i < origPos.length; i += 3) {
    dustPos[i] = origPos[i];
    dustPos[i+1] = origPos[i+1];
    dustPos[i+2] = origPos[i+2];
    
    const v = new THREE.Vector3(origPos[i], origPos[i+1], origPos[i+2]).normalize();
    dustVelocities.push({
        x: v.x + (Math.random() - 0.5) * 1.5,
        y: v.y + (Math.random() - 0.5) * 1.5,
        z: v.z + (Math.random() - 0.5) * 1.5,
        speed: Math.random() * 80 + 20
    });
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
// Store original positions for reset during scroll
dustGeo.setAttribute('origPosition', new THREE.BufferAttribute(new Float32Array(origPos), 3));

const dustMat = new THREE.PointsMaterial({ 
    color: 0x88ccff, size: 2.0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending 
});
const dustPoints = new THREE.Points(dustGeo, dustMat);
globeGroup.add(dustPoints);

// --- REALISTIC EARTH TEXTURE ---
const texLoader = new THREE.TextureLoader();
texLoader.load('https://unpkg.com/three-globe/example/img/earth-dark.jpg', (tex) => {
    sphereMat.map = tex;
    sphereMat.color.setHex(0xffffff);
    sphereMat.needsUpdate = true;
});


// Cinematic Atmospheric Fresnel (White/Blue Rim)
const atmosGeo = new THREE.SphereGeometry(radius + 1.2, 64, 64);
const atmosMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6, transparent: true, opacity: 0.15,
    blending: THREE.AdditiveBlending, side: THREE.BackSide
});
const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
globeGroup.add(atmosphere);

// --- 3D ORBITING METALLIC TEXT ---
const fontLoader = new THREE.FontLoader();
const textGroup = new THREE.Group();
globeGroup.add(textGroup); // Attaches text to the globe so it spins with it
window.sceneLetters = []; // Global reference for animation loop

fontLoader.load('https://unpkg.com/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    const textString = "ABI : AUTOMATION & BUSSINESS INTELLIGENCES";
    
    // Silver white shining surface
    const textMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0x8899aa,
        emissiveIntensity: 0.4
    });

    const textRadius = radius + 15; // Not sticking to globe
    const fontSize = 7;
    const LETTER_SPACING = 0.8; // Fixed padding between letters

    const charData = [];
    let totalArc = 0;
    
    for (let i = 0; i < textString.length; i++) {
        const char = textString[i];
        if (char === ' ') {
            const spaceWidth = fontSize * 0.4;
            charData.push({ isSpace: true, width: spaceWidth });
            totalArc += spaceWidth;
            continue;
        }
        
        // 3D format with 3D edges
        const geo = new THREE.TextGeometry(char, {
            font: font, 
            size: fontSize, 
            height: 1.5, // 3D depth
            curveSegments: 3, 
            bevelEnabled: true,
            bevelThickness: 0.3, 
            bevelSize: 0.15, 
            bevelSegments: 2
        });
        
        geo.computeBoundingBox();
        const rawWidth = geo.boundingBox.max.x - geo.boundingBox.min.x;
        
        // Center the geometry origin to perfectly rotate on its own Y axis
        geo.translate(- (geo.boundingBox.max.x + geo.boundingBox.min.x) / 2, 0, 0);
        
        const letterTotalWidth = rawWidth + LETTER_SPACING;
        charData.push({ geo, isSpace: false, width: rawWidth, totalSpace: letterTotalWidth });
        totalArc += letterTotalWidth;
    }

    // Start at front center, offset by half the total text length so the word is perfectly centered!
    let currentAngle = (Math.PI / 2) + ((totalArc / 2) / textRadius);

    for (let i = 0; i < textString.length; i++) {
        const cd = charData[i];
        
        if (cd.isSpace) {
            currentAngle -= (cd.width / textRadius);
            continue;
        }
        
        // Advance to the CENTER of the current letter
        currentAngle -= ((cd.width / 2) / textRadius);
        
        const mesh = new THREE.Mesh(cd.geo, textMaterial.clone());
        const x = Math.cos(currentAngle) * textRadius;
        const z = Math.sin(currentAngle) * textRadius;
        mesh.position.set(x, 0, z);
        
        // Face outward from globe center toward camera
        mesh.rotation.y = -currentAngle + (Math.PI / 2);
        
        textGroup.add(mesh);
        
        // Advance angle by the rest of this letter + spacing for the NEXT letter
        currentAngle -= ((cd.width / 2 + LETTER_SPACING) / textRadius);
    }
});



// --- SOLAR ECLIPSE CORONA (Behind Earth) ---
const eclipseTex = createGlowTexture(512, 'rgba(255,255,255,1)', 'rgba(253, 230, 138, 0.5)', 'rgba(0,0,0,0)');
const eclipseMat = new THREE.MeshBasicMaterial({ 
    map: eclipseTex, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending, depthWrite: false 
});
const eclipsePlane = new THREE.Mesh(new THREE.PlaneGeometry(350, 350), eclipseMat);
eclipsePlane.position.z = -15; 
scene.add(eclipsePlane);

// Lighting to simulate Eclipse Rim Light
scene.add(new THREE.AmbientLight(0x223344, 1.2)); // Slightly brighter ambient
const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
rimLight.position.set(0, 0, -200); 
scene.add(rimLight);
// Warm Sunlight coming from the front
const frontFill = new THREE.DirectionalLight(0xfff0dd, 2.5); // Warm, intense sunlight
frontFill.position.set(150, 100, 250);
frontFill.castShadow = true;
frontFill.shadow.mapSize.width = 2048;
frontFill.shadow.mapSize.height = 2048;
frontFill.shadow.camera.near = 50;
frontFill.shadow.camera.far = 400;
frontFill.shadow.camera.left = -150;
frontFill.shadow.camera.right = 150;
frontFill.shadow.camera.top = 150;
frontFill.shadow.camera.bottom = -150;
frontFill.shadow.bias = -0.0005;
scene.add(frontFill);

// === SHINING GALAXY STARFIELD ===
const starCount = 4000;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starCount * 3);
for(let i=0; i<starCount; i++) {
    // Distribute more densely in a band
    const x = (Math.random()-0.5)*2000;
    const y = (Math.random()-0.5)*1500;
    const z = -Math.random()*800 - 150;
    starPos[i*3] = x;
    starPos[i*3+1] = y * (0.1 + Math.random()*0.9); // flattened galaxy band
    starPos[i*3+2] = z;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starGlowTex = createGlowTexture(64, 'rgba(255,255,255,1)', 'rgba(200,230,255,0.6)');
const starMat = new THREE.PointsMaterial({
    size: 10.0, color: 0xffffff, transparent: true, opacity: 0.9,
    map: starGlowTex, blending: THREE.AdditiveBlending, depthWrite: false
});
const starField = new THREE.Points(starGeo, starMat);
scene.add(starField); // Restored background stars as requested

// === 1. AUTOMATION (N8N Nodes) ===
const n8nGroup = new THREE.Group();
globeGroup.add(n8nGroup);

function createNodeTexture(colorHex, iconType) {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    
    const center = size / 2;
    const radius = size / 2 - 16;
    
    const colorStr = '#' + colorHex.toString(16).padStart(6, '0');
    
    // Draw outer white glowing ring
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset for rest
    
    // Draw dark background inside
    ctx.beginPath();
    ctx.arc(center, center, radius - 7, 0, Math.PI * 2);
    ctx.fillStyle = '#111315';
    ctx.fill();
    
    // Draw icon
    ctx.fillStyle = colorStr;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 80px Arial';
    
    const symbols = {
        trigger: '⚡', http: '🌐', sheets: '📊', gmail: '✉', 
        slack: '💬', webhook: '🔗', code: '</>', openai: '🤖'
    };
    ctx.fillText(symbols[iconType] || '⚙', center, center + 6);
    
    return new THREE.CanvasTexture(c);
}

const types = ['http', 'gmail', 'slack', 'webhook', 'code', 'openai'];
const nodeCols = { 
    http: 0x2dd4bf, gmail: 0xea4335, 
    slack: 0x4a154b, webhook: 0x9b59b6, code: 0x818cf8, openai: 0x10a37f 
};

// Pre-generate textures and 3D materials
const nodeTextures = {};
const nodeMaterials = {};
types.forEach(t => {
    nodeTextures[t] = createNodeTexture(nodeCols[t], t);
    
    // 3D Material Array for Cylinder: [side, top, bottom]
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x111315, metalness: 0.8, roughness: 0.3 });
    const topMat = new THREE.MeshStandardMaterial({ 
        map: nodeTextures[t], 
        emissive: 0xffffff,
        emissiveMap: nodeTextures[t],
        emissiveIntensity: 0.8,
        metalness: 0.3, 
        roughness: 0.5 
    });
    nodeMaterials[t] = [darkMat, topMat, darkMat];
});

// Create hubs - limited and avoiding overlap
const hubs = [];
for(let i=0; i<400; i++) {
    if (hubs.length >= 35) break;
    const lat = (Math.random() - 0.5) * 120; 
    const lon = (Math.random() - 0.5) * 360; 
    
    let overlap = false;
    for (let h of hubs) {
        const dLat = h.lat - lat;
        const dLon = h.lon - lon;
        if (Math.sqrt(dLat*dLat + dLon*dLon) < 16) {
            overlap = true;
            break;
        }
    }
    if (!overlap) {
        hubs.push({ lat, lon, type: types[Math.floor(Math.random()*types.length)] });
    }
}

const n8nObjects = [];
const curvePoints = [];

// Reusable 3D Geometry for Nodes (Coin shape)
const nodeGeo = new THREE.CylinderGeometry(1, 1, 0.6, 32);
nodeGeo.rotateX(Math.PI / 2); // Orient so the top face looks towards +Z

hubs.forEach((hub) => {
    const surfacePos = latLongToVector3(hub.lat, hub.lon, radius);
    const nodeNormal = surfacePos.clone().normalize();
    const orbitDistance = 0.5;
    const orbitPos = surfacePos.clone().add(nodeNormal.clone().multiplyScalar(orbitDistance));

    // 3D Node Mesh
    const mesh = new THREE.Mesh(nodeGeo, nodeMaterials[hub.type]);
    mesh.castShadow = true;
    
    // Visible size
    const scale = 4;
    mesh.scale.set(scale, scale, scale);
    
    // Align tightly to surface normal
    mesh.position.copy(orbitPos);
    mesh.lookAt(orbitPos.clone().add(nodeNormal));
    
    // Start invisible
    mesh.material = nodeMaterials[hub.type].map(m => {
        const mat = m.clone();
        mat.transparent = true;
        mat.opacity = 0;
        return mat;
    });
    
    n8nGroup.add(mesh);
    
    n8nObjects.push({
        mesh, surfacePos: surfacePos.clone(), orbitPos, normal: nodeNormal, hubType: hub.type
    });
});

// --- MULTIPLE SHOOTING STARS ---
const starGlitterTex = createGlowTexture(64, 'rgba(255,255,255,1)', 'rgba(255,255,255,0.8)', 'rgba(0,0,0,0)');

const starsData = [];
const numStars = 6;

for (let s = 0; s < numStars; s++) {
    const jumpPoints = [];
    const numJumps = 12 + Math.floor(Math.random() * 6); // 12 to 17 jumps
    const starNodes = [];
    
    const sequence = [];
    for(let i=0; i<numJumps; i++) {
        sequence.push(n8nObjects[Math.floor(Math.random() * n8nObjects.length)]);
    }

    for (let i = 0; i < numJumps; i++) {
        const nodeA = sequence[i];
        const nodeB = sequence[(i+1)%numJumps];
        
        const p1 = nodeA.orbitPos;
        const p2 = nodeB.orbitPos;
        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        
        const dist = p1.distanceTo(p2);
        const jumpHeight = radius + 8 + (dist * 0.15); // dynamically adjust jump height
        mid.normalize().multiplyScalar(jumpHeight);
        
        jumpPoints.push(p1);
        jumpPoints.push(mid);
        starNodes.push(nodeB);
    }
    
    const travelPath = new THREE.CatmullRomCurve3(jumpPoints, true, 'catmullrom', 0.5);
    
    const shootingStar = new THREE.Sprite(new THREE.SpriteMaterial({
        map: starGlitterTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending
    }));
    shootingStar.scale.set(12, 12, 1);
    n8nGroup.add(shootingStar);
    
    const trailCount = 20; 
    const trailParticles = [];
    for(let i=0; i<trailCount; i++) {
        const p = new THREE.Sprite(new THREE.SpriteMaterial({
            map: starGlitterTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending
        }));
        p.scale.set(4, 4, 1);
        n8nGroup.add(p);
        trailParticles.push(p);
    }
    
    starsData.push({
        travelPath, shootingStar, trailParticles, trailCount, starNodes, numJumps,
        speedOffset: 0.05 + Math.random() * 0.05,
        timeOffset: Math.random()
    });
}




// === 2. BUSINESS INTELLIGENCE (TRANSITION MODEL) ===

// --- BI TRANSITION BULB ---
const biBulbTex = new THREE.TextureLoader().load('/bi_bulb_hand.png');
const biBulbMat = new THREE.SpriteMaterial({ 
    map: biBulbTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthTest: false 
});
const biBulbSprite = new THREE.Sprite(biBulbMat);
biBulbSprite.scale.set(180, 180, 1); // Strictly matched to Earth diameter (radius 90 * 2)
biBulbSprite.position.set(0, 0, 0);
scene.add(biBulbSprite);




// === SCROLL STATE ===
let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; });

// === ANIMATION LOOP ===
const clock = new THREE.Clock();
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / innerWidth) * 2 - 1;
    mouseY = (e.clientY / innerHeight) * 2 - 1;
});

function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const time = clock.getElapsedTime();
    const progress = scrollY / innerHeight;
    
    // Spin right-to-left: negative rotation so text sweeps from right side into view
    globeGroup.rotation.y -= dt * 0.1;

    const targetRotX = mouseY * 0.15 + (progress * 0.2); 
    globeGroup.rotation.x += (targetRotX - globeGroup.rotation.x) * 0.05;
    starField.rotation.y = time * 0.0005;

    // --- 3D Globe Shift on Scroll ---
    // progress is roughly 0 (Hero), 1 (Automation), 2 (BI)
    const r1 = smoothstep(0.4, 1.0, progress); // delayed slightly
    const r2 = smoothstep(1.4, 2.0, progress); // delayed slightly
    
    // Move globe to the right for Automation, then left for Business Intelligence
    const targetX = (r1 * 80) - (r2 * 160); // shifted further out
    globeGroup.position.x += (targetX - globeGroup.position.x) * 0.05;

    // Stars glow every 10 secs (dark to light and light to dark)
    const starCycle = (Math.sin(time * (Math.PI * 2 / 10)) + 1) / 2; // 0.0 to 1.0
    starMat.opacity = 0.2 + (starCycle * 0.8); // oscillates between 0.2 and 1.0

    // Brighter Eclipse Corona pulsation
    eclipsePlane.material.opacity = 0.95 + Math.sin(time * 2) * 0.05;
    eclipsePlane.lookAt(camera.position); 

    // --- N8N Animation & Shooting Star (Scroll 0.5 -> 1.5) ---
    const n8nWeight = smoothstep(0.5, 0.9, progress) * (1 - smoothstep(1.5, 1.9, progress));
    
    n8nObjects.forEach(obj => {
        // Fade in all materials of the 3D mesh array
        obj.mesh.visible = n8nWeight > 0;
        obj.mesh.material.forEach(m => m.opacity = n8nWeight);
    });

    if (n8nWeight > 0.1) {
        starsData.forEach((starData) => {
            starData.shootingStar.material.opacity = n8nWeight;
            const pathProgress = (time * starData.speedOffset + starData.timeOffset) % 1; 
            
            const totalSegments = starData.numJumps * 2; 
            const segmentIndex = Math.floor(pathProgress * totalSegments);
            const currentJumpIndex = Math.floor(segmentIndex / 2);
            const targetColorHex = nodeCols[starData.starNodes[currentJumpIndex].hubType];
            
            starData.shootingStar.material.color.setHex(targetColorHex);
            
            const currentStarPos = starData.travelPath.getPointAt(pathProgress);
            starData.shootingStar.position.copy(currentStarPos);
            
            for(let i=0; i<starData.trailCount; i++) {
                const delayOffset = (i + 1) * 0.0015;
                let trailProg = pathProgress - delayOffset;
                if(trailProg < 0) trailProg += 1;
                
                const trailPos = starData.travelPath.getPointAt(trailProg);
                
                const jitterAmount = i * 0.2;
                trailPos.x += (Math.random()-0.5) * jitterAmount;
                trailPos.y += (Math.random()-0.5) * jitterAmount;
                trailPos.z += (Math.random()-0.5) * jitterAmount;
                
                const tp = starData.trailParticles[i];
                tp.position.copy(trailPos);
                tp.material.color.setHex(targetColorHex);
                tp.material.opacity = n8nWeight * (1 - (i / starData.trailCount));
                const scale = 5 * (1 - (i / starData.trailCount));
                tp.scale.set(scale, scale, 1);
            }
        });
    } else {
        starsData.forEach(starData => {
            starData.shootingStar.material.opacity = 0;
            starData.trailParticles.forEach(p => p.material.opacity = 0);
        });
    }

    // --- BI Transition (Scroll 1.5 -> 2.5) ---
    const biWeight = smoothstep(1.5, 2.0, progress);
    
    // --- Earth "Dusting" Transition ---
    globeMesh.material.transparent = true;
    // Earth fades out quickly in the first 30% of the transition
    const earthFade = Math.max(0, 1.0 - (biWeight * 3.33));
    globeMesh.material.opacity = earthFade;
    globeMesh.visible = earthFade > 0;
    atmosphere.material.opacity = 0.15 * earthFade;
    atmosphere.visible = earthFade > 0;
    
    textGroup.children.forEach(c => { 
        c.material.transparent = true; 
        c.material.opacity = Math.min(earthFade, 1.0 - n8nWeight); 
        c.visible = c.material.opacity > 0;
    });

    // Dust particles explode outwards tied to scroll progress
    if (biWeight > 0 && biWeight < 1) {
        const positions = dustPoints.geometry.attributes.position.array;
        const origPositions = dustPoints.geometry.attributes.origPosition.array;
        
        for (let i = 0, j = 0; i < positions.length; i += 3, j++) {
            const vel = dustVelocities[j];
            // Exponential explosion curve
            const expand = Math.pow(biWeight, 1.5) * vel.speed;
            positions[i] = origPositions[i] + vel.x * expand;
            positions[i+1] = origPositions[i+1] + vel.y * expand;
            positions[i+2] = origPositions[i+2] + vel.z * expand;
        }
        dustPoints.geometry.attributes.position.needsUpdate = true;
        
        // Dust fades in quickly, then fades out as it spreads
        dustMat.opacity = biWeight < 0.2 ? biWeight * 5 : 1.0 - biWeight;
    } else {
        dustMat.opacity = 0;
    }
    
    // Fade in and pulsate the new Bulb model
    const bulbPulse = 0.8 + Math.sin(time * 3) * 0.2;
    // Bulb fades in as Earth fades out
    biBulbSprite.material.opacity = smoothstep(0.2, 1.0, biWeight) * bulbPulse;
    
    // Synchronize Bulb position with the Globe so it moves left
    biBulbSprite.position.x = globeGroup.position.x;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

animate();
