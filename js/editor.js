import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm";

const canvas = document.getElementById("blobCanvas");
const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

if (!gl) {
  alert("WebGL not supported. Please use a modern browser.");
  throw new Error("WebGL not supported");
}

const simplexNoiseSource = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }
  float snoise2D(vec2 v) { return snoise(vec3(v, 0.0)); }
`;

const vertexShaderSource = `#version 300 es
  in vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0, 1); }
`;

const fragmentCommon = `
  precision highp float;
  out vec4 outColor;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_center;
  uniform float u_scale;
  uniform float u_blur;
  uniform float u_feather;
  uniform float u_flowSpeed;
  uniform float u_flowAmount;
  uniform float u_noiseScale;
  uniform float u_waveHeight;
  uniform vec2 u_position;
  uniform vec3 u_colorStop1;
  uniform vec3 u_colorStop2;
  uniform vec3 u_colorStop3;
  uniform vec3 u_colorStop4;
  uniform vec3 u_colorStop5;
  uniform float u_stopPos1;
  uniform float u_stopPos2;
  uniform float u_stopPos3;
  uniform float u_stopPos4;
  uniform float u_stopPos5;
  uniform float u_controlPoint0;
  uniform float u_controlPoint1;
  uniform float u_controlPoint2;
  uniform float u_controlPoint3;
  uniform float u_controlPoint4;
  uniform float u_controlPoint5;
  uniform float u_controlPoint6;
  uniform float u_controlPoint7;
  uniform float u_controlPoint8;
  uniform float u_controlPoint9;
  ${simplexNoiseSource}
  float cubicBezier(float t, float p0, float p1, float p2, float p3) {
    float oneMinusT = 1.0 - t;
    float omt2 = oneMinusT * oneMinusT;
    float omt3 = omt2 * oneMinusT;
    float t2 = t * t;
    float t3 = t2 * t;
    return omt3 * p0 + 3.0 * omt2 * t * p1 + 3.0 * oneMinusT * t2 * p2 + t3 * p3;
  }
  float getBlobRadius(float angle) {
    angle = angle - floor(angle * 0.159155) * 6.28318;
    if (angle < 0.0) angle += 6.28318;
    const float pointSpacing = 0.628318;
    const float invSpacing = 1.59155;
    int pointIndex = int(angle * invSpacing);
    float localT = (angle - float(pointIndex) * pointSpacing) * invSpacing;
    float p0, p1, p2, p3, prevP;
    if (pointIndex == 0) { p0 = u_controlPoint0; p1 = u_controlPoint1; p2 = u_controlPoint2; p3 = u_controlPoint3; prevP = u_controlPoint9; }
    else if (pointIndex == 1) { p0 = u_controlPoint1; p1 = u_controlPoint2; p2 = u_controlPoint3; p3 = u_controlPoint4; prevP = u_controlPoint0; }
    else if (pointIndex == 2) { p0 = u_controlPoint2; p1 = u_controlPoint3; p2 = u_controlPoint4; p3 = u_controlPoint5; prevP = u_controlPoint1; }
    else if (pointIndex == 3) { p0 = u_controlPoint3; p1 = u_controlPoint4; p2 = u_controlPoint5; p3 = u_controlPoint6; prevP = u_controlPoint2; }
    else if (pointIndex == 4) { p0 = u_controlPoint4; p1 = u_controlPoint5; p2 = u_controlPoint6; p3 = u_controlPoint7; prevP = u_controlPoint3; }
    else if (pointIndex == 5) { p0 = u_controlPoint5; p1 = u_controlPoint6; p2 = u_controlPoint7; p3 = u_controlPoint8; prevP = u_controlPoint4; }
    else if (pointIndex == 6) { p0 = u_controlPoint6; p1 = u_controlPoint7; p2 = u_controlPoint8; p3 = u_controlPoint9; prevP = u_controlPoint5; }
    else if (pointIndex == 7) { p0 = u_controlPoint7; p1 = u_controlPoint8; p2 = u_controlPoint9; p3 = u_controlPoint0; prevP = u_controlPoint6; }
    else if (pointIndex == 8) { p0 = u_controlPoint8; p1 = u_controlPoint9; p2 = u_controlPoint0; p3 = u_controlPoint1; prevP = u_controlPoint7; }
    else { p0 = u_controlPoint9; p1 = u_controlPoint0; p2 = u_controlPoint1; p3 = u_controlPoint2; prevP = u_controlPoint8; }
    float cp1 = p0 + (p1 - prevP) * 0.3;
    float cp2 = p1 - (p2 - p0) * 0.3;
    return cubicBezier(localT, p0, cp1, cp2, p1);
  }
  float blobNoise(vec2 p, float time) {
    const float L = 0.0018; const float S = 0.04; const float F = 0.043;
    float t1 = F * time; float t2 = time * S * 1.26; float t3 = time * S * 1.09; float t4 = time * S * 0.89;
    float ft126 = t1 * 1.26; float ft109 = t1 * 1.09; float ft089 = t1 * 0.89;
    float noise = 0.0;
    noise += snoise2D(p * 0.0018 + vec2(t1, 0.0)) * 0.85;
    noise += snoise2D(p * 0.0013846 + vec2(ft126, t2)) * 1.15;
    noise += snoise2D(p * 0.0009677 + vec2(ft109, t3)) * 0.60;
    noise += snoise2D(p * 0.0005538 + vec2(ft089, t4)) * 0.40;
    return noise;
  }
  float blobNoise2(vec2 p, float time) {
    const float L = 0.0022; const float S = 0.05; const float F = 0.038;
    float noise = 0.0;
    noise += snoise2D(p * (L / 1.15) + vec2(-F * time * 0.8, time * S * 0.9)) * 1.0;
    noise += snoise2D(p * (L / 1.50) + vec2(F * time * 1.4, -time * S * 1.1)) * 0.90;
    noise += snoise2D(p * (L / 2.10) + vec2(F * time * 0.7, time * S * 1.3)) * 0.70;
    noise += snoise2D(p * (L / 3.80) + vec2(-F * time * 1.2, time * S * 0.8)) * 0.50;
    noise += snoise2D(p * (L / 5.50) + vec2(F * time * 0.6, -time * S * 1.5)) * 0.35;
    return noise;
  }
  float backgroundNoise(vec2 p, float time, float offset) {
    const float L = 0.0015; const float S = 0.13; const float Y_SCALE = 3.0; const float F = 0.11;
    float t = time + offset; float tS = t * S; float x = p.x * L; float y = p.y * L * Y_SCALE;
    float noise = 0.5;
    noise += snoise(vec3(x + F * t, y, tS)) * 0.30;
    noise += snoise(vec3(x * 0.6 + F * t * 0.6, y * 0.85, tS)) * 0.26;
    noise += snoise(vec3(x * 0.4 + F * t * 0.8, y * 0.70, tS)) * 0.22;
    return clamp(noise, 0.0, 1.0);
  }
  float smoothstep5(float t) {
    float t2 = t * t; float t3 = t2 * t; return t3 * (t * (6.0 * t - 15.0) + 10.0);
  }
  vec3 gradientColor(float t) {
    if (t <= u_stopPos1) return u_colorStop1; if (t >= u_stopPos5) return u_colorStop5;
    if (t <= u_stopPos2) { float range = u_stopPos2 - u_stopPos1; float localT = max(0.0, (t - u_stopPos1)) / max(0.0001, range); return mix(u_colorStop1, u_colorStop2, localT); }
    else if (t <= u_stopPos3) { float range = u_stopPos3 - u_stopPos2; float localT = max(0.0, (t - u_stopPos2)) / max(0.0001, range); return mix(u_colorStop2, u_colorStop3, localT); }
    else if (t <= u_stopPos4) { float range = u_stopPos4 - u_stopPos3; float localT = max(0.0, (t - u_stopPos3)) / max(0.0001, range); return mix(u_colorStop3, u_colorStop4, localT); }
    else { float range = u_stopPos5 - u_stopPos4; float localT = max(0.0, (t - u_stopPos4)) / max(0.0001, range); return mix(u_colorStop4, u_colorStop5, localT); }
  }
