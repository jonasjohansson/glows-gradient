import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm";

class SVGGradientController {
  constructor() {
    this.params = {
      // Grain filter settings
      grainEnabled: true,
      grainFrequency: 0.713,
      grainOctaves: 4,
      grainScale: 0.1,
      grainOpacity: 0.6,

      // Global effects
      blurAmount: 4,
      dropShadow: false,
      shadowOpacity: 0.75,

      // Background
      backgroundColor: "#000000",

      // Grain settings
      grainColor: "#ffffff",

      // Gradient colors - matching warm to cool gradient
      gradient1Color1: "#FFD700", // Golden yellow (center)
      gradient1Color2: "#FF7F00", // Rich orange
      gradient1Color3: "#E91E63", // Magenta
      gradient1Color4: "#7B1FA2", // Purple
      // Per-gradient filters
      g1Brightness: 1.0,
      g1Contrast: 1.0,

      gradient2Color1: "#FF6600", // Vibrant orange (center)
      gradient2Color2: "#FF1493", // Pink/magenta
      gradient2Color3: "#9C27B0", // Purple
      g2Brightness: 1.0,
      g2Contrast: 1.0,

      gradient3Color1: "#FFC107", // Bright yellow (center)
      gradient3Color2: "#FF9800", // Orange
      gradient3Color3: "#E91E63", // Magenta
      g3Brightness: 1.0,
      g3Contrast: 1.0,

      // Shape geometry controls (percentages)
      s1_cx: 82,
      s1_cy: 18,
      s1_rx: 40,
      s1_ry: 32,

      s2_cx: 86,
      s2_cy: 16,
      s2_rx: 38,
      s2_ry: 34,

      s3_cx: 90,
      s3_cy: 13,
      s3_rx: 34,
      s3_ry: 28,

      // Animation
      animationSpeed: 1.0,
      animationEnabled: false,
      blobEnabled: true,
      blobSpeed: 0.35,
      blobPosAmplitude: 4,
      blobSizeAmplitude: 6,
      // Organic random motion
      organicJitter: true,
      jitterSeconds: 3,
      jitterTranslatePx: 90,
      jitterScaleMin: 0.92,
      jitterScaleMax: 1.08,
      jitterRotateDeg: 6,
    };

    this.setupGUI();
    this.updateGrainFilter();
    this.updateEffects();
    this.updateBackground();
    this.updateGrainColor();
    this.updateGradients();
    this.updateShapeFilters();
    this.updateShapeGeometry();
    this.updateJitter();
    this.initBlobMotion();

    // Position GUI on the left
    setTimeout(() => {
      this.gui.domElement.style.position = "fixed";
      this.gui.domElement.style.top = "20px";
      this.gui.domElement.style.left = "20px";
      this.gui.domElement.style.zIndex = "1000";
    }, 100);
  }

