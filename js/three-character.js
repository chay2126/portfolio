/* ============================================================
   THREE-CHARACTER.JS — 3D Low-Poly Developer at Desk
   ============================================================ */

class DevCharacter {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.width  = this.canvas.clientWidth  || 420;
    this.height = this.canvas.clientHeight || 480;
    this.mouse  = { x: 0, y: 0 };
    this.clock  = null;
    this.group  = null;
    this.head   = null;
    this.armR   = null;
    this.armL   = null;
    this.screen = null;
    this.screenGlow = null;
    this.particles = [];
  }

  init() {
    this._setupRenderer();
    this._setupScene();
    this._buildCharacter();
    this._buildDesk();
    this._buildParticles();
    this._bindEvents();
    this._animate();
  }

  _setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 0);

    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 1.8, 6.5);
    this.camera.lookAt(0, 1.2, 0);

    this.clock = new THREE.Clock();
  }

  _setupScene() {
    // Ambient
    const ambient = new THREE.AmbientLight(0x334466, 1.8);
    this.scene.add(ambient);

    // Key light (blue-ish from monitor)
    const keyLight = new THREE.PointLight(0x0066FF, 3, 12);
    keyLight.position.set(0, 2.5, 2);
    this.scene.add(keyLight);
    this.keyLight = keyLight;

    // Rim light (cool teal)
    const rimLight = new THREE.DirectionalLight(0x00F5FF, 1.2);
    rimLight.position.set(-4, 3, -2);
    this.scene.add(rimLight);

    // Top fill
    const topLight = new THREE.DirectionalLight(0xffffff, 0.6);
    topLight.position.set(0, 6, 0);
    this.scene.add(topLight);
  }

  _mat(color, opts = {}) {
    return new THREE.MeshLambertMaterial({ color, ...opts });
  }

  _buildCharacter() {
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // ── TORSO
    const torsoGeo = new THREE.BoxGeometry(1.1, 1.3, 0.7);
    const torso    = new THREE.Mesh(torsoGeo, this._mat(0x1a1a2e));
    torso.position.set(0, 1.35, 0);
    this.group.add(torso);

    // Shirt detail stripe
    const stripeGeo = new THREE.BoxGeometry(0.25, 1.32, 0.72);
    const stripe    = new THREE.Mesh(stripeGeo, this._mat(0x0066FF));
    stripe.position.set(0, 1.35, 0);
    this.group.add(stripe);

    // ── NECK
    const neckGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.25, 5);
    const neck    = new THREE.Mesh(neckGeo, this._mat(0xc68642));
    neck.position.set(0, 2.08, 0);
    this.group.add(neck);

    // ── HEAD (slightly angular / low-poly)
    const headGeo = new THREE.BoxGeometry(0.78, 0.82, 0.72);
    this.head     = new THREE.Mesh(headGeo, this._mat(0xc68642));
    this.head.position.set(0, 2.7, 0);
    this.group.add(this.head);

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.12, 0.08, 0.1);
    const eyeMat = this._mat(0x111111);
    [-0.2, 0.2].forEach(x => {
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(x, 2.72, 0.37);
      this.group.add(eye);
    });

    // Glasses (dev badge!)
    const glassGeo  = new THREE.TorusGeometry(0.1, 0.018, 4, 8);
    const glassMat  = this._mat(0x0066FF);
    [-0.2, 0.2].forEach(x => {
      const g = new THREE.Mesh(glassGeo, glassMat);
      g.position.set(x, 2.72, 0.37);
      g.rotation.x = Math.PI / 2;
      this.group.add(g);
    });
    // Bridge
    const bridgeGeo = new THREE.BoxGeometry(0.2, 0.018, 0.018);
    const bridge    = new THREE.Mesh(bridgeGeo, glassMat);
    bridge.position.set(0, 2.72, 0.37);
    this.group.add(bridge);

    // Smile
    const smileGeo = new THREE.TorusGeometry(0.1, 0.025, 4, 8, Math.PI);
    const smile    = new THREE.Mesh(smileGeo, this._mat(0x8b4513));
    smile.position.set(0, 2.55, 0.37);
    smile.rotation.z = Math.PI;
    this.group.add(smile);

    // ── LEFT ARM (typing)
    const armGeo = new THREE.BoxGeometry(0.28, 1.0, 0.28);
    this.armL    = new THREE.Mesh(armGeo, this._mat(0x1a1a2e));
    this.armL.position.set(-0.72, 1.0, 0.25);
    this.armL.rotation.x = -0.55;
    this.group.add(this.armL);

    // ── RIGHT ARM (typing)
    this.armR = new THREE.Mesh(armGeo, this._mat(0x1a1a2e));
    this.armR.position.set(0.72, 1.0, 0.25);
    this.armR.rotation.x = -0.55;
    this.group.add(this.armR);

    // Hands
    const handGeo = new THREE.BoxGeometry(0.22, 0.18, 0.22);
    const handMat = this._mat(0xc68642);

    const handL = new THREE.Mesh(handGeo, handMat);
    handL.position.set(-0.72, 0.52, 0.58);
    this.group.add(handL);

    const handR = new THREE.Mesh(handGeo, handMat);
    handR.position.set(0.72, 0.52, 0.58);
    this.group.add(handR);

    // ── LEGS (sitting — bent forward)
    const legGeo = new THREE.BoxGeometry(0.38, 0.9, 0.38);
    const legMat = this._mat(0x2c2c54);
    [-0.3, 0.3].forEach(x => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, 0.45, 0.3);
      leg.rotation.x = 0.9;
      this.group.add(leg);
    });

    // Shoes
    const shoeGeo = new THREE.BoxGeometry(0.4, 0.2, 0.55);
    const shoeMat = this._mat(0x222222);
    [-0.3, 0.3].forEach(x => {
      const shoe = new THREE.Mesh(shoeGeo, shoeMat);
      shoe.position.set(x, 0.05, 0.75);
      this.group.add(shoe);
    });

    this.group.position.set(-0.5, -0.5, 0);
  }

  _buildDesk() {
    const deskGroup = new THREE.Group();

    // Desk surface
    const deskGeo = new THREE.BoxGeometry(3.2, 0.1, 1.4);
    const deskMat = this._mat(0x2a1a0e);
    const desk    = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, 0.75, 0.3);
    deskGroup.add(desk);

    // Desk legs
    const legGeo = new THREE.BoxGeometry(0.1, 0.75, 0.1);
    const legMat = this._mat(0x1a1008);
    [[-1.5, 0], [1.5, 0], [-1.5, 1.2], [1.5, 1.2]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, 0.37, z - 0.3);
      deskGroup.add(leg);
    });

    // ── MONITOR
    const monitorBase = new THREE.BoxGeometry(0.5, 0.05, 0.5);
    const monBase     = new THREE.Mesh(monitorBase, this._mat(0x111111));
    monBase.position.set(0, 0.82, -0.1);
    deskGroup.add(monBase);

    const monStandGeo = new THREE.BoxGeometry(0.08, 0.35, 0.08);
    const monStand    = new THREE.Mesh(monStandGeo, this._mat(0x111111));
    monStand.position.set(0, 1.02, -0.1);
    deskGroup.add(monStand);

    const monFrameGeo = new THREE.BoxGeometry(1.8, 1.1, 0.08);
    const monFrame    = new THREE.Mesh(monFrameGeo, this._mat(0x111111));
    monFrame.position.set(0, 1.62, -0.12);
    deskGroup.add(monFrame);

    // Screen (glowing blue)
    const screenGeo = new THREE.BoxGeometry(1.62, 0.94, 0.04);
    const screenMat = new THREE.MeshLambertMaterial({ color: 0x0033aa, emissive: 0x001166, emissiveIntensity: 1.2 });
    this.screen     = new THREE.Mesh(screenGeo, screenMat);
    this.screen.position.set(0, 1.62, -0.07);
    deskGroup.add(this.screen);

    // Code lines on screen
    const lineGeo = new THREE.BoxGeometry(0.8, 0.04, 0.02);
    const lineMat = this._mat(0x00F5FF, { emissive: 0x00aaaa, emissiveIntensity: 0.5 });
    [0.3, 0.18, 0.06, -0.06, -0.18, -0.28].forEach((y, i) => {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.4 + Math.random() * 0.6, 0.028, 0.02),
        lineMat
      );
      line.position.set(-0.3 + Math.random() * 0.2, 1.62 + y, -0.04);
      deskGroup.add(line);
    });

    // Keyboard
    const kbGeo = new THREE.BoxGeometry(1.1, 0.04, 0.42);
    const kb    = new THREE.Mesh(kbGeo, this._mat(0x1a1a1a));
    kb.position.set(0, 0.82, 0.5);
    deskGroup.add(kb);

    // Coffee mug
    const mugGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.22, 8);
    const mug    = new THREE.Mesh(mugGeo, this._mat(0x0066FF));
    mug.position.set(1.1, 0.92, 0.1);
    deskGroup.add(mug);

    // Screen point light
    const screenLight = new THREE.PointLight(0x0066FF, 2.5, 5);
    screenLight.position.set(0, 1.62, 0.3);
    deskGroup.add(screenLight);
    this.screenGlow = screenLight;

    deskGroup.position.set(-0.5, -0.5, 0);
    this.scene.add(deskGroup);
  }

  _buildParticles() {
    // Tiny floating code particles near screen
    const geo = new THREE.BufferGeometry();
    const count = 60;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 3;
      pos[i*3+1] = Math.random() * 3;
      pos[i*3+2] = (Math.random() - 0.5) * 2;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0x0066FF, size: 0.04, transparent: true, opacity: 0.7 });
    this.particleSystem = new THREE.Points(geo, mat);
    this.particleSystem.position.set(-0.5, -0.5, 0);
    this.scene.add(this.particleSystem);
  }

  _bindEvents() {
    window.addEventListener('mousemove', e => {
      this.mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
      this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    });
  }

  _animate() {
    const tick = () => {
      const t = this.clock.getElapsedTime();

      // Head follows mouse subtly
      if (this.head) {
        this.head.rotation.y = this.mouse.x * 0.25;
        this.head.rotation.x = -this.mouse.y * 0.12;
      }

      // Arms type (alternating bob)
      if (this.armL) this.armL.rotation.x = -0.55 + Math.sin(t * 4) * 0.12;
      if (this.armR) this.armR.rotation.x = -0.55 + Math.sin(t * 4 + Math.PI) * 0.12;

      // Group breathe (subtle bob)
      if (this.group) {
        this.group.position.y = -0.5 + Math.sin(t * 0.9) * 0.04;
        this.group.rotation.y = this.mouse.x * 0.08;
      }

      // Screen flicker
      if (this.screenGlow) {
        this.screenGlow.intensity = 2.2 + Math.sin(t * 7) * 0.3;
      }

      // Particle drift
      if (this.particleSystem) {
        this.particleSystem.rotation.y = t * 0.05;
        const positions = this.particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i+1] += 0.003;
          if (positions[i+1] > 3) positions[i+1] = 0;
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
      }

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(tick);
    };
    tick();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Small delay so canvas is sized
  setTimeout(() => {
    const char = new DevCharacter('three-canvas');
    char.init();
  }, 100);
});