`;

const fragmentShaderSource = `#version 300 es\n${fragmentCommon}\n  void main(){ vec2 uv = gl_FragCoord.xy; vec2 p = (uv - u_center - u_position) / u_scale; float dist = length(p); float angle = atan(p.y, p.x); float baseRadius = 300.0; float radiusOffset = getBlobRadius(angle); float noise = blobNoise(p * u_noiseScale, u_time * u_flowSpeed); float waveDisplacement = noise * u_waveHeight * 0.3; float blobRadius = baseRadius + radiusOffset + waveDisplacement; float blobDist = dist - blobRadius; float alpha = smoothstep(u_blur, -u_blur, blobDist); float featherAlpha = smoothstep(u_feather, -u_feather, blobDist); alpha = mix(alpha, min(alpha, featherAlpha), step(0.001, u_feather)); alpha = smoothstep5(clamp(alpha, 0.0, 1.0)); vec2 flowOffset = vec2(u_time * u_flowAmount * 10.0, 0.0); float noiseValue = backgroundNoise(p * 0.5 + flowOffset, u_time, 0.0); vec3 color = gradientColor(noiseValue); outColor = vec4(color, alpha); }`;

const fragmentShaderSource2 = `#version 300 es\n${fragmentCommon}\n  void main(){ vec2 uv = gl_FragCoord.xy; vec2 centeredP = uv - u_center - u_position; vec2 p = centeredP / u_scale; float angle = atan(p.y, p.x); float dist = length(p); float baseRadius = 300.0; float radiusOffset = getBlobRadius(angle); float noise = blobNoise2(p * u_noiseScale, u_time * u_flowSpeed); float waveDisplacement = noise * u_waveHeight * 0.3; float blobRadius = baseRadius + radiusOffset + waveDisplacement; float blobDist = dist - blobRadius; float alpha = smoothstep(u_blur, -u_blur, blobDist); if (u_feather > 0.0) { float featherAlpha = smoothstep(u_feather, -u_feather, blobDist); alpha = min(alpha, featherAlpha); } alpha = smoothstep5(clamp(alpha, 0.0, 1.0)); vec2 flowOffset = vec2(u_time * u_flowAmount * 10.0, 0.0); float noiseValue = backgroundNoise(p * 0.5 + flowOffset, u_time, 0.0); vec3 color = gradientColor(noiseValue); outColor = vec4(color, alpha); }`;