  setupGUI() {
    this.gui = new GUI();

    // Grain filter folder
    const grainFolder = this.gui.addFolder("Grain Filter");
    grainFolder
      .add(this.params, "grainEnabled")
      .name("Enable Grain")
      .onChange(() => this.updateGrainFilter());
    grainFolder
      .add(this.params, "grainFrequency", 0.1, 2.0)
      .name("Frequency")
      .onChange(() => this.updateGrainFilter());
    grainFolder
      .add(this.params, "grainOctaves", 1, 8)
      .name("Octaves")
      .onChange(() => this.updateGrainFilter());
    grainFolder
      .add(this.params, "grainScale", 0.01, 0.5)
      .name("Scale")
      .onChange(() => this.updateGrainFilter());
    grainFolder
      .add(this.params, "grainOpacity", 0, 1)
      .name("Opacity")
      .onChange(() => this.updateGrainColor());

    // Visual effects folder
    const effectsFolder = this.gui.addFolder("Visual Effects");
    effectsFolder
      .add(this.params, "blurAmount", 0, 20)
      .name("Blur Amount")
      .onChange(() => this.updateEffects());
    effectsFolder
      .add(this.params, "dropShadow")
      .name("Drop Shadow")
      .onChange(() => this.updateEffects());
    effectsFolder
      .add(this.params, "shadowOpacity", 0, 1)
      .name("Shadow Opacity")
      .onChange(() => this.updateEffects());

    // Background folder
    const bgFolder = this.gui.addFolder("Background");
    bgFolder
      .addColor(this.params, "backgroundColor")
      .name("Background Color")
      .onChange(() => this.updateBackground());
    bgFolder
      .addColor(this.params, "grainColor")
      .name("Grain Color")
      .onChange(() => this.updateGrainColor());

    // Gradient colors folder
    const gradientFolder = this.gui.addFolder("Gradient Colors");

    // Gradient 1 (main)
    const grad1Folder = gradientFolder.addFolder("Gradient 1 (Main)");
    grad1Folder
      .addColor(this.params, "gradient1Color1")
      .name("Center Color")
      .onChange(() => this.updateGradients());
    grad1Folder
      .addColor(this.params, "gradient1Color2")
      .name("Mid Color")
      .onChange(() => this.updateGradients());
    grad1Folder
      .addColor(this.params, "gradient1Color3")
      .name("Outer Color")
      .onChange(() => this.updateGradients());
    grad1Folder
      .addColor(this.params, "gradient1Color4")
      .name("Edge Color")
      .onChange(() => this.updateGradients());
    grad1Folder
      .add(this.params, "g1Brightness", 0.2, 2.5)
      .name("Brightness")
      .onChange(() => this.updateShapeFilters());
    grad1Folder
      .add(this.params, "g1Contrast", 0.2, 2.5)
      .name("Contrast")
      .onChange(() => this.updateShapeFilters());

    // Gradient 2
    const grad2Folder = gradientFolder.addFolder("Gradient 2");
    grad2Folder
      .addColor(this.params, "gradient2Color1")
      .name("Center Color")
      .onChange(() => this.updateGradients());
    grad2Folder
      .addColor(this.params, "gradient2Color2")
      .name("Mid Color")
      .onChange(() => this.updateGradients());
    grad2Folder
      .addColor(this.params, "gradient2Color3")
      .name("Outer Color")
      .onChange(() => this.updateGradients());
    grad2Folder
      .add(this.params, "g2Brightness", 0.2, 2.5)
      .name("Brightness")
      .onChange(() => this.updateShapeFilters());
    grad2Folder
      .add(this.params, "g2Contrast", 0.2, 2.5)
      .name("Contrast")
      .onChange(() => this.updateShapeFilters());

    // Gradient 3
    const grad3Folder = gradientFolder.addFolder("Gradient 3");
    grad3Folder
      .addColor(this.params, "gradient3Color1")
      .name("Center Color")
      .onChange(() => this.updateGradients());
    grad3Folder
      .addColor(this.params, "gradient3Color2")
      .name("Mid Color")
      .onChange(() => this.updateGradients());
    grad3Folder
      .addColor(this.params, "gradient3Color3")
      .name("Outer Color")
      .onChange(() => this.updateGradients());
    grad3Folder
      .add(this.params, "g3Brightness", 0.2, 2.5)
      .name("Brightness")
      .onChange(() => this.updateShapeFilters());
    grad3Folder
      .add(this.params, "g3Contrast", 0.2, 2.5)
      .name("Contrast")
      .onChange(() => this.updateShapeFilters());

    // Animation folder
    const animationFolder = this.gui.addFolder("Animation");
    animationFolder
      .add(this.params, "animationEnabled")
      .name("Enable Animation")
      .onChange(() => this.updateAnimation());
    animationFolder
      .add(this.params, "organicJitter")
      .name("Organic Jitter")
      .onChange(() => this.updateJitter());
    animationFolder
      .add(this.params, "jitterSeconds", 1, 10)
      .name("Jitter Every (s)")
      .onChange(() => this.updateJitter());
    animationFolder
      .add(this.params, "jitterTranslatePx", 10, 200)
      .name("Jitter Range (px)")
      .onChange(() => this.updateJitter());
    animationFolder
      .add(this.params, "animationSpeed", 0.1, 3.0)
      .name("Animation Speed")
      .onChange(() => this.updateAnimation());

    const blobFolder = this.gui.addFolder("Blob Motion");
    blobFolder
      .add(this.params, "blobEnabled")
      .name("Enable Blob")
      .onChange(() => this.toggleBlobMotion());
    blobFolder
      .add(this.params, "blobSpeed", 0.05, 1.5)
      .name("Speed")
      .onChange(() => this.resetBlobPhases());
    blobFolder
      .add(this.params, "blobPosAmplitude", 0, 15)
      .name("Pos Amp (%)")
      .onChange(() => this.resetBlobPhases());
    blobFolder
      .add(this.params, "blobSizeAmplitude", 0, 20)
      .name("Size Amp (%)")
      .onChange(() => this.resetBlobPhases());

    // Position & Size controls
    const s1Folder = this.gui.addFolder("Shape 1 Position & Size");
    s1Folder
      .add(this.params, "s1_cx", 0, 100)
      .name("CX (%)")
      .onChange(() => this.updateShapeGeometry());
    s1Folder
      .add(this.params, "s1_cy", 0, 100)
      .name("CY (%)")
      .onChange(() => this.updateShapeGeometry());
    s1Folder
      .add(this.params, "s1_rx", 1, 100)
      .name("RX (%)")
      .onChange(() => this.updateShapeGeometry());
    s1Folder
      .add(this.params, "s1_ry", 1, 100)
      .name("RY (%)")
      .onChange(() => this.updateShapeGeometry());

    const s2Folder = this.gui.addFolder("Shape 2 Position & Size");
    s2Folder
      .add(this.params, "s2_cx", 0, 100)
      .name("CX (%)")
      .onChange(() => this.updateShapeGeometry());
    s2Folder
      .add(this.params, "s2_cy", 0, 100)
      .name("CY (%)")
      .onChange(() => this.updateShapeGeometry());
    s2Folder
      .add(this.params, "s2_rx", 1, 100)
      .name("RX (%)")
      .onChange(() => this.updateShapeGeometry());
    s2Folder
      .add(this.params, "s2_ry", 1, 100)
      .name("RY (%)")
      .onChange(() => this.updateShapeGeometry());

    const s3Folder = this.gui.addFolder("Shape 3 Position & Size");
    s3Folder
      .add(this.params, "s3_cx", 0, 100)
      .name("CX (%)")
      .onChange(() => this.updateShapeGeometry());
    s3Folder
      .add(this.params, "s3_cy", 0, 100)
      .name("CY (%)")
      .onChange(() => this.updateShapeGeometry());
    s3Folder
      .add(this.params, "s3_rx", 1, 100)
      .name("RX (%)")
      .onChange(() => this.updateShapeGeometry());
    s3Folder
      .add(this.params, "s3_ry", 1, 100)
      .name("RY (%)")
      .onChange(() => this.updateShapeGeometry());

    // Presets not required for grad5 (removed)
  }

