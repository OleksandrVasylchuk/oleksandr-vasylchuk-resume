import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * One persistent WebGL layer behind the whole page.
 * 16k particles morph between shapes as you scroll:
 *   0 sphere → 1 "OV" → 2 DNA helix (experience) → 3 wave grid (work)
 *   → 4 torus knot (stack) → 5 "HIRE ME" (recruiter zone / contact)
 * The pointer repels particles everywhere on the page.
 */
const COUNT = 16000;
const SHAPES = 6;

function sphere(n: number, r: number) {
  const a = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    const j = 0.92 + Math.random() * 0.16;
    a[i * 3] = Math.cos(th) * rad * r * j;
    a[i * 3 + 1] = y * r * j;
    a[i * 3 + 2] = Math.sin(th) * rad * r * j;
  }
  return a;
}

function helix(n: number) {
  const a = new Float32Array(n * 3);
  const turns = 4.5;
  const R = 1.35;
  const H = 6.4;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const strand = i % 3; // two strands + rungs
    const ang = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * H;
    if (strand === 2) {
      // rung between strands
      const k = Math.random();
      a[i * 3] = Math.cos(ang) * R * (k * 2 - 1);
      a[i * 3 + 1] = y;
      a[i * 3 + 2] = Math.sin(ang) * R * (k * 2 - 1);
    } else {
      const s = strand === 0 ? 1 : -1;
      const jit = (Math.random() - 0.5) * 0.18;
      a[i * 3] = Math.cos(ang) * R * s + jit;
      a[i * 3 + 1] = y + jit;
      a[i * 3 + 2] = Math.sin(ang) * R * s + jit;
    }
  }
  return a;
}

function waveGrid(n: number) {
  const a = new Float32Array(n * 3);
  const side = Math.ceil(Math.sqrt(n));
  const W = 7.5;
  for (let i = 0; i < n; i++) {
    const gx = (i % side) / side;
    const gz = Math.floor(i / side) / side;
    const x = (gx - 0.5) * W;
    const z = (gz - 0.5) * W;
    a[i * 3] = x;
    a[i * 3 + 1] = Math.sin(x * 1.6) * 0.45 + Math.cos(z * 1.3) * 0.45 - 0.6;
    a[i * 3 + 2] = z;
  }
  return a;
}

function torusKnot(n: number, R: number, tube: number, p = 2, q = 3) {
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2 * p;
    const cq = Math.cos((q / p) * t);
    const cx = R * (2 + cq) * 0.5 * Math.cos(t);
    const cy = R * (2 + cq) * 0.5 * Math.sin(t);
    const cz = R * Math.sin((q / p) * t) * 0.5;
    const ang = Math.random() * Math.PI * 2;
    const rr = tube * Math.sqrt(Math.random());
    a[i * 3] = cx + Math.cos(ang) * rr;
    a[i * 3 + 1] = cy + Math.sin(ang) * rr;
    a[i * 3 + 2] = cz + (Math.random() - 0.5) * tube;
  }
  return a;
}

function text(n: number, label: string, worldWidth: number, fontPx: number) {
  const W = 1200;
  const H = 420;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 ${fontPx}px Syne, "Arial Black", Inter, system-ui, sans-serif`;
  ctx.fillText(label, W / 2, H / 2 + fontPx * 0.04);
  const img = ctx.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (img[(y * W + x) * 4 + 3] > 128) pts.push(x, y);
  const a = new Float32Array(n * 3);
  const scale = worldWidth / W;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(Math.random() * (pts.length / 2)) * 2;
    a[i * 3] = (pts[k] - W / 2) * scale + (Math.random() - 0.5) * 0.02;
    a[i * 3 + 1] = -(pts[k + 1] - H / 2) * scale + (Math.random() - 0.5) * 0.02;
    a[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
  }
  return a;
}

const vertex = /* glsl */ `
  attribute vec3 aS0; attribute vec3 aS1; attribute vec3 aS2; attribute vec3 aS3; attribute vec3 aS4; attribute vec3 aS5;
  attribute float aRand;
  uniform float uProgress; uniform int uFrom; uniform int uTo;
  uniform float uTime; uniform vec3 uMouse; uniform float uMouseStrength; uniform float uPixelRatio; uniform float uDim;
  varying float vAlpha; varying vec3 vColor;

  vec3 shape(int i) {
    if (i == 0) return aS0; if (i == 1) return aS1; if (i == 2) return aS2;
    if (i == 3) return aS3; if (i == 4) return aS4; return aS5;
  }

  void main() {
    float tt = clamp((uProgress - aRand * 0.35) / 0.65, 0.0, 1.0);
    tt = tt * tt * (3.0 - 2.0 * tt);
    vec3 from = shape(uFrom);
    vec3 to = shape(uTo);
    vec3 mid = (from + to) * 0.5 + normalize(from + to + 0.0001) * 0.9;
    vec3 p = mix(mix(from, mid, tt), mix(mid, to, tt), tt);
    p += 0.05 * vec3(sin(uTime * 1.3 + aRand * 40.0), cos(uTime * 1.1 + aRand * 30.0), sin(uTime * 0.9 + aRand * 20.0));

    vec4 wp = modelMatrix * vec4(p, 1.0);
    vec2 d = wp.xy - uMouse.xy;
    float dist = length(d);
    float f = smoothstep(1.8, 0.0, dist) * uMouseStrength;
    wp.xy += normalize(d + 0.0001) * f * 1.2;

    vec4 mv = viewMatrix * wp;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.0 + aRand * 2.8) * uPixelRatio * (7.0 / -mv.z);

    vAlpha = (0.55 + 0.45 * aRand) * (1.0 - f * 0.5) * uDim;
    vec3 lime = vec3(0.78, 1.0, 0.30);
    vec3 cyan = vec3(0.30, 0.89, 1.0);
    vec3 violet = vec3(0.60, 0.48, 1.0);
    vColor = mix(mix(lime, cyan, aRand), violet, clamp(f * 1.5, 0.0, 1.0));
  }