function createShader(glctx, type, source) {
  const shader = glctx.createShader(type);
  glctx.shaderSource(shader, source);
  glctx.compileShader(shader);
  if (!glctx.getShaderParameter(shader, glctx.COMPILE_STATUS)) {
    console.error("Shader compilation error:", glctx.getShaderInfoLog(shader));
    glctx.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(glctx, vertexShader, fragmentShader) {
  const program = glctx.createProgram();
  glctx.attachShader(program, vertexShader);
  glctx.attachShader(program, fragmentShader);
  glctx.linkProgram(program);
  if (!glctx.getProgramParameter(program, glctx.LINK_STATUS)) {
    console.error("Program linking error:", glctx.getProgramInfoLog(program));
    glctx.deleteProgram(program);
    return null;
  }
  return program;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);
if (!program) throw new Error("Failed to create WebGL program");

const canvas2 = document.getElementById("blobCanvas2");
const gl2 = canvas2.getContext("webgl2") || canvas2.getContext("webgl");
if (!gl2) throw new Error("WebGL not supported for second canvas");

const vertexShader2 = createShader(gl2, gl2.VERTEX_SHADER, vertexShaderSource);
const fragmentShader2 = createShader(gl2, gl2.FRAGMENT_SHADER, fragmentShaderSource2);
const program2 = createProgram(gl2, vertexShader2, fragmentShader2);
if (!program2) throw new Error("Failed to create WebGL program for second canvas");

// Fullscreen quads
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

const positionBuffer2 = gl2.createBuffer();
gl2.bindBuffer(gl2.ARRAY_BUFFER, positionBuffer2);
gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl2.STATIC_DRAW);

// Locations for layer 1
const positionLocation = gl.getAttribLocation(program, "a_position");
const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
const timeLocation = gl.getUniformLocation(program, "u_time");
const centerLocation = gl.getUniformLocation(program, "u_center");
const scaleLocation = gl.getUniformLocation(program, "u_scale");
const blurLocation = gl.getUniformLocation(program, "u_blur");
const featherLocation = gl.getUniformLocation(program, "u_feather");
const flowSpeedLocation = gl.getUniformLocation(program, "u_flowSpeed");
const flowAmountLocation = gl.getUniformLocation(program, "u_flowAmount");
const noiseScaleLocation = gl.getUniformLocation(program, "u_noiseScale");
const waveHeightLocation = gl.getUniformLocation(program, "u_waveHeight");
const positionLocation_uniform = gl.getUniformLocation(program, "u_position");
const colorStop1Location = gl.getUniformLocation(program, "u_colorStop1");
const colorStop2Location = gl.getUniformLocation(program, "u_colorStop2");
const colorStop3Location = gl.getUniformLocation(program, "u_colorStop3");
const colorStop4Location = gl.getUniformLocation(program, "u_colorStop4");
const colorStop5Location = gl.getUniformLocation(program, "u_colorStop5");
const stopPos1Location = gl.getUniformLocation(program, "u_stopPos1");
const stopPos2Location = gl.getUniformLocation(program, "u_stopPos2");
const stopPos3Location = gl.getUniformLocation(program, "u_stopPos3");
const stopPos4Location = gl.getUniformLocation(program, "u_stopPos4");
const stopPos5Location = gl.getUniformLocation(program, "u_stopPos5");
const controlPointLocations = Array.from({ length: 10 }, (_, i) => gl.getUniformLocation(program, `u_controlPoint${i}`));

// Locations for layer 2
const positionLocation2 = gl2.getAttribLocation(program2, "a_position");
const resolutionLocation2 = gl2.getUniformLocation(program2, "u_resolution");
const timeLocation2 = gl2.getUniformLocation(program2, "u_time");
const centerLocation2 = gl2.getUniformLocation(program2, "u_center");
const scaleLocation2 = gl2.getUniformLocation(program2, "u_scale");
const blurLocation2 = gl2.getUniformLocation(program2, "u_blur");
const featherLocation2 = gl2.getUniformLocation(program2, "u_feather");
const flowSpeedLocation2 = gl2.getUniformLocation(program2, "u_flowSpeed");
const flowAmountLocation2 = gl2.getUniformLocation(program2, "u_flowAmount");
const noiseScaleLocation2 = gl2.getUniformLocation(program2, "u_noiseScale");
const waveHeightLocation2 = gl2.getUniformLocation(program2, "u_waveHeight");
const positionLocation_uniform2 = gl2.getUniformLocation(program2, "u_position");
const colorStop1Location2 = gl2.getUniformLocation(program2, "u_colorStop1");
const colorStop2Location2 = gl2.getUniformLocation(program2, "u_colorStop2");
const colorStop3Location2 = gl2.getUniformLocation(program2, "u_colorStop3");
const colorStop4Location2 = gl2.getUniformLocation(program2, "u_colorStop4");
const colorStop5Location2 = gl2.getUniformLocation(program2, "u_colorStop5");
const stopPos1Location2 = gl2.getUniformLocation(program2, "u_stopPos1");
const stopPos2Location2 = gl2.getUniformLocation(program2, "u_stopPos2");
const stopPos3Location2 = gl2.getUniformLocation(program2, "u_stopPos3");
const stopPos4Location2 = gl2.getUniformLocation(program2, "u_stopPos4");
const stopPos5Location2 = gl2.getUniformLocation(program2, "u_stopPos5");
const controlPointLocations2 = Array.from({ length: 10 }, (_, i) => gl2.getUniformLocation(program2, `u_controlPoint${i}`));

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255] : [1, 1, 1];
}