  updateGrainFilter() {
    const turbulence = document.querySelector("#grain feTurbulence");
    const displacementMap = document.querySelector("#grain feDisplacementMap");

    if (turbulence && displacementMap) {
      turbulence.setAttribute("baseFrequency", this.params.grainFrequency);
      turbulence.setAttribute("numOctaves", Math.round(this.params.grainOctaves));
      displacementMap.setAttribute("scale", this.params.grainScale);

      // Enable/disable grain filter
      const main = document.querySelector("main");
      if (this.params.grainEnabled) {
        main.style.filter = "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.75))";
      } else {
        main.style.filter = "none";
      }
    }
  }

  updateEffects() {
    const main = document.querySelector("main");
    this.updateShapeFilters();

    // Update drop shadow
    if (this.params.dropShadow) {
      main.style.filter = `drop-shadow(2px 2px 4px rgba(0, 0, 0, ${this.params.shadowOpacity}))`;
    } else {
      main.style.filter = "none";
    }
  }

  updateBackground() {
    document.documentElement.style.setProperty("--bg-color", this.params.backgroundColor);
  }

  updateGrainColor() {
    // Update grain filter to match background color
    const grainFilter = document.querySelector("#grain");
    if (grainFilter) {
      // Create a color matrix to tint the grain
      const rgb = this.hexToRgb(this.params.grainColor);
      const colorMatrix = document.querySelector("#grain feColorMatrix");
      if (colorMatrix) {
        // Set the color matrix to tint the grain and control its opacity (alpha row)
        const r = (rgb.r / 255).toFixed(4);
        const g = (rgb.g / 255).toFixed(4);
        const b = (rgb.b / 255).toFixed(4);
        const a = Math.max(0, Math.min(1, this.params.grainOpacity)).toFixed(4);
        colorMatrix.setAttribute("values", `${r} 0 0 0 0  0 ${g} 0 0 0  0 0 ${b} 0 0  0 0 0 ${a} 0`);
      }
    }
  }

