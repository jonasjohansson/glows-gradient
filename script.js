import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm";

// Simple Diagonal Gradient Control System
class GradientController {
  constructor() {
    this.gradientOverlay = document.querySelector(".gradient-overlay");
    this.gradientBlend = document.querySelector(".gradient-overlay-blend");
    this.mainElement = document.querySelector("main");
    this.footerElement = document.querySelector("footer");
    this.bodyElement = document.body;

    // Create the data object that lil-gui will control
    this.params = {
      // Gradient Colors (HSL format for organic blobby gradient)
      startHue: 15, // Dark reddish-brown (bottom)
      startSaturation: 60,
      startLightness: 25,
      startOpacity: 0.9,
      midHue: 30, // Muted orange-red (middle)
      midSaturation: 75,
      midLightness: 55,
      midOpacity: 0.8,
      endHue: 280, // Cool purple (top)
      endSaturation: 65,
      endLightness: 70,
      endOpacity: 0.7,

      // Gradient Properties
      colorSteps: 15, // Number of gradient layers
      containerWidth: 60, // Container width in vw
      containerHeight: 20, // Container height in vh
      positionX: 0, // X offset in %
      positionY: 0, // Y offset in %
      organicRandomness: 0.6, // How organic/random the shapes are (0-1)

      // Animation
      animateGradient: true,
      animationSpeed: 12,

      // SVG Noise Filter
      noiseOpacity: 0,
      noiseColor: "#191919", // Match main background color
      noiseBaseFrequency: 1.2, // Base frequency of noise
      noiseOctaves: 4, // Number of noise octaves
      noiseType: "fractalNoise", // Type of noise

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
    this.updateGradient();
    this.updateGrain();
  }

  setupGUI() {
    // Create the GUI
    this.gui = new GUI();
    this.gui.title("Gradient Controls");

    // Position the GUI on the left side
    this.gui.domElement.style.position = "fixed";
    this.gui.domElement.style.top = "20px";
    this.gui.domElement.style.left = "20px";
    this.gui.domElement.style.right = "auto";
    this.gui.domElement.style.zIndex = "1000";

    // Start Color Folder
    const startFolder = this.gui.addFolder("Start Color");
    startFolder
      .add(this.params, "startHue", 0, 360)
      .name("Hue")
      .onChange(() => this.updateGradient());
    startFolder
      .add(this.params, "startSaturation", 0, 100)
      .name("Saturation")
      .onChange(() => this.updateGradient());
    startFolder
      .add(this.params, "startLightness", 0, 100)
      .name("Lightness")
      .onChange(() => this.updateGradient());
    startFolder
      .add(this.params, "startOpacity", 0, 1)
      .name("Opacity")
      .onChange(() => this.updateGradient());
    startFolder.open();

    // Middle Color Folder
    const midFolder = this.gui.addFolder("Middle Color");
    midFolder
      .add(this.params, "midHue", 0, 360)
      .name("Hue")
      .onChange(() => this.updateGradient());
    midFolder
      .add(this.params, "midSaturation", 0, 100)
      .name("Saturation")
      .onChange(() => this.updateGradient());
    midFolder
      .add(this.params, "midLightness", 0, 100)
      .name("Lightness")
      .onChange(() => this.updateGradient());
    midFolder
      .add(this.params, "midOpacity", 0, 1)
      .name("Opacity")
      .onChange(() => this.updateGradient());
    midFolder.open();

    // End Color Folder
    const endFolder = this.gui.addFolder("End Color");
    endFolder
      .add(this.params, "endHue", 0, 360)
      .name("Hue")
      .onChange(() => this.updateGradient());
    endFolder
      .add(this.params, "endSaturation", 0, 100)
      .name("Saturation")
      .onChange(() => this.updateGradient());
    endFolder
      .add(this.params, "endLightness", 0, 100)
      .name("Lightness")
      .onChange(() => this.updateGradient());
    endFolder
      .add(this.params, "endOpacity", 0, 1)
      .name("Opacity")
      .onChange(() => this.updateGradient());
    endFolder.open();

    // Gradient Properties Folder
    const propertiesFolder = this.gui.addFolder("Gradient Properties");
    propertiesFolder
      .add(this.params, "colorSteps", 3, 20)
      .name("Gradient Layers")
      .onChange(() => this.updateGradient());
    propertiesFolder
      .add(this.params, "containerWidth", 0, 100)
      .name("Width (vw)")
      .onChange(() => this.updateContainerSize());
    propertiesFolder
      .add(this.params, "containerHeight", 0, 100)
      .name("Height (vh)")
      .onChange(() => this.updateContainerSize());
    propertiesFolder
      .add(this.params, "positionX", -50, 50)
      .name("Position X (%)")
      .onChange(() => this.updateGradient());
    propertiesFolder
      .add(this.params, "positionY", -50, 50)
      .name("Position Y (%)")
      .onChange(() => this.updateGradient());
    propertiesFolder
      .add(this.params, "organicRandomness", 0, 1)
      .name("Organic Randomness")
      .onChange(() => this.updateGradient());
    propertiesFolder.open();

    // Animation Folder
    const animationFolder = this.gui.addFolder("Animation");
    animationFolder
      .add(this.params, "animateGradient")
      .name("Enable Animation")
      .onChange(() => this.updateAnimation());
    animationFolder
      .add(this.params, "animationSpeed", 1, 30)
      .name("Speed (s)")
      .onChange(() => this.updateAnimation());
    animationFolder.open();

    // SVG Noise Filter Folder
    const noiseFolder = this.gui.addFolder("SVG Noise Filter");
    noiseFolder
      .add(this.params, "noiseOpacity", 0, 1)
      .name("Noise Opacity")
      .onChange(() => this.updateGrain());
    noiseFolder
      .addColor(this.params, "noiseColor")
      .name("Noise Color")
      .onChange(() => this.updateGrain());
    noiseFolder
      .add(this.params, "noiseBaseFrequency", 0.1, 3)
      .name("Base Frequency")
      .onChange(() => this.updateGrain());
    noiseFolder
      .add(this.params, "noiseOctaves", 1, 8)
      .name("Octaves")
      .onChange(() => this.updateGrain());
    noiseFolder
      .add(this.params, "noiseType", ["fractalNoise", "turbulence"])
      .name("Noise Type")
      .onChange(() => this.updateGrain());
    noiseFolder.open();

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

  updateContainerSize() {
    const { containerWidth, containerHeight } = this.params;
    const container = document.querySelector(".gradient-container");
    container.style.width = `${containerWidth}vw`;
    container.style.height = `${containerHeight}vh`;
  }

  updateGradient() {
    const {
      startHue,
      startSaturation,
      startLightness,
      startOpacity,
      midHue,
      midSaturation,
      midLightness,
      midOpacity,
      endHue,
      endSaturation,
      endLightness,
      endOpacity,
      colorSteps,
      positionX,
      positionY,
      organicRandomness,
    } = this.params;

    // Generate organic radial gradients with distinct color steps
    let gradients = [];

    // Create multiple overlapping radial gradients for organic, blobby effect
    const numGradients = Math.max(6, Math.floor(colorSteps / 2));

    // Define distinct color steps matching the image
    const distinctColors = [
      { hue: 15, saturation: 60, lightness: 25, opacity: 0.9 }, // Dark reddish-brown (bottom)
      { hue: 20, saturation: 70, lightness: 35, opacity: 0.85 }, // Rich reddish-brown
      { hue: 25, saturation: 80, lightness: 45, opacity: 0.8 }, // Warm terracotta
      { hue: 30, saturation: 75, lightness: 55, opacity: 0.75 }, // Muted orange-red
      { hue: 35, saturation: 70, lightness: 65, opacity: 0.7 }, // Dusty rose
      { hue: 280, saturation: 65, lightness: 70, opacity: 0.65 }, // Cool purple
      { hue: 285, saturation: 60, lightness: 75, opacity: 0.6 }, // Light purple
      { hue: 290, saturation: 55, lightness: 80, opacity: 0.55 }, // Very light purple
    ];

    // Create unique random colors for each gradient layer using GUI parameters
    const layerColors = [];
    for (let i = 0; i < numGradients; i++) {
      // Interpolate between the three main colors based on layer position
      const progress = i / (numGradients - 1);
      let baseHue, baseSaturation, baseLightness, baseOpacity;

      if (progress < 0.5) {
        // Interpolate from start to middle
        const t = progress * 2;
        baseHue = startHue + (midHue - startHue) * t;
        baseSaturation = startSaturation + (midSaturation - startSaturation) * t;
        baseLightness = startLightness + (midLightness - startLightness) * t;
        baseOpacity = startOpacity + (midOpacity - startOpacity) * t;
      } else {
        // Interpolate from middle to end
        const t = (progress - 0.5) * 2;
        baseHue = midHue + (endHue - midHue) * t;
        baseSaturation = midSaturation + (endSaturation - midSaturation) * t;
        baseLightness = midLightness + (endLightness - midLightness) * t;
        baseOpacity = midOpacity + (endOpacity - midOpacity) * t;
      }

      // Fixed random variations per layer (using layer index as seed)
      const seed = i * 123.456; // Use layer index as seed for consistent randomness
      const hueVariation = (Math.sin(seed) * 0.5 + 0.5) * 40 - 20; // ±20 degrees
      const saturationVariation = (Math.cos(seed * 1.3) * 0.5 + 0.5) * 30 - 15; // ±15%
      const lightnessVariation = (Math.sin(seed * 0.7) * 0.5 + 0.5) * 20 - 10; // ±10%
      const opacityVariation = (Math.cos(seed * 2.1) * 0.5 + 0.5) * 0.2 - 0.1; // ±0.1

      layerColors.push({
        hue: Math.max(0, Math.min(360, baseHue + hueVariation)),
        saturation: Math.max(0, Math.min(100, baseSaturation + saturationVariation)),
        lightness: Math.max(0, Math.min(100, baseLightness + lightnessVariation)),
        opacity: Math.max(0, Math.min(1, baseOpacity + opacityVariation)),
      });
    }

    for (let i = 0; i < numGradients; i++) {
      // Use the pre-generated unique colors for each layer
      const color = layerColors[i];
      const hue = color.hue;
      const saturation = color.saturation;
      const lightness = color.lightness;
      const opacity = color.opacity;

      // Create organic shapes with randomness and position controls
      const basePositions = [
        { x: 70, y: 20, w: 120, h: 80, fade: 60 }, // Main blob
        { x: 80, y: 15, w: 100, h: 70, fade: 55 }, // Secondary blob
        { x: 60, y: 18, w: 90, h: 90, fade: 50 }, // Left extension
        { x: 75, y: 25, w: 80, h: 60, fade: 45 }, // Center detail
        { x: 85, y: 10, w: 110, h: 70, fade: 40 }, // Top extension
        { x: 70, y: 30, w: 85, h: 80, fade: 35 }, // Bottom detail
        { x: 65, y: 12, w: 70, h: 85, fade: 30 }, // Left edge
        { x: 90, y: 20, w: 95, h: 55, fade: 25 }, // Right edge
        { x: 75, y: 35, w: 60, h: 70, fade: 20 }, // Bottom left
        { x: 85, y: 8, w: 100, h: 50, fade: 15 }, // Top right
      ];

      const basePos = basePositions[i % basePositions.length];

      // Add organic randomness
      const randomX = (Math.random() - 0.5) * organicRandomness * 20;
      const randomY = (Math.random() - 0.5) * organicRandomness * 20;
      const randomW = (Math.random() - 0.5) * organicRandomness * 40;
      const randomH = (Math.random() - 0.5) * organicRandomness * 40;

      // Apply position offset and randomness
      const x = Math.max(0, Math.min(100, basePos.x + positionX + randomX));
      const y = Math.max(0, Math.min(100, basePos.y + positionY + randomY));
      const w = Math.max(20, basePos.w + randomW);
      const h = Math.max(20, basePos.h + randomH);

      const fadeDistance = basePos.fade * (opacity * 0.8 + 0.2);

      gradients.push(
        `radial-gradient(ellipse ${w}% ${h}% at ${x}% ${y}%, hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity}) 0%, transparent ${fadeDistance}%)`
      );
    }

    // No background gradients - let it fade to full transparency

    const gradient = gradients.join(", ");
    this.gradientOverlay.style.background = gradient;
  }

  updateAnimation() {
    const { animateGradient, animationSpeed } = this.params;

    // Remove existing animations
    this.gradientOverlay.style.animation = "none";

    if (animateGradient) {
      // Only animate shape movement, not colors
      this.gradientOverlay.style.animation = `organic-displace ${animationSpeed}s ease-in-out infinite`;
    }
  }

  updateGrain() {
    const { noiseOpacity, noiseColor, noiseBaseFrequency, noiseOctaves, noiseType } = this.params;

    // Update the ::before pseudo-element styles using CSS custom properties
    this.gradientOverlay.style.setProperty("--noise-opacity", noiseOpacity);
    this.gradientOverlay.style.setProperty("--noise-color", noiseColor);

    // Update the SVG filter dynamically
    this.updateSVGFilter(noiseBaseFrequency, noiseOctaves, noiseType);
  }

  updateSVGFilter(baseFrequency, octaves, type) {
    // Find or create the SVG filter element
    let svgFilter = document.querySelector("#noiseFilter");
    if (!svgFilter) {
      // Create SVG element if it doesn't exist
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.style.position = "absolute";
      svg.style.width = "0";
      svg.style.height = "0";
      svg.style.visibility = "hidden";

      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      svg.appendChild(defs);

      svgFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
      svgFilter.setAttribute("id", "noiseFilter");
      defs.appendChild(svgFilter);

      document.body.appendChild(svg);
    }

    // Clear existing filter content
    svgFilter.innerHTML = "";

    // Create feTurbulence element
    const feTurbulence = document.createElementNS("http://www.w3.org/2000/svg", "feTurbulence");
    feTurbulence.setAttribute("type", type);
    feTurbulence.setAttribute("baseFrequency", baseFrequency);
    feTurbulence.setAttribute("numOctaves", octaves);
    feTurbulence.setAttribute("stitchTiles", "stitch");

    // Create feColorMatrix element to convert noise to grayscale
    const feColorMatrix = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
    feColorMatrix.setAttribute("in", "colorNoise");
    feColorMatrix.setAttribute("type", "saturate");
    feColorMatrix.setAttribute("values", "0");

    // Create feComposite element to mask the noise
    const feComposite = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
    feComposite.setAttribute("operator", "in");
    feComposite.setAttribute("in2", "SourceGraphic");
    feComposite.setAttribute("result", "monoNoise");

    // Create feBlend element with multiply mode for darker noise
    const feBlend = document.createElementNS("http://www.w3.org/2000/svg", "feBlend");
    feBlend.setAttribute("in", "SourceGraphic");
    feBlend.setAttribute("in2", "monoNoise");
    feBlend.setAttribute("mode", "multiply");

    // Append all elements to filter
    svgFilter.appendChild(feTurbulence);
    svgFilter.appendChild(feColorMatrix);
    svgFilter.appendChild(feComposite);
    svgFilter.appendChild(feBlend);
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
        startHue: 15, // Very dark reddish-brown (bottom)
        startSaturation: 30,
        startLightness: 15,
        startOpacity: 0.9,
        midHue: 30, // Muted orange-red (middle)
        midSaturation: 45,
        midLightness: 45,
        midOpacity: 0.8,
        endHue: 280, // Cool purple/lavender (top)
        endSaturation: 35,
        endLightness: 60,
        endOpacity: 0.7,
        colorSteps: 15,
        containerWidth: 60,
        containerHeight: 20,
        positionX: 0,
        positionY: 0,
        organicRandomness: 0.6,
        noiseOpacity: 0,
        noiseColor: "#191919",
        noiseBaseFrequency: 1.2,
        noiseOctaves: 4,
        noiseType: "fractalNoise",
        mainBg: "#191919",
        footerBg: "#0f0f0f",
        textColor: "#f7f7f7",
      },
      sunset: {
        startHue: 0,
        startSaturation: 0,
        startLightness: 5,
        startOpacity: 1,
        midHue: 25,
        midSaturation: 90,
        midLightness: 25,
        midOpacity: 0.8,
        endHue: 45,
        endSaturation: 85,
        endLightness: 60,
        endOpacity: 0.3,
        colorSteps: 12,
        containerWidth: 70,
        containerHeight: 25,
        noiseOpacity: 0.7,
        noiseColor: "#2D1B1B",
        noiseBaseFrequency: 0.8,
        noiseOctaves: 3,
        noiseType: "fractalNoise",
        mainBg: "#2D1B1B",
        footerBg: "#1A0F0F",
        textColor: "#FFF8DC",
      },
      ocean: {
        startHue: 200,
        startSaturation: 0,
        startLightness: 5,
        startOpacity: 1,
        midHue: 200,
        midSaturation: 60,
        midLightness: 20,
        midOpacity: 0.7,
        endHue: 220,
        endSaturation: 85,
        endLightness: 70,
        endOpacity: 0.2,
        colorSteps: 15,
        containerWidth: 60,
        containerHeight: 20,
        positionX: 0,
        positionY: 0,
        organicRandomness: 0.7,
        noiseOpacity: 0,
        noiseColor: "#0F1B2E",
        mainBg: "#0F1B2E",
        footerBg: "#0A0F1A",
        textColor: "#E6F3FF",
      },
      fire: {
        startHue: 0,
        startSaturation: 0,
        startLightness: 5,
        startOpacity: 1,
        midHue: 15,
        midSaturation: 90,
        midLightness: 30,
        midOpacity: 0.8,
        endHue: 60,
        endSaturation: 85,
        endLightness: 80,
        endOpacity: 0.3,
        colorSteps: 12,
        containerWidth: 80,
        containerHeight: 30,
        noiseOpacity: 0,
        noiseColor: "#2D1B1B",
        noiseBaseFrequency: 2.0,
        noiseOctaves: 6,
        noiseType: "turbulence",
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
    this.updateAnimation();
    this.updateGrain();
  }
}

// Initialize the gradient controller when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new GradientController();
});