const params = {
  colorStop1: "#FFF8A0",
  colorStop2: "#87CEEB",
  colorStop3: "#FF8C42",
  colorStop4: "#FF6B35",
  colorStop5: "#D44226",
  stopPos1: 0.0,
  stopPos2: 0.3,
  stopPos3: 0.6,
  stopPos4: 0.85,
  stopPos5: 1.0,
  positionX: 400,
  positionY: 400,
  controlPoint0: 0.0,
  controlPoint1: 20.0,
  controlPoint2: 15.0,
  controlPoint3: 0.0,
  controlPoint4: -10.0,
  controlPoint5: -15.0,
  controlPoint6: -10.0,
  controlPoint7: 0.0,
  controlPoint8: 15.0,
  controlPoint9: 20.0,
  scale: 1.0,
  blur: 80.0,
  feather: 40.0,
  flowSpeed: 0.1,
  flowAmount: 0.5,
  noiseScale: 1.0,
  waveHeight: 50.0,
  blendMode: "normal",
  globalBlur: 0.0,
  grainOpacity: 0.0,
  grainScale: 1.0,
  grainBlend: "overlay",
  backgroundColor: "#191919",
  cozyGrayImage: "cozy-gray.png",
};

const params2 = {
  colorStop1: "#FFE066",
  colorStop2: "#70B8D8",
  colorStop3: "#FFA366",
  colorStop4: "#FF7F4D",
  colorStop5: "#E05A3A",
  stopPos1: 0.0,
  stopPos2: 0.25,
  stopPos3: 0.55,
  stopPos4: 0.8,
  stopPos5: 1.0,
  positionX: 450,
  positionY: 450,
  controlPoint0: 15.0,
  controlPoint1: 10.0,
  controlPoint2: 0.0,
  controlPoint3: -15.0,
  controlPoint4: -20.0,
  controlPoint5: -15.0,
  controlPoint6: -5.0,
  controlPoint7: 10.0,
  controlPoint8: 20.0,
  controlPoint9: 15.0,
  scale: 1.0,
  blur: 80.0,
  feather: 40.0,
  flowSpeed: 0.1,
  flowAmount: 0.5,
  noiseScale: 1.0,
  waveHeight: 50.0,
};

