import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm";

class PNGGradientController {
  constructor() {
    this.gradientImage = document.getElementById("gradientImage");
    this.gui = new GUI();

    // Parameters for controlling the PNG gradient
    this.params = {
      // Position and Size
      positionX: 0,
      positionY: 0,
      scale: 1.0,
      width: 100,
      height: 50,

      // Visual Effects
      opacity: 1.0,
      brightness: 1.0,
      contrast: 1.0,
      saturation: 1.0,
      hue: 0,
      blur: 0,

      // Color Controls (like grad1.html)
      startHue: 15,
      startSaturation: 60,
      startLightness: 25,
      startOpacity: 0.9,
      midHue: 30,
      midSaturation: 75,
      midLightness: 55,
      midOpacity: 0,
      endHue: 280,
      endSaturation: 65,
      endLightness: 70,
      endOpacity: 0,

      // Color Overlay Controls
      colorOverlayIntensity: 1.0,
      colorOverlayBlendMode: "normal",

      // Animation
      animateFloat: false,
      animatePulse: true,
      animateShift: false,
      animateBlob: false,
      animateFlow: false,
      animateOrganic: true,
      animateHueCycle: false,
      animateHueWave: false,
      animateDisplace: false,
      animateTravelingDisplace: true,
      animationSpeed: 1.0,

      // SVG Displacement
      displacementScale: 0,
      displacementFrequency: 0.02,
      displacementOctaves: 3,
      displacementSeed: 1,

      // Traveling Displacement
      travelingDisplaceScale: 15,
      travelingDisplaceSpeed: 1.0,
      travelingDisplaceDirection: 1,

      // Background colors
      mainBg: "#191919",
      footerBg: "#0f0f0f",
      textColor: "#f7f7f7",

      // Presets
      preset: "default",
    };

    this.setupGUI();
    this.updateGradient();
    this.updateBackgrounds();
    this.updateTextColor();
    this.updateDisplacement();
    this.updateTravelingDisplacement();
    this.updateColorOverlay();

    // Position GUI on the left
    this.gui.domElement.style.position = "fixed";
    this.gui.domElement.style.top = "20px";
    this.gui.domElement.style.left = "20px";
    this.gui.domElement.style.zIndex = "1000";
  }

