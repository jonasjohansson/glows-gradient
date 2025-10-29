import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm";

// Canvas-based Gradient Control System
class CanvasGradientController {
  constructor() {
    this.canvas = document.getElementById("mesh");
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();

    // Listen for window resize
    window.addEventListener("resize", () => this.resizeCanvas());

    this.mainElement = document.querySelector("main");
    this.footerElement = document.querySelector("footer");
    this.bodyElement = document.body;

    // Create the data object that lil-gui will control
    this.params = {
      // Gradient Colors (RGB values matching reference image)
      color1R: 255, // Warm reddish-orange (center)
      color1G: 120,
      color1B: 50,
      color2R: 200, // Vibrant orange (center-right)
      color2G: 80,
      color2B: 100,
      color3R: 100, // Deep purple (top-right)
      color3G: 50,
      color3B: 150,

      // Noise Properties
      noiseScale: 0.01,
      noiseAmplitude: 20,
      noiseSpeed: 0.0005,
      grainIntensity: 0.3,
      grainScale: 0.05,

      // Displacement Properties (disabled for performance)
      displacementStrength: 0,
      displacementSpeed: 0,

      // Animation
      animateGradient: true,
      animationSpeed: 1,

      // Background Colors
      mainBg: "#191919",
      footerBg: "#0f0f0f",
      textColor: "#f7f7f7",

      // Preset Functions
      resetPreset: () => this.applyPreset("reset"),
      sunsetPreset: () => this.applyPreset("sunset"),
      oceanPreset: () => this.applyPreset("ocean"),
      firePreset: () => this.applyPreset("fire"),
    };

    this.setupGUI();
    this.updateBackgrounds();
    this.updateTextColor();
    this.animate(0);
  }

  setupGUI() {
    // Create the GUI
    this.gui = new GUI();
    this.gui.title("Canvas Gradient Controls");

    // Position the GUI on the left side
    this.gui.domElement.style.position = "fixed";
    this.gui.domElement.style.top = "20px";
    this.gui.domElement.style.left = "20px";
    this.gui.domElement.style.right = "auto";
    this.gui.domElement.style.zIndex = "1000";

    // Gradient Colors Folder
    const gradientFolder = this.gui.addFolder("Gradient Colors");
    gradientFolder
      .add(this.params, "color1R", 0, 255)
      .name("Color 1 Red")
      .onChange(() => this.updateGradient());
    gradientFolder
      .add(this.params, "color1G", 0, 255)
      .name("Color 1 Green")
      .onChange(() => this.updateGradient());
    gradientFolder
      .add(this.params, "color1B", 0, 255)
      .name("Color 1 Blue")
      .onChange(() => this.updateGradient());
    gradientFolder
      .add(this.params, "color2R", 0, 255)
      .name("Color 2 Red")
      .onChange(() => this.updateGradient());
    gradientFolder
      .add(this.params, "color2G", 0, 255)
      .name("Color 2 Green")
      .onChange(() => this.updateGradient());
    gradientFolder
      .add(this.params, "color2B", 0, 255)
      .name("Color 2 Blue")
      .onChange(() => this.updateGradient());
    gradientFolder
      .add(this.params, "color3R", 0, 255)
      .name("Color 3 Red")
      .onChange(() => this.updateGradient());
    gradientFolder
      .add(this.params, "color3G", 0, 255)
      .name("Color 3 Green")
      .onChange(() => this.updateGradient());
    gradientFolder
      .add(this.params, "color3B", 0, 255)
      .name("Color 3 Blue")
      .onChange(() => this.updateGradient());
    gradientFolder.open();

    // Noise Properties Folder
    const noiseFolder = this.gui.addFolder("Noise Properties");
    noiseFolder
      .add(this.params, "noiseScale", 0.001, 0.05)
      .name("Noise Scale")
      .onChange(() => this.updateGradient());
    noiseFolder
      .add(this.params, "noiseAmplitude", 5, 50)
      .name("Noise Amplitude")
      .onChange(() => this.updateGradient());
    noiseFolder
      .add(this.params, "noiseSpeed", 0.0001, 0.002)
      .name("Noise Speed")
      .onChange(() => this.updateGradient());
    noiseFolder
      .add(this.params, "grainIntensity", 0, 1)
      .name("Grain Intensity")
      .onChange(() => this.updateGradient());
    noiseFolder
      .add(this.params, "grainScale", 0.01, 0.2)
      .name("Grain Scale")
      .onChange(() => this.updateGradient());
    noiseFolder
      .add(this.params, "displacementStrength", 0, 10)
      .name("Displacement Strength")
      .onChange(() => this.updateGradient());
    noiseFolder
      .add(this.params, "displacementSpeed", 0.0001, 0.005)
      .name("Displacement Speed")
      .onChange(() => this.updateGradient());
    noiseFolder.open();

    // Animation Folder
    const animationFolder = this.gui.addFolder("Animation");
    animationFolder
      .add(this.params, "animateGradient")
      .name("Enable Animation")
      .onChange(() => this.updateAnimation());
    animationFolder
      .add(this.params, "animationSpeed", 0.1, 3)
      .name("Speed")
      .onChange(() => this.updateAnimation());
    animationFolder.open();

    // Background Colors Folder
    const backgroundFolder = this.gui.addFolder("Background Colors");
    backgroundFolder
      .addColor(this.params, "mainBg")
      .name("Main Background")
      .onChange(() => this.updateBackgrounds());
    backgroundFolder
      .addColor(this.params, "footerBg")
      .name("Footer Background")
      .onChange(() => this.updateBackgrounds());
    backgroundFolder
      .addColor(this.params, "textColor")
      .name("Text Color")
      .onChange(() => this.updateTextColor());
    backgroundFolder.open();

    // Presets Folder
    const presetsFolder = this.gui.addFolder("Presets");
    presetsFolder.add(this.params, "resetPreset").name("Reset to Default");
    presetsFolder.add(this.params, "sunsetPreset").name("Sunset");
    presetsFolder.add(this.params, "oceanPreset").name("Ocean");
    presetsFolder.add(this.params, "firePreset").name("Fire");
    presetsFolder.open();
  }