const blendModes = [
  "normal","multiply","screen","overlay","soft-light","hard-light","color-dodge","color-burn","darken","lighten","difference","exclusion"
];

const PRESET_STORAGE_KEY = "glowsGradient9Presets";
const LAST_PRESET_KEY = "glowsGradient9LastPreset";

function getAllPresets() {
  try { return JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY) || "{}"); } catch { return {}; }
}
function setAllPresets(presets) {
  try { localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets)); } catch (e) { console.error("Failed to save preset:", e); alert("Failed to save preset. LocalStorage may be disabled or full."); }
}

let presetFolder = null; let presetControllers = [];

function loadPreset(presetName) {
  const presets = getAllPresets();
  if (!presets[presetName]) { alert(`Preset "${presetName}" not found.`); return; }
  const preset = presets[presetName];
  if (preset.params) Object.keys(params).forEach(k => { if (preset.params[k] !== undefined) params[k] = preset.params[k]; });
  if (preset.params2) Object.keys(params2).forEach(k => { if (preset.params2[k] !== undefined) params2[k] = preset.params2[k]; });
  if (preset.blendMode !== undefined) { params.blendMode = preset.blendMode; canvas2.style.mixBlendMode = params.blendMode; }
  if (preset.globalBlur !== undefined) { params.globalBlur = preset.globalBlur; updateGlobalBlur(); }
  gui.updateDisplay();
  localStorage.setItem(LAST_PRESET_KEY, presetName);
}

function savePreset(presetName) {
  if (!presetName || presetName.trim() === "") { alert("Please enter a preset name."); return; }
  const presets = getAllPresets();
  const presetData = { params: {}, params2: {}, blendMode: params.blendMode, globalBlur: params.globalBlur };
  Object.keys(params).forEach(k => presetData.params[k] = params[k]);
  Object.keys(params2).forEach(k => presetData.params2[k] = params2[k]);
  presets[presetName.trim()] = presetData;
  setAllPresets(presets);
  refreshPresetGUI();
  localStorage.setItem(LAST_PRESET_KEY, presetName.trim());
}

function deletePreset(presetName) {
  if (!confirm(`Delete preset "${presetName}"?`)) return;
  const presets = getAllPresets();
  delete presets[presetName];
  setAllPresets(presets);
  refreshPresetGUI();
}

function refreshPresetGUI() {
  presetControllers.forEach(ctrl => { try { ctrl.destroy(); } catch {} });
  presetControllers = [];
  const presets = getAllPresets();
  const presetNames = Object.keys(presets).sort();
  if (presetNames.length === 0) return;
  presetNames.forEach((name) => {
    const loadObj = { load: () => loadPreset(name) };
    const delObj = { delete: () => deletePreset(name) };
    const loadCtrl = presetFolder.add(loadObj, "load").name(`📁 ${name}`);
    const deleteCtrl = presetFolder.add(delObj, "delete").name(`🗑️ ${name}`);
    presetControllers.push(loadCtrl, deleteCtrl);
  });
}

// GUI
const gui = new GUI();
presetFolder = gui.addFolder("Presets");
presetFolder.open();
const savePresetObj = { name: "", save: () => { if (savePresetObj.name.trim()) { savePreset(savePresetObj.name); savePresetObj.name = ""; gui.updateDisplay(); } } };
presetFolder.add(savePresetObj, "name").name("New Preset Name");
presetFolder.add(savePresetObj, "save").name("💾 Save Current");