  setupGUI() {
    // Position and Size folder
    const positionFolder = this.gui.addFolder("Position & Size");
    positionFolder
      .add(this.params, "positionX", -50, 50)
      .name("Position X (%)")
      .onChange(() => this.updateGradient());
    positionFolder
      .add(this.params, "positionY", -50, 50)
      .name("Position Y (%)")
      .onChange(() => this.updateGradient());
    positionFolder
      .add(this.params, "scale", 0.5, 2.0)
      .name("Scale")
      .onChange(() => this.updateGradient());
    positionFolder
      .add(this.params, "width", 20, 100)
      .name("Width (%)")
      .onChange(() => this.updateGradient());
    positionFolder
      .add(this.params, "height", 10, 50)
      .name("Height (%)")
      .onChange(() => this.updateGradient());

    // Visual Effects folder
    const effectsFolder = this.gui.addFolder("Visual Effects");
    effectsFolder
      .add(this.params, "opacity", 0, 1)
      .name("Opacity")
      .onChange(() => this.updateGradient());
    effectsFolder
      .add(this.params, "brightness", 0.5, 2.0)
      .name("Brightness")
      .onChange(() => this.updateGradient());
    effectsFolder
      .add(this.params, "contrast", 0.5, 2.0)
      .name("Contrast")
      .onChange(() => this.updateGradient());
    effectsFolder
      .add(this.params, "saturation", 0, 2.0)
      .name("Saturation")
      .onChange(() => this.updateGradient());
    effectsFolder
      .add(this.params, "hue", -180, 180)
      .name("Hue Shift")
      .onChange(() => this.updateGradient());
    effectsFolder
      .add(this.params, "blur", 0, 10)
      .name("Blur")
      .onChange(() => this.updateGradient());

    // Color Controls folder (like grad1.html)
    const colorFolder = this.gui.addFolder("Color Controls");
    colorFolder
      .add(this.params, "startHue", 0, 360)
      .name("Start Hue")
      .onChange(() => this.updateColorOverlay());
    colorFolder
      .add(this.params, "startSaturation", 0, 100)
      .name("Start Saturation")
      .onChange(() => this.updateColorOverlay());
    colorFolder
      .add(this.params, "startLightness", 0, 100)
      .name("Start Lightness")
      .onChange(() => this.updateColorOverlay());
    colorFolder
      .add(this.params, "startOpacity", 0, 1)
      .name("Start Opacity")
      .onChange(() => this.updateColorOverlay());
    colorFolder
      .add(this.params, "midHue", 0, 360)
      .name("Middle Hue")
      .onChange(() => this.updateColorOverlay());
    colorFolder
      .add(this.params, "midSaturation", 0, 100)
      .name("Middle Saturation")
      .onChange(() => this.updateColorOverlay());
    colorFolder
      .add(this.params, "midLightness", 0, 100)
      .name("Middle Lightness")
      .onChange(() => this.updateColorOverlay());
    colorFolder
      .add(this.params, "midOpacity", 0, 1)
      .name("Middle Opacity")
      .onChange(() => this.updateColorOverlay());
    colorFolder
      .add(this.params, "endHue", 0, 360)
      .name("End Hue")
      .onChange(() => this.updateColorOverlay());
    colorFolder
      .add(this.params, "endSaturation", 0, 100)
      .name("End Saturation")
      .onChange(() => this.updateColorOverlay());
    colorFolder
      .add(this.params, "endLightness", 0, 100)
      .name("End Lightness")
      .onChange(() => this.updateColorOverlay());
    colorFolder
      .add(this.params, "endOpacity", 0, 1)
      .name("End Opacity")
      .onChange(() => this.updateColorOverlay());

    // Color Overlay Controls
    const overlayFolder = this.gui.addFolder("Color Overlay");
    overlayFolder
      .add(this.params, "colorOverlayIntensity", 0, 1)
      .name("Overlay Intensity")
      .onChange(() => this.updateColorOverlay());
    overlayFolder
      .add(this.params, "colorOverlayBlendMode", {
        Normal: "normal",
        Multiply: "multiply",
        Screen: "screen",
        Overlay: "overlay",
        "Soft Light": "soft-light",
        "Hard Light": "hard-light",
        "Color Dodge": "color-dodge",
        "Color Burn": "color-burn",
        "Linear Dodge": "linear-dodge",
        "Linear Burn": "linear-burn",
        "Vivid Light": "vivid-light",
        "Linear Light": "linear-light",
        "Pin Light": "pin-light",
        Difference: "difference",
        Exclusion: "exclusion",
        Hue: "hue",
        Saturation: "saturation",
        Color: "color",
        Luminosity: "luminosity",
      })
      .name("Blend Mode")
      .onChange(() => this.updateColorOverlay());

    // Animation folder
    const animationFolder = this.gui.addFolder("Animation");
    animationFolder
      .add(this.params, "animateFloat")
      .name("Float Animation")
      .onChange(() => this.updateAnimation());
    animationFolder
      .add(this.params, "animatePulse")
      .name("Pulse Animation")
      .onChange(() => this.updateAnimation());
    animationFolder
      .add(this.params, "animateShift")
      .name("Hue Shift Animation")
      .onChange(() => this.updateAnimation());
    animationFolder
      .add(this.params, "animateBlob")
      .name("Blob Shape Animation")
      .onChange(() => this.updateAnimation());
    animationFolder
      .add(this.params, "animateFlow")
      .name("Flow Animation")
      .onChange(() => this.updateAnimation());
    animationFolder
      .add(this.params, "animateOrganic")
      .name("Organic Movement")
      .onChange(() => this.updateAnimation());
    animationFolder
      .add(this.params, "animateHueCycle")
      .name("Hue Cycle (360°)")
      .onChange(() => this.updateAnimation());
    animationFolder
      .add(this.params, "animateHueWave")
      .name("Hue Wave (±30°)")
      .onChange(() => this.updateAnimation());
    animationFolder
      .add(this.params, "animateDisplace")
      .name("SVG Displacement")
      .onChange(() => this.updateAnimation());
    animationFolder
      .add(this.params, "animateTravelingDisplace")
      .name("Traveling Displacement")
      .onChange(() => this.updateAnimation());
    animationFolder
      .add(this.params, "animationSpeed", 0.1, 3.0)
      .name("Animation Speed")
      .onChange(() => this.updateAnimation());

    // SVG Displacement folder
    const displacementFolder = this.gui.addFolder("SVG Displacement");
    displacementFolder
      .add(this.params, "displacementScale", 0, 50)
      .name("Displacement Scale")
      .onChange(() => this.updateDisplacement());
    displacementFolder
      .add(this.params, "displacementFrequency", 0.001, 0.1)
      .name("Noise Frequency")
      .onChange(() => this.updateDisplacement());
    displacementFolder
      .add(this.params, "displacementOctaves", 1, 6)
      .name("Noise Octaves")
      .onChange(() => this.updateDisplacement());
    displacementFolder
      .add(this.params, "displacementSeed", 1, 10)
      .name("Noise Seed")
      .onChange(() => this.updateDisplacement());

    // Traveling Displacement folder
    const travelingFolder = this.gui.addFolder("Traveling Displacement");
    travelingFolder
      .add(this.params, "travelingDisplaceScale", 0, 50)
      .name("Displacement Scale")
      .onChange(() => this.updateTravelingDisplacement());
    travelingFolder
      .add(this.params, "travelingDisplaceSpeed", 0.1, 3.0)
      .name("Travel Speed")
      .onChange(() => this.updateTravelingDisplacement());
    travelingFolder
      .add(this.params, "travelingDisplaceDirection", { "Left to Right": 1, "Right to Left": -1, "Top to Bottom": 2, "Bottom to Top": -2 })
      .name("Direction")
      .onChange(() => this.updateTravelingDisplacement());

    // Background folder
    const backgroundFolder = this.gui.addFolder("Background");
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

    // Presets folder
    const presetsFolder = this.gui.addFolder("Presets");
    presetsFolder
      .add(this.params, "preset", {
        Default: "default",
        Subtle: "subtle",
        Vibrant: "vibrant",
        Dreamy: "dreamy",
        Minimal: "minimal",
      })
      .name("Preset")
      .onChange(() => this.applyPreset());

    presetsFolder.add({ reset: () => this.applyPreset("default") }, "reset").name("Reset to Default");
  }

