import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'

const vertexShader = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`

const fragmentShader = `#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

out vec4 fragColor;

vec2 hash(vec2 point) {
  point = vec2(dot(point, vec2(2127.1, 81.17)), dot(point, vec2(1269.5, 283.37)));
  return fract(sin(point) * 43758.5453);
}

float noise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  vec2 smoothLocal = local * local * (3.0 - 2.0 * local);
  float value = mix(
    mix(dot(-1.0 + 2.0 * hash(cell + vec2(0.0)), local), dot(-1.0 + 2.0 * hash(cell + vec2(1.0, 0.0)), local - vec2(1.0, 0.0)), smoothLocal.x),
    mix(dot(-1.0 + 2.0 * hash(cell + vec2(0.0, 1.0)), local - vec2(0.0, 1.0)), dot(-1.0 + 2.0 * hash(cell + vec2(1.0, 1.0)), local - vec2(1.0, 1.0)), smoothLocal.x),
    smoothLocal.y
  );
  return 0.5 + 0.5 * value;
}

mat2 rotate(float angle) {
  float sine = sin(angle);
  float cosine = cos(angle);
  return mat2(cosine, -sine, sine, cosine);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float ratio = iResolution.x / iResolution.y;
  float time = iTime * uTimeSpeed;
  vec2 point = uv - 0.5 + uCenterOffset;
  point /= max(uZoom, 0.001);
  float degree = noise(vec2(time * 0.1, point.x * point.y) * uNoiseScale);
  point.y *= 1.0 / ratio;
  point = rotate(radians((degree - 0.5) * uRotationAmount + 180.0)) * point;
  point.y *= ratio;

  float frequency = uWarpFrequency;
  float warpStrength = max(uWarpStrength, 0.001);
  float amplitude = uWarpAmplitude / warpStrength;
  float warpTime = time * uWarpSpeed;
  point.x += sin(point.y * frequency + warpTime) / amplitude;
  point.y += sin(point.x * (frequency * 1.5) + warpTime) / (amplitude * 0.5);

  float balance = uColorBalance;
  float softness = max(uBlendSoftness, 0.0);
  float blendAxis = (point * rotate(radians(uBlendAngle))).x;
  float edge0 = -0.3 - balance - softness;
  float edge1 = 0.2 - balance + softness;
  float vertical0 = 0.5 - balance + softness;
  float vertical1 = -0.3 - balance - softness;
  vec3 firstLayer = mix(uColor3, uColor2, smoothstep(edge0, edge1, blendAxis));
  vec3 secondLayer = mix(uColor2, uColor1, smoothstep(edge0, edge1, blendAxis));
  vec3 color = mix(firstLayer, secondLayer, smoothstep(vertical0, vertical1, point.y));

  vec2 grainPoint = uv * max(uGrainScale, 0.001);
  if (uGrainAnimated > 0.5) grainPoint += vec2(time * 0.05);
  float grain = fract(sin(dot(grainPoint, vec2(12.9898, 78.233))) * 43758.5453);
  color += (grain - 0.5) * uGrainAmount;

  color = (color - 0.5) * uContrast + 0.5;
  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(luminance), color, uSaturation);
  color = pow(max(color, 0.0), vec3(1.0 / max(uGamma, 0.001)));

  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [1, 1, 1]
  return result.slice(1).map((channel) => parseInt(channel, 16) / 255)
}

function Grainient({
  color1 = '#FF9FFC',
  color2 = '#5227FF',
  color3 = '#B497CF',
  timeSpeed = 0.25,
  colorBalance = 0,
  warpStrength = 1,
  warpFrequency = 5,
  warpSpeed = 2,
  warpAmplitude = 50,
  blendAngle = 0,
  blendSoftness = 0.05,
  rotationAmount = 500,
  noiseScale = 2,
  grainAmount = 0.1,
  grainScale = 2,
  grainAnimated = false,
  contrast = 1.5,
  gamma = 1,
  saturation = 1,
  centerX = 0,
  centerY = 0,
  zoom = 0.9,
}) {
  const containerRef = useRef(null)
  const colorTargetsRef = useRef([
    new Float32Array(hexToRgb(color1)),
    new Float32Array(hexToRgb(color2)),
    new Float32Array(hexToRgb(color3)),
  ])
  const settingsRef = useRef({
    timeSpeed,
    colorBalance,
    warpStrength,
    warpFrequency,
    warpSpeed,
    warpAmplitude,
    blendAngle,
    blendSoftness,
    rotationAmount,
    noiseScale,
    grainAmount,
    grainScale,
    grainAnimated,
    contrast,
    gamma,
    saturation,
    centerX,
    centerY,
    zoom,
  })

  useEffect(() => {
    colorTargetsRef.current = [
      new Float32Array(hexToRgb(color1)),
      new Float32Array(hexToRgb(color2)),
      new Float32Array(hexToRgb(color3)),
    ]
  }, [color1, color2, color3])

  useEffect(() => {
    const container = containerRef.current
    const settings = settingsRef.current
    const renderer = new Renderer({ webgl: 2, alpha: false, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 2) })
    const gl = renderer.gl
    const canvas = gl.canvas
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    container.appendChild(canvas)

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uTimeSpeed: { value: settings.timeSpeed },
        uColorBalance: { value: settings.colorBalance },
        uWarpStrength: { value: settings.warpStrength },
        uWarpFrequency: { value: settings.warpFrequency },
        uWarpSpeed: { value: settings.warpSpeed },
        uWarpAmplitude: { value: settings.warpAmplitude },
        uBlendAngle: { value: settings.blendAngle },
        uBlendSoftness: { value: settings.blendSoftness },
        uRotationAmount: { value: settings.rotationAmount },
        uNoiseScale: { value: settings.noiseScale },
        uGrainAmount: { value: settings.grainAmount },
        uGrainScale: { value: settings.grainScale },
        uGrainAnimated: { value: settings.grainAnimated ? 1 : 0 },
        uContrast: { value: settings.contrast },
        uGamma: { value: settings.gamma },
        uSaturation: { value: settings.saturation },
        uCenterOffset: { value: new Float32Array([settings.centerX, settings.centerY]) },
        uZoom: { value: settings.zoom },
        uColor1: { value: colorTargetsRef.current[0].slice() },
        uColor2: { value: colorTargetsRef.current[1].slice() },
        uColor3: { value: colorTargetsRef.current[2].slice() },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      renderer.setSize(Math.max(1, width), Math.max(1, height))
      program.uniforms.iResolution.value[0] = gl.drawingBufferWidth
      program.uniforms.iResolution.value[1] = gl.drawingBufferHeight
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    let animationFrame
    const startedAt = performance.now()
    const render = (now) => {
      program.uniforms.iTime.value = (now - startedAt) * 0.001
      const colorUniforms = [program.uniforms.uColor1, program.uniforms.uColor2, program.uniforms.uColor3]
      colorUniforms.forEach((uniform, index) => {
        const target = colorTargetsRef.current[index]
        target.forEach((channel, channelIndex) => {
          uniform.value[channelIndex] += (channel - uniform.value[channelIndex]) * 0.06
        })
      })
      renderer.render({ scene: mesh })
      animationFrame = requestAnimationFrame(render)
    }
    animationFrame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      if (container.contains(canvas)) container.removeChild(canvas)
    }
  }, [])

  return <div ref={containerRef} className="grainient-container" />
}

export default Grainient
