import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm";

class SVGGradientController {
  constructor() {
    this.params = {
      // Grain filter settings
      grainEnabled: true,
      grainFrequency: 0.713,
      grainOctaves: 4,
      grainScale: 0.1,

      // Global effects
      blurAmount: 4,
      dropShadow: false,
      shadowOpacity: 0.75,

      // Background
      backgroundColor: "#000000",

      // Grain settings
      grainColor: "#000000",

      // Gradient colors
      gradient1Color1: "#C85032", // Center color
      gradient1Color2: "#8B1E3F", // Mid color
      gradient1Color3: "#4A1A5C", // Outer color
      gradient1Color4: "#2D1B69", // Edge color

      gradient2Color1: "#D65A2A", // Center color
      gradient2Color2: "#A02A4A", // Mid color
      gradient2Color3: "#6B2A5A", // Outer color

      gradient3Color1: "#E85A1A", // Center color
      gradient3Color2: "#B8323A", // Mid color
      gradient3Color3: "#8B2A4A", // Outer color

      // Animation
      animationSpeed: 1.0,
      animationEnabled: true,
    };

    this.setupGUI();
    this.updateGrainFilter();
    this.updateEffects();
    this.updateBackground();
    this.updateGrainColor();
    this.updateGradients();

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

    // Animation folder
    const animationFolder = this.gui.addFolder("Animation");
    animationFolder
      .add(this.params, "animationEnabled")
      .name("Enable Animation")
      .onChange(() => this.updateAnimation());
    animationFolder
      .add(this.params, "animationSpeed", 0.1, 3.0)
      .name("Animation Speed")
      .onChange(() => this.updateAnimation());

    // Presets
    const presetsFolder = this.gui.addFolder("Presets");
    presetsFolder
      .add(this, "applyPreset", {
        Default: "default",
        "High Contrast": "highContrast",
        "Subtle Grain": "subtleGrain",
        "No Grain": "noGrain",
        Minimal: "minimal",
      })
      .name("Apply Preset");
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
    const ellipses = document.querySelectorAll("ellipse, circle");

    // Update blur amount
    ellipses.forEach((element) => {
      element.style.filter = `blur(calc(${this.params.blurAmount}vmin + ${this.params.blurAmount}vmax))`;
    });

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
        // Set the color matrix to tint the grain
        colorMatrix.setAttribute("values", `${rgb.r / 255} 0 0 0 0  0 ${rgb.g / 255} 0 0 0  0 0 ${rgb.b / 255} 0 0  0 0 0 1 0`);
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
    // Add subtle rotation animation to all shapes
    const shapes = document.querySelectorAll("ellipse, circle");

    shapes.forEach((shape) => {
      if (this.params.animationEnabled) {
        const duration = 20 / this.params.animationSpeed;
        shape.style.animation = `rotate ${duration}s linear infinite`;
      } else {
        shape.style.animation = "none";
      }
    });
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