  updateGradient() {
    const container = this.gradientImage.parentElement;

    // Update container size and position
    container.style.width = `${this.params.width}vw`;
    container.style.height = `${this.params.height}vh`;
    container.style.transform = `translate(${this.params.positionX}%, ${this.params.positionY}%)`;

    // Update image scale
    this.gradientImage.style.transform = `scale(${this.params.scale})`;

    // Create color overlay using CSS filters and pseudo-elements
    this.updateColorOverlay();

    // Update visual effects
    const filters = [];
    if (this.params.brightness !== 1) filters.push(`brightness(${this.params.brightness})`);
    if (this.params.contrast !== 1) filters.push(`contrast(${this.params.contrast})`);
    if (this.params.saturation !== 1) filters.push(`saturate(${this.params.saturation})`);
    if (this.params.hue !== 0) filters.push(`hue-rotate(${this.params.hue}deg)`);
    if (this.params.blur > 0) filters.push(`blur(${this.params.blur}px)`);

    this.gradientImage.style.filter = filters.join(" ");
    this.gradientImage.style.opacity = this.params.opacity;
  }

  updateColorOverlay() {
    // Create a color overlay using CSS custom properties
    const startColor = `hsla(${this.params.startHue}, ${this.params.startSaturation}%, ${this.params.startLightness}%, ${this.params.startOpacity})`;
    const midColor = `hsla(${this.params.midHue}, ${this.params.midSaturation}%, ${this.params.midLightness}%, ${this.params.midOpacity})`;
    const endColor = `hsla(${this.params.endHue}, ${this.params.endSaturation}%, ${this.params.endLightness}%, ${this.params.endOpacity})`;

    console.log("Color Overlay Update:", {
      startColor,
      midColor,
      endColor,
      intensity: this.params.colorOverlayIntensity,
      blendMode: this.params.colorOverlayBlendMode,
    });

    // Create or update a direct overlay div
    let overlayDiv = document.getElementById("color-overlay");
    if (!overlayDiv) {
      overlayDiv = document.createElement("div");
      overlayDiv.id = "color-overlay";
      overlayDiv.style.cssText = `
         position: absolute;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         pointer-events: none;
         z-index: 2;
       `;
      this.gradientImage.parentElement.appendChild(overlayDiv);
    }

    // Apply the gradient directly to the overlay div - starting from top-right
    overlayDiv.style.background = `radial-gradient(ellipse at top right, ${startColor} 0%, ${midColor} 40%, ${endColor} 70%, transparent 100%)`;
    overlayDiv.style.mixBlendMode = this.params.colorOverlayBlendMode;
    overlayDiv.style.opacity = this.params.colorOverlayIntensity;

    // Debug: Check if the element exists and has the pseudo-element
    console.log("Gradient Image Element:", this.gradientImage);
    console.log("Overlay Div:", overlayDiv);
  }

