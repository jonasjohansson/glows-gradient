import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm";

class GradientBubblesController {
  constructor() {
    this.params = {
      // Background - pure black
      backgroundColor: "#000000",

      // Multiple gradient layers (matching reference image)
      layer1Color: "#C85032", // Warm terracotta (top-right)
      layer2Color: "#8B1E3F", // Deep red-purple (middle)
      layer3Color: "#4A1A5C", // Dark purple (bottom-left)
      layer4Color: "#2D1B69", // Very dark purple (fade edge)

      // Blending modes for each layer
      layer1Blend: "normal",
      layer2Blend: "multiply",
      layer3Blend: "screen",
      layer4Blend: "overlay",

      // Layer opacities
      layer1Opacity: 0.9,
      layer2Opacity: 0.7,
      layer3Opacity: 0.6,
      layer4Opacity: 0.4,

      // Visual effects
      size: 70,
      opacity: 0.8,
      blur: 30,

      // Position and Scale
      positionX: 50,
      positionY: -30,
      scaleX: 1.2,
      scaleY: 0.9,

      // Noise/Grain effects
      noiseEnabled: true,
      noiseOpacity: 0.4,
      noiseScale: 1.2,
      noiseContrast: 180,
      noiseBrightness: 250,
      noiseFrequency: 0.8,
      noiseOctaves: 3,
      noiseSeed: 1,
      grainIntensity: 0.6,
      grainSize: 1.0,

      // Animation
      animationSpeed: 1.0,
    };

    this.setupGUI();
    this.updateBackground();
    this.updateColors();
    this.updateEffects();
    this.updateAnimations();
    this.updatePositionAndScale();
    this.updateNoise();

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

    // Colors folder
    const colorsFolder = this.gui.addFolder("Colors");
    colorsFolder
      .addColor(this.params, "backgroundColor")
      .name("Background")
      .onChange(() => this.updateBackground());

    // Layer 1
    const layer1Folder = colorsFolder.addFolder("Layer 1 (Top-Right)");
    layer1Folder
      .addColor(this.params, "layer1Color")
      .name("Color")
      .onChange(() => this.updateColors());
    layer1Folder
      .add(this.params, "layer1Opacity", 0, 1)
      .name("Opacity")
      .onChange(() => this.updateColors());
    layer1Folder
      .add(this.params, "layer1Blend", {
        Normal: "normal",
        Multiply: "multiply",
        Screen: "screen",
        Overlay: "overlay",
        "Soft Light": "soft-light",
        "Hard Light": "hard-light",
      })
      .name("Blend Mode")
      .onChange(() => this.updateColors());

    // Layer 2
    const layer2Folder = colorsFolder.addFolder("Layer 2 (Middle)");
    layer2Folder
      .addColor(this.params, "layer2Color")
      .name("Color")
      .onChange(() => this.updateColors());
    layer2Folder
      .add(this.params, "layer2Opacity", 0, 1)
      .name("Opacity")
      .onChange(() => this.updateColors());
    layer2Folder
      .add(this.params, "layer2Blend", {
        Normal: "normal",
        Multiply: "multiply",
        Screen: "screen",
        Overlay: "overlay",
        "Soft Light": "soft-light",
        "Hard Light": "hard-light",
      })
      .name("Blend Mode")
      .onChange(() => this.updateColors());

    // Layer 3
    const layer3Folder = colorsFolder.addFolder("Layer 3 (Bottom-Left)");
    layer3Folder
      .addColor(this.params, "layer3Color")
      .name("Color")
      .onChange(() => this.updateColors());
    layer3Folder
      .add(this.params, "layer3Opacity", 0, 1)
      .name("Opacity")
      .onChange(() => this.updateColors());
    layer3Folder
      .add(this.params, "layer3Blend", {
        Normal: "normal",
        Multiply: "multiply",
        Screen: "screen",
        Overlay: "overlay",
        "Soft Light": "soft-light",
        "Hard Light": "hard-light",
      })
      .name("Blend Mode")
      .onChange(() => this.updateColors());

    // Layer 4
    const layer4Folder = colorsFolder.addFolder("Layer 4 (Fade Edge)");
    layer4Folder
      .addColor(this.params, "layer4Color")
      .name("Color")
      .onChange(() => this.updateColors());
    layer4Folder
      .add(this.params, "layer4Opacity", 0, 1)
      .name("Opacity")
      .onChange(() => this.updateColors());
    layer4Folder
      .add(this.params, "layer4Blend", {
        Normal: "normal",
        Multiply: "multiply",
        Screen: "screen",
        Overlay: "overlay",
        "Soft Light": "soft-light",
        "Hard Light": "hard-light",
      })
      .name("Blend Mode")
      .onChange(() => this.updateColors());

    // Visual Effects folder
    const effectsFolder = this.gui.addFolder("Visual Effects");
    effectsFolder
      .add(this.params, "size", 20, 120)
      .name("Size (%)")
      .onChange(() => this.updateEffects());
    effectsFolder
      .add(this.params, "opacity", 0, 1)
      .name("Opacity")
      .onChange(() => this.updateEffects());
    effectsFolder
      .add(this.params, "blur", 0, 60)
      .name("Blur")
      .onChange(() => this.updateEffects());

    // Position & Scale folder
    const transformFolder = this.gui.addFolder("Position & Scale");
    transformFolder
      .add(this.params, "positionX", -300, 300)
      .name("Position X")
      .onChange(() => this.updatePositionAndScale());
    transformFolder
      .add(this.params, "positionY", -300, 300)
      .name("Position Y")
      .onChange(() => this.updatePositionAndScale());
    transformFolder
      .add(this.params, "scaleX", 0.1, 3.0)
      .name("Scale X")
      .onChange(() => this.updatePositionAndScale());
    transformFolder
      .add(this.params, "scaleY", 0.1, 3.0)
      .name("Scale Y")
      .onChange(() => this.updatePositionAndScale());

    // Noise folder
    const noiseFolder = this.gui.addFolder("Noise & Grain");
    noiseFolder
      .add(this.params, "noiseEnabled")
      .name("Enable Noise")
      .onChange(() => this.updateNoise());
    noiseFolder
      .add(this.params, "noiseOpacity", 0, 1)
      .name("Noise Opacity")
      .onChange(() => this.updateNoise());
    noiseFolder
      .add(this.params, "noiseScale", 0.1, 3.0)
      .name("Noise Scale")
      .onChange(() => this.updateNoise());
    noiseFolder
      .add(this.params, "noiseContrast", 50, 300)
      .name("Noise Contrast")
      .onChange(() => this.updateNoise());
    noiseFolder
      .add(this.params, "noiseBrightness", 50, 500)
      .name("Noise Brightness")
      .onChange(() => this.updateNoise());
    noiseFolder
      .add(this.params, "noiseFrequency", 0.1, 2.0)
      .name("Noise Frequency")
      .onChange(() => this.updateNoise());
    noiseFolder
      .add(this.params, "noiseOctaves", 1, 6)
      .name("Noise Octaves")
      .onChange(() => this.updateNoise());
    noiseFolder
      .add(this.params, "noiseSeed", 1, 10)
      .name("Noise Seed")
      .onChange(() => this.updateNoise());
    noiseFolder
      .add(this.params, "grainIntensity", 0, 1)
      .name("Grain Intensity")
      .onChange(() => this.updateNoise());
    noiseFolder
      .add(this.params, "grainSize", 0.1, 3.0)
      .name("Grain Size")
      .onChange(() => this.updateNoise());

    // Animation folder
    const animationFolder = this.gui.addFolder("Animation");
    animationFolder
      .add(this.params, "animationSpeed", 0.1, 3.0)
      .name("Speed")
      .onChange(() => this.updateAnimations());
  }