`;

const fragment = /* glsl */ `
  varying float vAlpha; varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.12, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

/** Scroll progress 0..1 across the document, read on every frame (cheap). */
function docProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

function Particles() {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const st = useRef({ mouse: new THREE.Vector3(99, 99, 0), strength: 0, x: 1.3, dim: 1, seg: 0 });
  const v = useMemo(() => new THREE.Vector3(), []);

  const { geometry, material } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const rand = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) rand[i] = Math.random();
    g.setAttribute("position", new THREE.BufferAttribute(sphere(COUNT, 2.2), 3));
    g.setAttribute("aS0", new THREE.BufferAttribute(sphere(COUNT, 2.2), 3));
    g.setAttribute("aS1", new THREE.BufferAttribute(text(COUNT, "OV", 5.6, 340), 3));
    g.setAttribute("aS2", new THREE.BufferAttribute(helix(COUNT), 3));
    g.setAttribute("aS3", new THREE.BufferAttribute(waveGrid(COUNT), 3));
    g.setAttribute("aS4", new THREE.BufferAttribute(torusKnot(COUNT, 2.4, 0.42), 3));
    g.setAttribute("aS5", new THREE.BufferAttribute(text(COUNT, "HIRE ME", 6.4, 215), 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);
    const m = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uProgress: { value: 0 },
        uFrom: { value: 0 },
        uTo: { value: 1 },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3(99, 99, 0) },
        uMouseStrength: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uDim: { value: 1 },
      },
    });
    return { geometry: g, material: m };
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((rs, delta) => {
    const s = st.current;
    const u = material.uniforms;
    u.uTime.value += delta;

    // scroll -> shape segment. Hero holds the sphere for the first 6 %.
    const p = docProgress();
    const t = Math.max(0, (p - 0.06) / 0.94) * (SHAPES - 1);
    const from = Math.min(SHAPES - 2, Math.floor(t));
    u.uFrom.value = from;
    u.uTo.value = from + 1;
    u.uProgress.value = t - from;

    // pointer on the z=0 plane
    const { x, y } = rs.pointer;
    v.set(x, y, 0.5).unproject(camera).sub(camera.position).normalize();
    const k = -camera.position.z / v.z;
    const target = camera.position.clone().add(v.multiplyScalar(k));
    s.mouse.lerp(target, 1 - Math.exp(-delta * 8));
    (u.uMouse.value as THREE.Vector3).copy(s.mouse);
    const active = Math.abs(x) < 1 && Math.abs(y) < 1 ? 1 : 0;
    s.strength = THREE.MathUtils.damp(s.strength, active, 4, delta);
    u.uMouseStrength.value = s.strength;

    // hero: sit right of the headline; later: centered and dimmer behind content
    const wide = rs.size.width > 900;
    const targetX = p < 0.06 && wide ? 1.3 : 0;
    s.x = THREE.MathUtils.damp(s.x, targetX, 2, delta);
    // phones/tablets: the backdrop sits directly behind body copy, so keep it faint
    const small = rs.size.width < 900;
    const targetDim = small ? (p < 0.06 ? 0.55 : 0.16) : p < 0.06 ? 1 : 0.42;
    s.dim = THREE.MathUtils.damp(s.dim, targetDim, 2, delta);
    u.uDim.value = s.dim;

    if (group.current) {
      group.current.position.x = s.x;
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, x * 0.35 + u.uTime.value * 0.08 + p * Math.PI, 2, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -y * 0.25 + (from === 3 ? 0.55 : 0), 2, delta);
    }
  });

  return (
    <group ref={group} position={[1.3, 0.15, 0]}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

function Rig() {
  useFrame((rs, delta) => {
    rs.camera.position.x = THREE.MathUtils.damp(rs.camera.position.x, rs.pointer.x * 0.5, 2.5, delta);
    rs.camera.position.y = THREE.MathUtils.damp(rs.camera.position.y, rs.pointer.y * 0.35, 2.5, delta);
    rs.camera.lookAt(0, 0.15, 0);
  });
  return null;
}

export function Backdrop() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      const c = document.createElement("canvas");
      setOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setOk(false);
    }
  }, []);
  if (!ok) return null;
  return (
    <div className="backdrop" aria-hidden>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 7.4], fov: 45 }} gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }} style={{ background: "transparent" }}>
        <Particles />
        <Rig />
      </Canvas>
    </div>
  );
}