  resizeCanvas() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
  }

  // Enhanced noise function with multiple octaves for grain
  noise(x, y, t) {
    const { noiseScale, noiseSpeed } = this.params;

    // Primary noise
    const n1 = Math.sin(x * noiseScale + t * noiseSpeed) + Math.cos(y * noiseScale + t * noiseSpeed * 0.6);

    // Secondary noise for grain
    const n2 = Math.sin(x * noiseScale * 2.3 + t * noiseSpeed * 1.4) + Math.cos(y * noiseScale * 1.7 + t * noiseSpeed * 0.8);

    // Tertiary noise for fine grain
    const n3 = Math.sin(x * noiseScale * 4.1 + t * noiseSpeed * 2.1) + Math.cos(y * noiseScale * 3.2 + t * noiseSpeed * 1.3);

    // Combine noise layers
    return n1 + n2 * 0.5 + n3 * 0.25;
  }

  draw(t) {
    // Create image data for pixel manipulation
    const img = this.ctx.createImageData(this.w, this.h);
    const data = img.data;

    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        // Simplified coordinates for better performance
        const yy = y;
        const xx = x;

        // Diagonal gradient sampling (adjusted for top-right positioning)
        // Since canvas is positioned top-right, we want the gradient to flow from bottom-left to top-right
        const diagonalRatio = (xx + (this.h - yy)) / (this.w + this.h);
        let r, g, b;

        if (diagonalRatio < 0.2) {
          // Bottom-left: Dark indigo/purple
          r = this.params.color3R;
          g = this.params.color3G;
          b = this.params.color3B;
        } else if (diagonalRatio < 0.6) {
          // Center: Vibrant violet/purple
          const t2 = (diagonalRatio - 0.2) / 0.4;
          r = this.params.color3R * (1 - t2) + this.params.color2R * t2;
          g = this.params.color3G * (1 - t2) + this.params.color2G * t2;
          b = this.params.color3B * (1 - t2) + this.params.color2B * t2;
        } else {
          // Top-right: Warm reddish-orange
          const t2 = (diagonalRatio - 0.6) / 0.4;
          r = this.params.color2R * (1 - t2) + this.params.color1R * t2;
          g = this.params.color2G * (1 - t2) + this.params.color1G * t2;
          b = this.params.color2B * (1 - t2) + this.params.color1B * t2;
        }

        // Calculate edge fade for complete transparency at edges
        const centerX = this.w / 2;
        const centerY = this.h / 2;
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
        const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const fadeFactor = Math.max(0, 1 - (distFromCenter / maxDist) * 2.0);

        // Apply grain effect to colors
        const grainNoise = this.noise(x * this.params.grainScale, y * this.params.grainScale, t);
        const grainEffect = grainNoise * this.params.grainIntensity;

        r = Math.max(0, Math.min(255, r + grainEffect * 50));
        g = Math.max(0, Math.min(255, g + grainEffect * 50));
        b = Math.max(0, Math.min(255, b + grainEffect * 50));

        const idx = (y * this.w + x) * 4;
        data[idx] = r; // Red
        data[idx + 1] = g; // Green
        data[idx + 2] = b; // Blue
        data[idx + 3] = Math.floor(255 * fadeFactor); // Alpha with edge fade
      }
    }

    this.ctx.putImageData(img, 0, 0);
  }

  animate(t) {
    if (this.params.animateGradient) {
      this.draw(t * this.params.animationSpeed);
    } else {
      this.draw(0);
    }
    requestAnimationFrame((time) => this.animate(time));
  }

  updateGradient() {
    // Trigger a redraw with current time
    this.draw(Date.now());
  }

  updateAnimation() {
    // Animation is handled in the animate loop
  }

  updateBackgrounds() {
    this.mainElement.style.backgroundColor = this.params.mainBg;
    this.footerElement.style.backgroundColor = this.params.footerBg;
  }

  updateTextColor() {
    this.bodyElement.style.color = this.params.textColor;
    this.mainElement.style.color = this.params.textColor;
    this.footerElement.style.color = this.params.textColor;
  }

  applyPreset(presetName) {
    const presets = {
      reset: {
        color1R: 255,
        color1G: 69,
        color1B: 0,
        color2R: 138,
        color2G: 43,
        color2B: 226,
        color3R: 25,
        color3G: 25,
        color3B: 55,
        noiseScale: 0.01,
        noiseAmplitude: 20,
        noiseSpeed: 0.0005,
        grainIntensity: 0.3,
        grainScale: 0.05,
        displacementStrength: 3,
        displacementSpeed: 0.002,
        mainBg: "#191919",
        footerBg: "#0f0f0f",
        textColor: "#f7f7f7",
      },
      sunset: {
        color1R: 255,
        color1G: 165,
        color1B: 0,
        color2R: 255,
        color2G: 69,
        color2B: 0,
        color3R: 139,
        color3G: 0,
        color3B: 0,
        noiseScale: 0.015,
        noiseAmplitude: 25,
        noiseSpeed: 0.0008,
        grainIntensity: 0.4,
        grainScale: 0.08,
        displacementStrength: 4,
        displacementSpeed: 0.003,
        mainBg: "#2D1B1B",
        footerBg: "#1A0F0F",
        textColor: "#FFF8DC",
      },
      ocean: {
        color1R: 135,
        color1G: 206,
        color1B: 235,
        color2R: 0,
        color2G: 191,
        color2B: 255,
        color3R: 0,
        color3G: 0,
        color3B: 139,
        noiseScale: 0.008,
        noiseAmplitude: 15,
        noiseSpeed: 0.0003,
        grainIntensity: 0.2,
        grainScale: 0.03,
        displacementStrength: 2,
        displacementSpeed: 0.001,
        mainBg: "#0F1B2E",
        footerBg: "#0A0F1A",
        textColor: "#E6F3FF",
      },
      fire: {
        color1R: 255,
        color1G: 215,
        color1B: 0,
        color2R: 255,
        color2G: 69,
        color2B: 0,
        color3R: 220,
        color3G: 20,
        color3B: 60,
        noiseScale: 0.012,
        noiseAmplitude: 30,
        noiseSpeed: 0.001,
        grainIntensity: 0.5,
        grainScale: 0.1,
        displacementStrength: 5,
        displacementSpeed: 0.004,
        mainBg: "#2D1B1B",
        footerBg: "#1A0F0F",
        textColor: "#FFF8DC",
      },
    };

    const preset = presets[presetName];
    if (!preset) return;

    // Apply preset values to params object
    Object.keys(preset).forEach((key) => {
      if (this.params.hasOwnProperty(key)) {
        this.params[key] = preset[key];
      }
    });

    // Update GUI to reflect new values
    this.gui.controllersRecursive().forEach((controller) => {
      controller.updateDisplay();
    });

    // Update all visual elements
    this.updateGradient();
    this.updateBackgrounds();
    this.updateTextColor();
  }
}

// Initialize the canvas gradient controller when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new CanvasGradientController();
});