  updateGradients() {
    // Update gradient 1 stops
    const grad1Stops = document.querySelectorAll("#g01 stop");
    if (grad1Stops.length >= 4) {
      grad1Stops[0].setAttribute("stop-color", this.params.gradient1Color1);
      grad1Stops[1].setAttribute("stop-color", this.params.gradient1Color2);
      grad1Stops[2].setAttribute("stop-color", this.params.gradient1Color3);
      grad1Stops[3].setAttribute("stop-color", this.params.gradient1Color4);
    }

    // Update gradient 2 stops
    const grad2Stops = document.querySelectorAll("#g02 stop");
    if (grad2Stops.length >= 3) {
      grad2Stops[0].setAttribute("stop-color", this.params.gradient2Color1);
      grad2Stops[1].setAttribute("stop-color", this.params.gradient2Color2);
      grad2Stops[2].setAttribute("stop-color", this.params.gradient2Color3);
    }

    // Update gradient 3 stops
    const grad3Stops = document.querySelectorAll("#g03 stop");
    if (grad3Stops.length >= 3) {
      grad3Stops[0].setAttribute("stop-color", this.params.gradient3Color1);
      grad3Stops[1].setAttribute("stop-color", this.params.gradient3Color2);
      grad3Stops[2].setAttribute("stop-color", this.params.gradient3Color3);
    }
  }

  updateShapeFilters() {
    const blur = `blur(calc(${this.params.blurAmount}vmin + ${this.params.blurAmount}vmax))`;
    const s1 = document.getElementById("shape1");
    const s2 = document.getElementById("shape2");
    const s3 = document.getElementById("shape3");
    if (s1) s1.style.filter = `url(#grain) ${blur} brightness(${this.params.g1Brightness}) contrast(${this.params.g1Contrast})`;
    if (s2) s2.style.filter = `url(#grain) ${blur} brightness(${this.params.g2Brightness}) contrast(${this.params.g2Contrast})`;
    if (s3) s3.style.filter = `url(#grain) ${blur} brightness(${this.params.g3Brightness}) contrast(${this.params.g3Contrast})`;
  }

  updateShapeGeometry() {
    const set = (id, cx, cy, rx, ry) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.setAttribute("cx", `${cx}%`);
      el.setAttribute("cy", `${cy}%`);
      el.setAttribute("rx", `${rx}%`);
      el.setAttribute("ry", `${ry}%`);
    };
    set("shape1", this.params.s1_cx, this.params.s1_cy, this.params.s1_rx, this.params.s1_ry);
    set("shape2", this.params.s2_cx, this.params.s2_cy, this.params.s2_rx, this.params.s2_ry);
    set("shape3", this.params.s3_cx, this.params.s3_cy, this.params.s3_rx, this.params.s3_ry);