  updateAnimation() {
    // Remove existing animations
    this.gradientImage.style.animation = "none";

    const animations = [];

    if (this.params.animateFloat) {
      animations.push(`gradient-float ${4 / this.params.animationSpeed}s ease-in-out infinite`);
    }

    if (this.params.animatePulse) {
      animations.push(`gradient-pulse ${2 / this.params.animationSpeed}s ease-in-out infinite`);
    }

    if (this.params.animateShift) {
      animations.push(`gradient-shift ${6 / this.params.animationSpeed}s ease-in-out infinite`);
    }

    if (this.params.animateBlob) {
      animations.push(`gradient-blob ${8 / this.params.animationSpeed}s ease-in-out infinite`);
    }

    if (this.params.animateFlow) {
      animations.push(`gradient-flow ${5 / this.params.animationSpeed}s ease-in-out infinite`);
    }

    if (this.params.animateOrganic) {
      animations.push(`gradient-organic ${12 / this.params.animationSpeed}s ease-in-out infinite`);
    }

    if (this.params.animateHueCycle) {
      animations.push(`gradient-hue-cycle ${8 / this.params.animationSpeed}s linear infinite`);
    }

    if (this.params.animateHueWave) {
      animations.push(`gradient-hue-wave ${4 / this.params.animationSpeed}s ease-in-out infinite`);
    }

    if (this.params.animateDisplace) {
      animations.push(`gradient-displace ${6 / this.params.animationSpeed}s ease-in-out infinite`);
    }

    if (this.params.animateTravelingDisplace) {
      animations.push(`gradient-traveling-displace ${8 / this.params.animationSpeed}s ease-in-out infinite`);
    }

    if (animations.length > 0) {
      this.gradientImage.style.animation = animations.join(", ");
    }
  }

  updateDisplacement() {
    const turbulence = document.getElementById("turbulence");
    const displacementMap = document.querySelector("feDisplacementMap");

    if (turbulence && displacementMap) {
      turbulence.setAttribute("baseFrequency", this.params.displacementFrequency);
      turbulence.setAttribute("numOctaves", Math.round(this.params.displacementOctaves));
      turbulence.setAttribute("seed", this.params.displacementSeed);
      displacementMap.setAttribute("scale", this.params.displacementScale);
    }
  }

  updateTravelingDisplacement() {
    const travelingTurbulence = document.getElementById("travelingTurbulence");
    const travelingDisplacementMap = document.querySelector("#travelingDisplacementFilter feDisplacementMap");

    if (travelingTurbulence && travelingDisplacementMap) {
      travelingTurbulence.setAttribute("baseFrequency", 0.05 * this.params.travelingDisplaceSpeed);
      travelingTurbulence.setAttribute("numOctaves", Math.round(2));
      travelingTurbulence.setAttribute("seed", Math.round(2));
      travelingDisplacementMap.setAttribute("scale", this.params.travelingDisplaceScale);
    }
  }

  updateBackgrounds() {
    document.querySelector("main").style.backgroundColor = this.params.mainBg;
    document.querySelector("footer").style.backgroundColor = this.params.footerBg;
  }

  updateTextColor() {
    document.querySelector("main").style.color = this.params.textColor;
  }