  updateBackground() {
    document.documentElement.style.setProperty("--color-bg1", this.params.backgroundColor);
    document.documentElement.style.setProperty("--color-bg2", this.params.backgroundColor);
  }

  updateColors() {
    // Convert hex colors to RGB for each layer
    const layer1RGB = this.hexToRgb(this.params.layer1Color);
    const layer2RGB = this.hexToRgb(this.params.layer2Color);
    const layer3RGB = this.hexToRgb(this.params.layer3Color);
    const layer4RGB = this.hexToRgb(this.params.layer4Color);

    // Update CSS custom properties for each gradient element
    const gradients = document.querySelectorAll(".g1, .g2, .g3, .g4, .g5, .interactive");

    // Layer 1 - Top-right (g1, g2)
    gradients[0].style.background = `radial-gradient(circle at center, rgba(${layer1RGB.r}, ${layer1RGB.g}, ${layer1RGB.b}, ${this.params.layer1Opacity}) 0, rgba(${layer1RGB.r}, ${layer1RGB.g}, ${layer1RGB.b}, 0) 50%)`;
    gradients[0].style.mixBlendMode = this.params.layer1Blend;

    gradients[1].style.background = `radial-gradient(circle at center, rgba(${layer1RGB.r}, ${layer1RGB.g}, ${layer1RGB.b}, ${
      this.params.layer1Opacity * 0.8
    }) 0, rgba(${layer1RGB.r}, ${layer1RGB.g}, ${layer1RGB.b}, 0) 50%)`;
    gradients[1].style.mixBlendMode = this.params.layer1Blend;

    // Layer 2 - Middle (g3)
    gradients[2].style.background = `radial-gradient(circle at center, rgba(${layer2RGB.r}, ${layer2RGB.g}, ${layer2RGB.b}, ${this.params.layer2Opacity}) 0, rgba(${layer2RGB.r}, ${layer2RGB.g}, ${layer2RGB.b}, 0) 50%)`;
    gradients[2].style.mixBlendMode = this.params.layer2Blend;

    // Layer 3 - Bottom-left (g4)
    gradients[3].style.background = `radial-gradient(circle at center, rgba(${layer3RGB.r}, ${layer3RGB.g}, ${layer3RGB.b}, ${this.params.layer3Opacity}) 0, rgba(${layer3RGB.r}, ${layer3RGB.g}, ${layer3RGB.b}, 0) 50%)`;
    gradients[3].style.mixBlendMode = this.params.layer3Blend;

    // Layer 4 - Fade edge (g5)
    gradients[4].style.background = `radial-gradient(circle at center, rgba(${layer4RGB.r}, ${layer4RGB.g}, ${layer4RGB.b}, ${this.params.layer4Opacity}) 0, rgba(${layer4RGB.r}, ${layer4RGB.g}, ${layer4RGB.b}, 0) 50%)`;
    gradients[4].style.mixBlendMode = this.params.layer4Blend;

    // Interactive element uses layer 1 color
    gradients[5].style.background = `radial-gradient(circle at center, rgba(${layer1RGB.r}, ${layer1RGB.g}, ${layer1RGB.b}, ${
      this.params.layer1Opacity * 0.6
    }) 0, rgba(${layer1RGB.r}, ${layer1RGB.g}, ${layer1RGB.b}, 0) 50%)`;
    gradients[5].style.mixBlendMode = this.params.layer1Blend;
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

  updateEffects() {
    document.documentElement.style.setProperty("--circle-size", `${this.params.size}%`);

    // Update blur filter
    const gradientsContainer = document.querySelector(".gradients-container");
    if (gradientsContainer) {
      gradientsContainer.style.filter = `url(#goo) blur(${this.params.blur}px)`;
    }

    // Update opacity for all gradients
    const gradients = document.querySelectorAll(".g1, .g2, .g3, .g4, .g5, .interactive");
    gradients.forEach((gradient) => {
      gradient.style.opacity = this.params.opacity;
    });
  }

  updateAnimations() {
    // Update animation durations based on speed
    const gradients = document.querySelectorAll(".g1, .g2, .g3, .g4, .g5");
    const speeds = [30, 20, 40, 40, 20]; // Base durations

    gradients.forEach((gradient, index) => {
      const duration = speeds[index] / this.params.animationSpeed;
      let animationName = "";

      switch (index) {
        case 0:
          animationName = "moveVertical";
          break;
        case 1:
          animationName = "moveInCircle";
          gradient.style.animationDirection = "reverse";
          break;
        case 2:
          animationName = "moveInCircle";
          gradient.style.animationDirection = "normal";
          break;
        case 3:
          animationName = "moveHorizontal";
          break;
        case 4:
          animationName = "moveInCircle";
          gradient.style.animationDirection = "normal";
          break;
      }

      gradient.style.animation = `${animationName} ${duration}s ease infinite`;
    });

    // Update interactive element animation
    const interactive = document.querySelector(".interactive");
    if (interactive) {
      interactive.style.animation = `gentleFloat ${25 / this.params.animationSpeed}s ease-in-out infinite`;
    }
  }

  updatePositionAndScale() {
    const gradientsContainer = document.querySelector(".gradients-container");
    if (gradientsContainer) {
      gradientsContainer.style.transform = `translate(${this.params.positionX}px, ${this.params.positionY}px) scale(${this.params.scaleX}, ${this.params.scaleY})`;
    }
  }

  updateNoise() {
    const gradientsContainer = document.querySelector(".gradients-container");
    if (gradientsContainer) {
      if (this.params.noiseEnabled) {
        // Create a more sophisticated noise filter
        const noiseFilter = `
          url(#goo) 
          blur(${this.params.blur}px) 
          contrast(${this.params.noiseContrast}%) 
          brightness(${this.params.noiseBrightness}%) 
          saturate(${100 + this.params.grainIntensity * 50}%)
        `;

        gradientsContainer.style.filter = noiseFilter;
        gradientsContainer.style.opacity = this.params.noiseOpacity;

        // Update SVG noise filter parameters
        this.updateSVGNoiseFilter();
      } else {
        gradientsContainer.style.filter = `url(#goo) blur(${this.params.blur}px)`;
        gradientsContainer.style.opacity = 1;
      }
    }
  }

  updateSVGNoiseFilter() {
    // Update the SVG noise filter with new parameters
    const turbulence = document.querySelector("#goo feTurbulence");
    if (turbulence) {
      turbulence.setAttribute("baseFrequency", this.params.noiseFrequency);
      turbulence.setAttribute("numOctaves", Math.round(this.params.noiseOctaves));
      turbulence.setAttribute("seed", Math.round(this.params.noiseSeed));
    }

    // Update the color matrix for grain intensity
    const colorMatrix = document.querySelector("#goo feColorMatrix");
    if (colorMatrix) {
      const alpha = 18 + this.params.grainIntensity * 10;
      const offset = -8 - this.params.grainIntensity * 5;
      colorMatrix.setAttribute("values", `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${alpha} ${offset}`);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new GradientBubblesController();
});
