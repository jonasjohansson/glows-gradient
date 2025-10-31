# Glows Gradient - Parameter Guide

Welcome! This guide will help you understand all the parameters available in the Glows Gradient editor. Think of this as your reference manual for creating beautiful, animated gradient blobs.

## Table of Contents

1. [Overview](#overview)
2. [Global Settings](#global-settings)
3. [Layer Basics](#layer-basics)
4. [Gradient Colors](#gradient-colors)
5. [Shape & Position](#shape--position)
6. [Wave Animation](#wave-animation)
7. [Pattern Controls](#pattern-controls)
8. [Flow Animation](#flow-animation)
9. [Edge & Blending](#edge--blending)
10. [Control Points](#control-points)
11. [Tips & Workflow](#tips--workflow)

---

## Overview

Glows Gradient creates animated organic blob shapes with procedural gradients. You can work with two independent layers, each with its own shape, colors, and animations. Understanding how these parameters work together will help you achieve the exact look you want.

---

## Global Settings

These settings affect the entire composition, not individual layers.

### Background Color
**What it does:** Sets the background color behind all layers.  
**Think of it as:** The canvas color before any gradients are painted.  
**Range:** Predefined color options (#191919, #481121, #220F3C)

### Cozy Overlay
**What it does:** Adds an optional texture overlay image behind the gradients.  
**Think of it as:** A subtle texture layer that adds depth and atmosphere.  
**Options:** cozy-gray.png, cozy-purple.png, cozy-red.png

### Global Blur
**What it does:** Applies a uniform blur effect to all layers at once.  
**Think of it as:** A camera focus effect - everything gets softer together.  
**Range:** 0-100 pixels  
**Tip:** Useful for creating dreamy, out-of-focus backgrounds.

---

## Layer Blending

Controls how the two layers interact with each other.

### Blend Mode
**What it does:** Determines how Layer 2 combines with Layer 1.  
**Think of it as:** Different ways to mix two photos in Photoshop.  
**Options:** normal, multiply, screen, overlay, soft-light, hard-light, color-dodge, color-burn, darken, lighten, difference, exclusion

**Quick Guide:**
- **normal:** Layer 2 simply sits on top
- **multiply:** Darkens the result (like stacking transparencies)
- **screen:** Brightens the result
- **overlay:** Combines multiply and screen for contrast
- **soft-light:** Gentle blending, preserves shadows and highlights

### Layer Opacity (Layer 1 & Layer 2)
**What it does:** Controls the transparency of each individual layer.  
**Think of it as:** The opacity slider for a layer in image editing software.  
**Range:** 0.0 (fully transparent) to 1.0 (fully opaque)  
**Tip:** Lower opacity allows layers to blend more subtly.

---

## Grain/Noise

Adds texture on top of everything for a film-like aesthetic.

### Grain Opacity
**What it does:** Controls how visible the grain texture is.  
**Think of it as:** Film grain intensity.  
**Range:** 0.0 (invisible) to 1.0 (fully visible)

### Grain Scale
**What it does:** Controls the size of grain particles.  
**Think of it as:** Zooming in or out on the grain texture.  
**Range:** 0.1 (tiny, fine grain) to 5.0 (large, coarse grain)

### Grain Blend Mode
**What it does:** Determines how the grain blends with the image below.  
**Think of it as:** The same blend modes as layer blending, but for the grain layer.

---

## Layer Basics

Each layer has the same set of controls. You can think of a layer as having three main components:
1. **The Shape** - defined by control points and waves
2. **The Gradient** - colors that fill the shape
3. **The Pattern** - animated noise that creates the gradient colors

---

## Gradient Colors

The gradient is built from up to 5 color stops, creating smooth transitions between colors.

### Color Stop 1-5
**What it does:** Defines the colors in your gradient palette.  
**Think of it as:** Choosing paint colors before mixing them.  
**Format:** Hex color codes (e.g., #FF8C42)  
**Tip:** Stops are numbered 1-5, but you can use fewer by setting stops at the same position.

### Stop Position 1-5
**What it does:** Determines where each color appears in the gradient (0 = pattern value 0, 1 = pattern value 1).  
**Think of it as:** Markers on a color bar showing where each color starts.  
**Range:** 0.0 to 1.0  
**Tip:** Stops should be ordered from lowest to highest (e.g., 0.0, 0.3, 0.6, 0.85, 1.0).

**Example:** 
- Stop 1 at 0.0 with color #FFF8A0 (yellow) → appears in darkest pattern areas
- Stop 5 at 1.0 with color #D44226 (red) → appears in brightest pattern areas

---

## Shape & Position

Controls the blob's location and size in the canvas.

### Position X & Y
**What it does:** Moves the center of the blob shape horizontally and vertically.  
**Think of it as:** X and Y coordinates on a graph.  
**Range:** -1000 to 1000 pixels  
**Tip:** Position is independent of the shape's animation - the blob moves through space while staying centered at this point.

### Scale
**What it does:** Uniformly scales the entire blob up or down.  
**Think of it as:** Zooming the whole shape in or out.  
**Range:** 0.5 to 2.0 (50% to 200% size)

### Width (Scale X) & Height (Scale Y)
**What it does:** Scales the blob independently on horizontal and vertical axes.  
**Think of it as:** Stretching or squashing the shape.  
**Range:** 0.25 to 3.0  
**Tip:** Use different X and Y scales to create oval or pancake-shaped blobs.

---

## Wave Animation

Waves create the organic, breathing movement of the blob's edges.

### Wave Height
**What it does:** Controls how much the blob's edge distorts outward and inward.  
**Think of it as:** The amplitude of ocean waves - higher values = bigger waves.  
**Range:** 0 (no distortion) to 300 pixels  
**Tip:** Higher values create more dramatic, wavy edges. At 0, the blob has a smooth, static edge defined only by control points.

### Wave Speed
**What it does:** Controls how fast the wave distortion animates.  
**Think of it as:** The frequency of waves - how many waves pass per second.  
**Range:** 0 (frozen) to 5.0  
**Tip:** This is separate from Flow Speed - Wave Speed affects the shape edge, Flow Speed affects the internal pattern movement.

### Noise Scale
**What it does:** Controls the size/frequency of the noise used for wave generation.  
**Think of it as:** Zooming in or out on the wave pattern.  
**Range:** 0.1 (very fine, high frequency waves) to 5.0 (very coarse, low frequency waves)  
**Tip:** Lower values create smoother, slower-changing waves. Higher values create more chaotic, rapidly changing distortions.

---

## Pattern Controls

The pattern is a procedural noise field inside the blob that determines which gradient colors appear where. Think of it as a grayscale map that drives the gradient - dark areas use colors from early stops, bright areas use colors from later stops.

### Pattern Scale
**What it does:** Zooms the pattern texture in or out.  
**Think of it as:** Magnification of the noise pattern.  
**Range:** 0.1 (zoomed in, larger features) to 10.0 (zoomed out, smaller features)  
**Tip:** Lower values create larger, more visible pattern areas. Higher values create fine, detailed patterns.

### Pattern Speed
**What it does:** Controls how fast the pattern animates internally.  
**Think of it as:** The speed of time-lapse photography of the pattern.  
**Range:** 0 (static) to 10.0  
**Tip:** This animates the pattern's internal evolution, separate from flow movement.

### Pattern Rotation
**What it does:** Rotates the pattern texture around the blob's center.  
**Think of it as:** Spinning a texture map.  
**Range:** 0° to 360°  
**Tip:** Useful for aligning pattern features with your blob's shape.

### Pattern Offset X & Y
**What it does:** Shifts the pattern horizontally and vertically.  
**Think of it as:** Panning a camera over the pattern texture.  
**Range:** -1000 to 1000 pixels  
**Tip:** Use this to find better gradient color placements or create different compositions.

### Pattern Intensity
**What it does:** Controls how strongly the pattern affects the gradient.  
**Think of it as:** The contrast between pattern values - at 0, everything is neutral gray.  
**Range:** 0.0 (no effect, flat color) to 5.0 (maximum effect)  
**Tip:** At very low values, you get subtle gradients. At very high values, you get dramatic, high-contrast color transitions.

### Pattern Contrast
**What it does:** Adjusts the contrast of the pattern values before they're mapped to colors.  
**Think of it as:** The contrast slider for the pattern's brightness.  
**Range:** 0.0 (no contrast, all gray) to 10.0 (maximum contrast, extreme blacks and whites)  
**Tip:** Higher contrast creates sharper transitions between gradient colors. Lower contrast creates smoother, more gradual transitions.

### Pattern Turbulence
**What it does:** Adds extra distortion and complexity to the pattern.  
**Think of it as:** Extra noise layers that warp and distort the base pattern.  
**Range:** 0.0 (clean pattern) to 5.0 (maximum turbulence)  
**Tip:** Adds organic, cloud-like variations. Higher values create more chaotic, swirly patterns.

---

## Flow Animation

Flow creates directional movement of the pattern inside the blob, like currents or wind.

### Flow Speed
**What it does:** Controls how fast the pattern flows in the specified direction.  
**Think of it as:** The speed of a river current flowing through the blob.  
**Range:** 0.0 (no flow) to 5.0  
**Tip:** This works together with Flow Amount - Speed controls rate, Amount controls distance.

### Flow Amount
**What it does:** Controls how far the pattern moves in the flow direction.  
**Think of it as:** The strength or distance of the flow.  
**Range:** 0.0 (no movement) to 10.0  
**Tip:** High amounts with low speeds create slow, dramatic sweeps. Low amounts with high speeds create rapid, subtle movements.

### Flow Direction (Angle)
**What it does:** Sets the direction the pattern flows (in degrees).  
**Think of it as:** A compass direction - 0° = right, 90° = up, 180° = left, 270° = down.  
**Range:** 0° to 360°  
**Tip:** Experiment with opposite directions (e.g., 0° and 180°) on different layers for interesting counter-flows.

---

## Edge & Blending

These parameters control how the blob fades at its edges.

### Blur
**What it does:** Controls the softness of the blob's outer edge.  
**Think of it as:** Feathering in image editing - how gradually the blob fades out.  
**Range:** 0 (hard edge) to 200 pixels (very soft, gradual fade)  
**Tip:** Higher blur values create softer, more glowing edges. Lower values create sharper, more defined shapes.

### Feather
**What it does:** Adds an additional inner softness, creating a softer inner edge transition.  
**Think of it as:** A second blur layer that affects the inside of the blob.  
**Range:** 0 (no feathering) to 150 pixels  
**Tip:** Use feather to create a softer appearance where the pattern colors transition, or to create double-edge effects.

---

## Control Points

Control points define the base shape of your blob before wave distortion is applied. Think of them as handles on a circle that you can push in or pull out.

### Control Points 0-9
**What it does:** Each point controls the radius of the blob at a specific angle around the center.  
**Think of it as:** 10 handles evenly spaced around a circle (every 36°).  
**Range:** -100 (pulled inward) to +100 (pushed outward)  
**Angles:**
- Point 0: 0° (right)
- Point 1: 36°
- Point 2: 72°
- Point 3: 108° (up-left)
- Point 4: 144°
- Point 5: 180° (left)
- Point 6: 216°
- Point 7: 252° (down-left)
- Point 8: 288°
- Point 9: 324°

**Tip:** The shape smoothly interpolates between these points using cubic Bezier curves. Positive values bulge outward, negative values indent inward. Start with all zeros for a perfect circle, then adjust points to create organic shapes.

---

## Tips & Workflow

### Getting Started
1. **Start with defaults** - Load the editor and observe the default gradient
2. **Adjust one thing at a time** - Change one parameter and see what happens
3. **Save presets** - When you find something you like, save it as a preset

### Creating Moods

**Dreamy/Soft:**
- Low Pattern Contrast (0.5-1.5)
- Low Pattern Intensity (0.5-1.0)
- High Blur (100-200)
- Medium Wave Height (30-80)
- Slow Wave Speed (0.1-0.5)

**Dramatic/Bold:**
- High Pattern Contrast (5-10)
- High Pattern Intensity (2-5)
- Low Blur (20-50)
- High Wave Height (100-300)
- Fast Wave Speed (2-5)

**Organic/Fluid:**
- Medium Pattern Turbulence (1-3)
- Medium Pattern Speed (2-5)
- Medium Flow Amount (3-7)
- Moderate Wave Height (50-150)

### Understanding the Relationship Between Parameters

**Pattern vs. Waves:**
- **Pattern** = the gradient colors inside the shape
- **Waves** = the shape's edge movement
- These are independent - you can have a static shape with animated patterns, or an animated shape with static patterns.

**Flow vs. Pattern Speed:**
- **Flow Speed/Amount** = directional movement (the pattern slides in one direction)
- **Pattern Speed** = internal animation (the pattern evolves in place)
- Use both together for complex, swirling effects.

**Contrast vs. Intensity:**
- **Intensity** = how much the pattern affects colors (stronger pattern = more color variation)
- **Contrast** = how sharp the transitions are between pattern values (higher = sharper color transitions)

### Common Pitfalls

1. **Too much contrast** - Creates harsh, jarring transitions. Start low (0.5-2.0) and increase gradually.
2. **Mismatched flow speeds** - If Layer 1 and Layer 2 have very different flow speeds, they can look disconnected.
3. **Overlapping control points** - If all control points have similar values, you lose the organic shape.

### Exporting Your Work

Use the "Export JSON" function to save your settings. The viewer.html page can load these JSON files to display your gradients without the editor interface. This is perfect for embedding in websites or sharing with others.

---

## Technical Notes

- All animations are driven by time, creating smooth, continuous motion
- The gradient uses cubic Bezier interpolation for smooth color transitions
- Wave distortion uses Simplex noise for natural-looking randomness
- Pattern uses multi-octave noise for complex, realistic textures
- All calculations happen in real-time using WebGL shaders for optimal performance

---

Happy creating! Experiment, play, and don't be afraid to push parameters to their extremes. Sometimes the most interesting results come from unexpected combinations.