// Export current settings as JSON
function exportSettingsJson() {
  const data = {
    params,
    params2,
    blendMode: params.blendMode,
    globalBlur: params.globalBlur
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
const exportFolder = gui.addFolder("Export");
exportFolder.add({ export: exportSettingsJson }, "export").name("⬇️ Export JSON");
// Background settings just below Export
const backgroundFolder = gui.addFolder("Background");
backgroundFolder.add(params, "backgroundColor", ["#191919", "#481121", "#220F3C"]).name("Background Color").onChange(updateBackground);
backgroundFolder.add(params, "cozyGrayImage", ["cozy-gray.png", "cozy-purple.png", "cozy-red.png"]).name("Cozy Overlay").onChange(updateBackground);

// Global blur (placed above layers & grain)
gui.add(params, "globalBlur", 0, 100, 0.5).name("Global Blur").onChange(() => { updateGlobalBlur(); });

// Layer Blending and Grain/Noise (moved above layers)
const blendFolder = gui.addFolder("Layer Blending");
blendFolder
  .add(params, "blendMode", blendModes)
  .name("Blend Mode")
  .onChange(() => { canvas2.style.mixBlendMode = params.blendMode; });

const grainFolder = gui.addFolder("Grain/Noise");
grainFolder.add(params, "grainOpacity", 0, 1, 0.01).name("Grain Opacity").onChange(updateGrain);
grainFolder.add(params, "grainScale", 0.1, 5.0, 0.1).name("Grain Scale").onChange(updateGrain);
grainFolder.add(params, "grainBlend", blendModes).name("Grain Blend Mode").onChange(updateGrain);

// Layer 1 controls
const layer1Folder = gui.addFolder("Layer 1");
layer1Folder.open(false);
const gradientFolder1 = layer1Folder.addFolder("Gradient Colors");
gradientFolder1.addColor(params, "colorStop1").name("Stop 1");
gradientFolder1.addColor(params, "colorStop2").name("Stop 2");
gradientFolder1.addColor(params, "colorStop3").name("Stop 3");
gradientFolder1.addColor(params, "colorStop4").name("Stop 4");
gradientFolder1.addColor(params, "colorStop5").name("Stop 5");
const stopPosFolder1 = layer1Folder.addFolder("Color Stop Positions");
stopPosFolder1.add(params, "stopPos1", 0, 1, 0.01).name("Stop 1 Position");
stopPosFolder1.add(params, "stopPos2", 0, 1, 0.01).name("Stop 2 Position");
stopPosFolder1.add(params, "stopPos3", 0, 1, 0.01).name("Stop 3 Position");
stopPosFolder1.add(params, "stopPos4", 0, 1, 0.01).name("Stop 4 Position");
stopPosFolder1.add(params, "stopPos5", 0, 1, 0.01).name("Stop 5 Position");
const positionFolder1 = layer1Folder.addFolder("Position");
positionFolder1.add(params, "positionX", -1000, 1000, 1).name("Position X");
positionFolder1.add(params, "positionY", -1000, 1000, 1).name("Position Y");
layer1Folder.add(params, "scale", 0.5, 2.0, 0.01).name("Scale");
layer1Folder.add(params, "blur", 0, 200, 1).name("Blur");
layer1Folder.add(params, "feather", 0, 150, 1).name("Feather");
layer1Folder.add(params, "flowSpeed", 0, 1, 0.01).name("Flow Speed");
layer1Folder.add(params, "flowAmount", 0, 2, 0.01).name("Flow Amount");
layer1Folder.add(params, "noiseScale", 0.1, 3.0, 0.1).name("Noise Scale");
layer1Folder.add(params, "waveHeight", 0, 150, 1).name("Wave Height");

// Control points layer 1
const controlPointsFolder1 = layer1Folder.addFolder("Control Points");
controlPointsFolder1.open(false);
const angleNames = ["0°","36°","72°","108°","144°","180°","216°","252°","288°","324°"];
for (let i = 0; i < 10; i++) {
  controlPointsFolder1.add(params, `controlPoint${i}`, -100, 100, 0.5).name(`Point ${i} (${angleNames[i]})`);
}

// Layer 2 controls
const layer2Folder = gui.addFolder("Layer 2");
layer2Folder.open(false);
const gradientFolder2 = layer2Folder.addFolder("Gradient Colors");
gradientFolder2.addColor(params2, "colorStop1").name("Stop 1");
gradientFolder2.addColor(params2, "colorStop2").name("Stop 2");
gradientFolder2.addColor(params2, "colorStop3").name("Stop 3");
gradientFolder2.addColor(params2, "colorStop4").name("Stop 4");
gradientFolder2.addColor(params2, "colorStop5").name("Stop 5");
const stopPosFolder2 = layer2Folder.addFolder("Color Stop Positions");
stopPosFolder2.add(params2, "stopPos1", 0, 1, 0.01).name("Stop 1 Position");
stopPosFolder2.add(params2, "stopPos2", 0, 1, 0.01).name("Stop 2 Position");
stopPosFolder2.add(params2, "stopPos3", 0, 1, 0.01).name("Stop 3 Position");
stopPosFolder2.add(params2, "stopPos4", 0, 1, 0.01).name("Stop 4 Position");
stopPosFolder2.add(params2, "stopPos5", 0, 1, 0.01).name("Stop 5 Position");
const positionFolder2 = layer2Folder.addFolder("Position");
positionFolder2.add(params2, "positionX", -1000, 1000, 1).name("Position X");
positionFolder2.add(params2, "positionY", -1000, 1000, 1).name("Position Y");
layer2Folder.add(params2, "scale", 0.5, 2.0, 0.01).name("Scale");
layer2Folder.add(params2, "blur", 0, 200, 1).name("Blur");
layer2Folder.add(params2, "feather", 0, 150, 1).name("Feather");
layer2Folder.add(params2, "flowSpeed", 0, 1, 0.01).name("Flow Speed");
layer2Folder.add(params2, "flowAmount", 0, 2, 0.01).name("Flow Amount");
layer2Folder.add(params2, "noiseScale", 0.1, 3.0, 0.1).name("Noise Scale");
layer2Folder.add(params2, "waveHeight", 0, 150, 1).name("Wave Height");

// Global blur control moved above

// Background color and cozy overlay handlers

function updateBackground() {
  document.body.style.backgroundColor = params.backgroundColor;
  document.querySelector('.stage').style.backgroundColor = params.backgroundColor;
  const cozyImg = document.getElementById('cozyGrayImg');
  if (cozyImg) {
    cozyImg.src = `assets/${params.cozyGrayImage}`;
  }
}

function updateGlobalBlur() {
  const blurValue = params.globalBlur > 0 ? `${params.globalBlur}px` : "none";
  canvas.style.filter = `blur(${blurValue})`;
  canvas2.style.filter = `blur(${blurValue})`;
}

// Grain controls defined above with folder placement

const grainOverlay = document.getElementById("grainOverlay");
function updateGrain() {
  if (!grainOverlay) return;
  grainOverlay.style.opacity = params.grainOpacity;
  const baseSize = 200; const scaledSize = baseSize / params.grainScale;
  grainOverlay.style.backgroundSize = `${scaledSize}px ${scaledSize}px`;
  grainOverlay.style.mixBlendMode = params.grainBlend;
}
updateGrain();
updateBackground();

setTimeout(() => {
  gui.domElement.style.position = "fixed";
  gui.domElement.style.top = "20px";
  gui.domElement.style.left = "20px";
  gui.domElement.style.zIndex = "1000";
}, 100);

const lastPresetName = localStorage.getItem(LAST_PRESET_KEY);
if (lastPresetName) {
  const presets = getAllPresets();
  if (presets[lastPresetName]) { setTimeout(() => loadPreset(lastPresetName), 100); }
}
refreshPresetGUI();

function resizeCanvas() {
  const displayWidth = canvas.clientWidth; const displayHeight = canvas.clientHeight;
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth; canvas.height = displayHeight; gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }
  if (canvas2.width !== displayWidth || canvas2.height !== displayHeight) {
    canvas2.width = displayWidth; canvas2.height = displayHeight; gl2.viewport(0, 0, gl2.canvas.width, gl2.canvas.height);
  }
}

let startTime = performance.now() / 1000.0;
function render() {
  resizeCanvas();
  const currentTime = performance.now() / 1000.0 - startTime;
  // Layer 1
  gl.useProgram(program);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform1f(timeLocation, currentTime);
  gl.uniform2f(centerLocation, gl.canvas.width / 2, gl.canvas.height / 2);
  gl.uniform1f(scaleLocation, params.scale);
  gl.uniform1f(blurLocation, params.blur);
  gl.uniform1f(featherLocation, params.feather);
  gl.uniform1f(flowSpeedLocation, params.flowSpeed);
  gl.uniform1f(flowAmountLocation, params.flowAmount);
  gl.uniform1f(noiseScaleLocation, params.noiseScale);
  gl.uniform1f(waveHeightLocation, params.waveHeight);
  gl.uniform2f(positionLocation_uniform, params.positionX, params.positionY);
  const rgb1 = hexToRgb(params.colorStop1); const rgb2 = hexToRgb(params.colorStop2); const rgb3 = hexToRgb(params.colorStop3); const rgb4 = hexToRgb(params.colorStop4); const rgb5 = hexToRgb(params.colorStop5);
  gl.uniform3f(colorStop1Location, rgb1[0], rgb1[1], rgb1[2]);
  gl.uniform3f(colorStop2Location, rgb2[0], rgb2[1], rgb2[2]);
  gl.uniform3f(colorStop3Location, rgb3[0], rgb3[1], rgb3[2]);
  gl.uniform3f(colorStop4Location, rgb4[0], rgb4[1], rgb4[2]);
  gl.uniform3f(colorStop5Location, rgb5[0], rgb5[1], rgb5[2]);
  gl.uniform1f(stopPos1Location, params.stopPos1);
  gl.uniform1f(stopPos2Location, params.stopPos2);
  gl.uniform1f(stopPos3Location, params.stopPos3);
  gl.uniform1f(stopPos4Location, params.stopPos4);
  gl.uniform1f(stopPos5Location, params.stopPos5);
  for (let i = 0; i < 10; i++) gl.uniform1f(controlPointLocations[i], params[`controlPoint${i}`]);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // Layer 2
  gl2.useProgram(program2);
  gl2.enable(gl2.BLEND);
  gl2.blendFunc(gl2.SRC_ALPHA, gl2.ONE_MINUS_SRC_ALPHA);
  gl2.bindBuffer(gl2.ARRAY_BUFFER, positionBuffer2);
  gl2.enableVertexAttribArray(positionLocation2);
  gl2.vertexAttribPointer(positionLocation2, 2, gl2.FLOAT, false, 0, 0);
  gl2.uniform2f(resolutionLocation2, gl2.canvas.width, gl2.canvas.height);
  gl2.uniform1f(timeLocation2, currentTime);
  gl2.uniform2f(centerLocation2, gl2.canvas.width / 2, gl2.canvas.height / 2);
  gl2.uniform1f(scaleLocation2, params2.scale);
  gl2.uniform1f(blurLocation2, params2.blur);
  gl2.uniform1f(featherLocation2, params2.feather);
  gl2.uniform1f(flowSpeedLocation2, params2.flowSpeed);
  gl2.uniform1f(flowAmountLocation2, params2.flowAmount);
  gl2.uniform1f(noiseScaleLocation2, params2.noiseScale);
  gl2.uniform1f(waveHeightLocation2, params2.waveHeight);
  gl2.uniform2f(positionLocation_uniform2, params2.positionX, params2.positionY);
  const rgb1_2 = hexToRgb(params2.colorStop1); const rgb2_2 = hexToRgb(params2.colorStop2); const rgb3_2 = hexToRgb(params2.colorStop3); const rgb4_2 = hexToRgb(params2.colorStop4); const rgb5_2 = hexToRgb(params2.colorStop5);
  gl2.uniform3f(colorStop1Location2, rgb1_2[0], rgb1_2[1], rgb1_2[2]);
  gl2.uniform3f(colorStop2Location2, rgb2_2[0], rgb2_2[1], rgb2_2[2]);
  gl2.uniform3f(colorStop3Location2, rgb3_2[0], rgb3_2[1], rgb3_2[2]);
  gl2.uniform3f(colorStop4Location2, rgb4_2[0], rgb4_2[1], rgb4_2[2]);
  gl2.uniform3f(colorStop5Location2, rgb5_2[0], rgb5_2[1], rgb5_2[2]);
  gl2.uniform1f(stopPos1Location2, params2.stopPos1);
  gl2.uniform1f(stopPos2Location2, params2.stopPos2);
  gl2.uniform1f(stopPos3Location2, params2.stopPos3);
  gl2.uniform1f(stopPos4Location2, params2.stopPos4);
  gl2.uniform1f(stopPos5Location2, params2.stopPos5);
  for (let i = 0; i < 10; i++) gl2.uniform1f(controlPointLocations2[i], params2[`controlPoint${i}`]);
  gl2.clearColor(0, 0, 0, 0);
  gl2.clear(gl2.COLOR_BUFFER_BIT);
  gl2.drawArrays(gl2.TRIANGLES, 0, 6);

  requestAnimationFrame(render);
}

canvas2.style.mixBlendMode = params.blendMode;
updateGlobalBlur();
resizeCanvas();
render();