  applyPreset(presetName = this.params.preset) {
    const presets = {
      default: {
        positionX: 0,
        positionY: 0,
        scale: 1.0,
        width: 100,
        height: 50,
        opacity: 1.0,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
        hue: 0,
        blur: 0,
        startHue: 15,
        startSaturation: 60,
        startLightness: 25,
        startOpacity: 0.9,
        midHue: 30,
        midSaturation: 75,
        midLightness: 55,
        midOpacity: 0.8,
        endHue: 280,
        endSaturation: 65,
        endLightness: 70,
        endOpacity: 0.7,
        animateFloat: false,
        animatePulse: true,
        animateShift: false,
        animateBlob: false,
        animateFlow: false,
        animateOrganic: true,
        animateHueCycle: false,
        animateHueWave: false,
        animateDisplace: false,
        animateTravelingDisplace: true,
        animationSpeed: 1.0,
        displacementScale: 0,
        displacementFrequency: 0.02,
        displacementOctaves: 3,
        displacementSeed: 1,
        travelingDisplaceScale: 15,
        travelingDisplaceSpeed: 1.0,
        travelingDisplaceDirection: 1,
        mainBg: "#191919",
        footerBg: "#0f0f0f",
        textColor: "#f7f7f7",
      },
      subtle: {
        positionX: 0,
        positionY: 0,
        scale: 0.8,
        width: 50,
        height: 15,
        opacity: 0.7,
        brightness: 0.8,
        contrast: 1.1,
        saturation: 0.8,
        hue: 0,
        blur: 1,
        animateFloat: true,
        animatePulse: false,
        animateShift: false,
        animateBlob: false,
        animateFlow: false,
        animateOrganic: true,
        animationSpeed: 0.5,
        mainBg: "#191919",
        footerBg: "#0f0f0f",
        textColor: "#f7f7f7",
      },
      vibrant: {
        positionX: 0,
        positionY: 0,
        scale: 1.2,
        width: 70,
        height: 25,
        opacity: 1.0,
        brightness: 1.3,
        contrast: 1.2,
        saturation: 1.5,
        hue: 0,
        blur: 0,
        animateFloat: true,
        animatePulse: true,
        animateShift: true,
        animateBlob: true,
        animateFlow: false,
        animateOrganic: true,
        animateHueCycle: true,
        animateHueWave: false,
        animateDisplace: true,
        animationSpeed: 1.5,
        displacementScale: 15,
        displacementFrequency: 0.03,
        displacementOctaves: 4,
        displacementSeed: 2,
        mainBg: "#191919",
        footerBg: "#0f0f0f",
        textColor: "#f7f7f7",
      },
      dreamy: {
        positionX: 0,
        positionY: 0,
        scale: 1.1,
        width: 65,
        height: 22,
        opacity: 0.8,
        brightness: 1.1,
        contrast: 0.9,
        saturation: 1.2,
        hue: 20,
        blur: 2,
        animateFloat: true,
        animatePulse: false,
        animateShift: true,
        animateBlob: false,
        animateFlow: true,
        animateOrganic: true,
        animateHueCycle: false,
        animateHueWave: true,
        animateDisplace: true,
        animationSpeed: 0.8,
        displacementScale: 8,
        displacementFrequency: 0.015,
        displacementOctaves: 3,
        displacementSeed: 3,
        mainBg: "#191919",
        footerBg: "#0f0f0f",
        textColor: "#f7f7f7",
      },
      minimal: {
        positionX: 0,
        positionY: 0,
        scale: 0.6,
        width: 40,
        height: 12,
        opacity: 0.5,
        brightness: 0.9,
        contrast: 1.0,
        saturation: 0.7,
        hue: 0,
        blur: 0,
        animateFloat: false,
        animatePulse: false,
        animateShift: false,
        animateBlob: false,
        animateFlow: false,
        animateOrganic: false,
        animationSpeed: 1.0,
        mainBg: "#191919",
        footerBg: "#0f0f0f",
        textColor: "#f7f7f7",
      },
    };

    const preset = presets[presetName];
    if (preset) {
      Object.assign(this.params, preset);
      this.gui.controllersRecursive().forEach((controller) => controller.updateDisplay());
      this.updateGradient();
      this.updateAnimation();
      this.updateBackgrounds();
      this.updateTextColor();
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PNGGradientController();
});