    // Sync blob bases so animation centers around the new positions
    if (this._blob && this._blob.bases && this._blob.bases.length) {
      const upd = (idx, cx, cy, rx, ry) => {
        const b = this._blob.bases[idx];
        if (!b) return;
        b.cx = cx;
        b.cy = cy;
        b.rx = rx;
        b.ry = ry;
      };
      upd(0, this.params.s1_cx, this.params.s1_cy, this.params.s1_rx, this.params.s1_ry);
      upd(1, this.params.s2_cx, this.params.s2_cy, this.params.s2_rx, this.params.s2_ry);
      upd(2, this.params.s3_cx, this.params.s3_cy, this.params.s3_rx, this.params.s3_ry);
    }
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  updateAnimation() {
    // Disable old circular rotation; blob motion handles organic movement
    const shapes = document.querySelectorAll("ellipse, circle");
    shapes.forEach((shape) => {
      shape.style.animation = "none";
    });
  }

  updateJitter() {
    if (this._jitterTimer) {
      clearInterval(this._jitterTimer);
      this._jitterTimer = null;
    }
    if (!this.params.organicJitter) return;

    const shapes = [document.getElementById("shape1"), document.getElementById("shape2"), document.getElementById("shape3")].filter(
      Boolean
    );

    const applyRandom = () => {
      shapes.forEach((shape, i) => {
        const tx = (Math.random() * 2 - 1) * this.params.jitterTranslatePx;
        const ty = (Math.random() * 2 - 1) * this.params.jitterTranslatePx;
        const rot = (Math.random() * 2 - 1) * this.params.jitterRotateDeg;
        const scale = this.params.jitterScaleMin + Math.random() * (this.params.jitterScaleMax - this.params.jitterScaleMin);
        shape.style.transition = `transform ${this.params.jitterSeconds}s cubic-bezier(.65,.01,.24,1)`;
        shape.style.transform = `translate(${tx}%, ${ty}%) rotate(${rot}deg) scale(${scale})`;
      });
    };

    applyRandom();
    this._jitterTimer = setInterval(applyRandom, this.params.jitterSeconds * 1000);
  }

