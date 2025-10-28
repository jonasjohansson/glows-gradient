import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm";

// Gradient Control System using lil-gui
class GradientController {
  constructor() {
    this.gradientOverlay = document.querySelector(".gradient-overlay");
    this.mainElement = document.querySelector("main");
    this.footerElement = document.querySelector("footer");
    this.bodyElement = document.body;

    // Create the data object that lil-gui will control
    this.params = {
      // Gradient Colors (HSL format for better hue rotation)
      hue1: 241,
      hue2: 35,
      hue3: 315,
      hue4: 261,
      hue5: 214,
      hue6: 49,
      hue7: 127,

      // Gradient Properties
      saturation: 83,
      lightness: 78,
      fadeDistance: 50,

      // Animation
      animateGradient: true,
      animationSpeed: 12,

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
  }

  setupGUI() {
    // Create the GUI
    this.gui = new GUI();
    this.gui.title("Gradient Controls");

    // Position the GUI on the left side using lil-gui's built-in method
    this.gui.domElement.style.position = "fixed";
    this.gui.domElement.style.top = "20px";
    this.gui.domElement.style.left = "20px";
    this.gui.domElement.style.right = "auto";
    this.gui.domElement.style.zIndex = "1000";

    // Gradient Colors Folder
    const gradientFolder = this.gui.addFolder("Gradient Colors");
    gradientFolder
      .add(this.params, "hue1", 0, 360)
      .name("Hue 1")
      .onChange(() => this.updateGradient());
    gradientFolder
      .add(this.params, "hue2", 0, 360)
      .name("Hue 2")
      .onChange(() => this.updateGradient());
    gradientFolder
      .add(this.params, "hue3", 0, 360)
      .name("Hue 3")
      .onChange(() => this.updateGradient());
    gradientFolder
      .add(this.params, "hue4", 0, 360)
      .name("Hue 4")
      .onChange(() => this.updateGradient());
    gradientFolder
      .add(this.params, "hue5", 0, 360)
      .name("Hue 5")
      .onChange(() => this.updateGradient());
    gradientFolder
      .add(this.params, "hue6", 0, 360)
      .name("Hue 6")
      .onChange(() => this.updateGradient());
    gradientFolder
      .add(this.params, "hue7", 0, 360)
      .name("Hue 7")
      .onChange(() => this.updateGradient());
    gradientFolder.open();

    // Gradient Properties Folder
    const propertiesFolder = this.gui.addFolder("Gradient Properties");
    propertiesFolder
      .add(this.params, "saturation", 0, 100)
      .name("Saturation (%)")
      .onChange(() => this.updateGradient());
    propertiesFolder
      .add(this.params, "lightness", 0, 100)
      .name("Lightness (%)")
      .onChange(() => this.updateGradient());
    propertiesFolder
      .add(this.params, "fadeDistance", 20, 80)
      .name("Fade Distance (%)")
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

  updateGradient() {
    const { hue1, hue2, hue3, hue4, hue5, hue6, hue7, saturation, lightness, fadeDistance } = this.params;

    const gradient = `radial-gradient(at 85% 15%, hsla(${hue1}, ${saturation}%, ${lightness}%, 1) 0px, transparent ${fadeDistance}%),
      radial-gradient(at 75% 25%, hsla(${hue2}, ${saturation}%, ${lightness}%, 1) 0px, transparent ${fadeDistance}%),
      radial-gradient(at 90% 35%, hsla(${hue3}, ${saturation}%, ${lightness}%, 1) 0px, transparent ${fadeDistance}%),
      radial-gradient(at 80% 45%, hsla(${hue4}, ${saturation}%, ${lightness}%, 1) 0px, transparent ${fadeDistance}%),
      radial-gradient(at 70% 20%, hsla(${hue5}, ${saturation}%, ${lightness}%, 1) 0px, transparent ${fadeDistance}%),
      radial-gradient(at 95% 30%, hsla(${hue6}, ${saturation}%, ${lightness}%, 1) 0px, transparent ${fadeDistance}%),
      radial-gradient(at 88% 40%, hsla(${hue7}, ${saturation}%, ${lightness}%, 1) 0px, transparent ${fadeDistance}%)`;

    this.gradientOverlay.style.backgroundImage = gradient;
  }

  updateAnimation() {
    const { animateGradient, animationSpeed } = this.params;

    // Remove existing animations
    this.gradientOverlay.style.animation = "none";

    if (animateGradient) {
      this.gradientOverlay.style.animation = `hue-rotate ${animationSpeed}s linear infinite`;
    }
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
        hue1: 241,
        hue2: 35,
        hue3: 315,
        hue4: 261,
        hue5: 214,
        hue6: 49,
        hue7: 127,
        saturation: 83,
        lightness: 78,
        fadeDistance: 50,
        mainBg: "#191919",
        footerBg: "#0f0f0f",
        textColor: "#f7f7f7",
      },
      sunset: {
        hue1: 30,
        hue2: 15,
        hue3: 45,
        hue4: 60,
        hue5: 0,
        hue6: 20,
        hue7: 40,
        saturation: 90,
        lightness: 70,
        fadeDistance: 60,
        mainBg: "#2D1B1B",
        footerBg: "#1A0F0F",
        textColor: "#FFF8DC",
      },
      ocean: {
        hue1: 200,
        hue2: 180,
        hue3: 220,
        hue4: 240,
        hue5: 160,
        hue6: 190,
        hue7: 210,
        saturation: 70,
        lightness: 60,
        fadeDistance: 45,
        mainBg: "#0F1B2E",
        footerBg: "#0A0F1A",
        textColor: "#E6F3FF",
      },
      fire: {
        hue1: 60,
        hue2: 30,
        hue3: 0,
        hue4: 15,
        hue5: 45,
        hue6: 20,
        hue7: 10,
        saturation: 95,
        lightness: 65,
        fadeDistance: 55,
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
  }
}

// Initialize the gradient controller when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new GradientController();
});