  // --- Blob motion (organic) ---
  initBlobMotion() {
    const ids = ["shape1", "shape2", "shape3"];
    this._blob = { bases: [], phases: [], raf: null, startTs: 0 };
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      this._blob.bases.push({
        el,
        cx: parseFloat(el.getAttribute("cx")) || 50,
        cy: parseFloat(el.getAttribute("cy")) || 50,
        rx: parseFloat(el.getAttribute("rx")) || 40,
        ry: parseFloat(el.getAttribute("ry")) || 30,
      });
      this._blob.phases.push({
        p1: Math.random() * Math.PI * 2,
        p2: Math.random() * Math.PI * 2,
        s1: Math.random() * Math.PI * 2,
        s2: Math.random() * Math.PI * 2,
      });
    });
    this.toggleBlobMotion();
  }

  resetBlobPhases() {
    if (!this._blob) return;
    this._blob.phases.forEach((ph) => {
      ph.p1 = Math.random() * Math.PI * 2;
      ph.p2 = Math.random() * Math.PI * 2;
      ph.s1 = Math.random() * Math.PI * 2;
      ph.s2 = Math.random() * Math.PI * 2;
    });
  }

  toggleBlobMotion() {
    if (!this._blob) return;
    if (this._blob.raf) {
      cancelAnimationFrame(this._blob.raf);
      this._blob.raf = null;
    }
    if (!this.params.blobEnabled) return;
    this._blob.startTs = performance.now();
    const loop = (ts) => {
      const t = (ts - this._blob.startTs) / 1000;
      const speed = this.params.blobSpeed;
      const posAmp = this.params.blobPosAmplitude;
      const sizeAmp = this.params.blobSizeAmplitude;
      this._blob.bases.forEach((b, i) => {
        const ph = this._blob.phases[i] || { p1: 0, p2: 0, s1: 0, s2: 0 };
        const px = Math.sin(t * speed * 0.8 + ph.p1) * 0.6 + Math.sin(t * speed * 1.3 + ph.p2) * 0.4;
        const py = Math.cos(t * speed * 0.7 + ph.p2) * 0.6 + Math.sin(t * speed * 1.1 + ph.p1) * 0.4;
        const sx = Math.sin(t * speed * 0.5 + ph.s1) * 0.6 + Math.cos(t * speed * 1.0 + ph.s2) * 0.4;
        const sy = Math.cos(t * speed * 0.6 + ph.s2) * 0.6 + Math.sin(t * speed * 1.2 + ph.s1) * 0.4;
        const cx = this._clamp01(b.cx + px * posAmp);
        const cy = this._clamp01(b.cy + py * posAmp);
        const rx = Math.max(1, b.rx + sx * sizeAmp);
        const ry = Math.max(1, b.ry + sy * sizeAmp);
        b.el.setAttribute("cx", `${cx}%`);
        b.el.setAttribute("cy", `${cy}%`);
        b.el.setAttribute("rx", `${rx}%`);
        b.el.setAttribute("ry", `${ry}%`);
      });
      this._blob.raf = requestAnimationFrame(loop);
    };
    this._blob.raf = requestAnimationFrame(loop);
  }

  _clamp01(v) {
    return Math.max(0, Math.min(100, v));
  }

  applyPreset(presetName) {
    const presets = {
      default: {
        grainEnabled: true,
        grainFrequency: 0.713,
        grainOctaves: 4,
        grainScale: 0.1,
        blurAmount: 4,
        dropShadow: false,
        shadowOpacity: 0.75,
        backgroundColor: "#000000",
        grainColor: "#000000",
        animationEnabled: true,
        animationSpeed: 1.0,
      },
      highContrast: {
        grainEnabled: true,
        grainFrequency: 1.2,
        grainOctaves: 6,
        grainScale: 0.2,
        blurAmount: 2,
        dropShadow: false,
        shadowOpacity: 0.9,
        backgroundColor: "#000000",
        grainColor: "#000000",
        animationEnabled: true,
        animationSpeed: 0.5,
      },
      subtleGrain: {
        grainEnabled: true,
        grainFrequency: 0.3,
        grainOctaves: 2,
        grainScale: 0.05,
        blurAmount: 8,
        dropShadow: false,
        shadowOpacity: 0.3,
        backgroundColor: "#f0f0f0",
        grainColor: "#f0f0f0",
        animationEnabled: false,
        animationSpeed: 1.0,
      },
      noGrain: {
        grainEnabled: false,
        grainFrequency: 0.713,
        grainOctaves: 4,
        grainScale: 0.1,
        blurAmount: 6,
        dropShadow: false,
        shadowOpacity: 0.5,
        backgroundColor: "#e0e0e0",
        grainColor: "#e0e0e0",
        animationEnabled: true,
        animationSpeed: 1.5,
      },
      minimal: {
        grainEnabled: true,
        grainFrequency: 0.5,
        grainOctaves: 3,
        grainScale: 0.08,
        blurAmount: 12,
        dropShadow: false,
        shadowOpacity: 0,
        backgroundColor: "#ffffff",
        grainColor: "#ffffff",
        animationEnabled: false,
        animationSpeed: 1.0,
      },
    };

    const preset = presets[presetName];
    if (preset) {
      Object.assign(this.params, preset);
      this.gui.controllersRecursive().forEach((controller) => {
        controller.updateDisplay();
      });
      this.updateGrainFilter();
      this.updateEffects();
      this.updateBackground();
      this.updateGrainColor();
      this.updateGradients();
      this.updateAnimation();
    }
  }
}

// Add CSS animation keyframes
const style = document.createElement("style");
style.textContent = `
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SVGGradientController();
});
