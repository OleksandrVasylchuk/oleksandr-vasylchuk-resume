import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 16000;
const SHAPES = 4; // sphere, "OV", torus knot, "HIRE ME"
const HOLD = 3.6; // seconds a shape is held
const MORPH = 1.7; // seconds to morph

/* ---------- shape generators ---------- */
function sphere(n: number, r: number) {
  const a = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    const jitter = 0.92 + Math.random() * 0.16;
    a[i * 3] = Math.cos(th) * rad * r * jitter;
    a[i * 3 + 1] = y * r * jitter;
    a[i * 3 + 2] = Math.sin(th) * rad * r * jitter;
  }
  return a;
}

function torusKnot(n: number, R: number, tube: number, p = 2, q = 3) {
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2 * p + Math.random() * 0.02;
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
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (img[(y * W + x) * 4 + 3] > 128) pts.push(x, y);
    }
  }
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

/* ---------- shaders ---------- */
const vertex = /* glsl */ `
  attribute vec3 aSphere;
  attribute vec3 aText;
  attribute vec3 aKnot;
  attribute vec3 aText2;
  attribute float aRand;
  uniform float uProgress;
  uniform int uFrom;
  uniform int uTo;
  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying vec3 vColor;

  vec3 shape(int i) {
    if (i == 0) return aSphere;
    if (i == 1) return aText;
    if (i == 2) return aKnot;
    return aText2;
  }

  void main() {
    float tt = clamp((uProgress - aRand * 0.35) / 0.65, 0.0, 1.0);
    tt = tt * tt * (3.0 - 2.0 * tt);
    vec3 from = shape(uFrom);
    vec3 to = shape(uTo);
    // arc through a slightly larger radius so the morph "explodes" a bit
    vec3 mid = normalize(from + to + 0.0001) * (length(from) + length(to)) * 0.62;
    vec3 p = mix(mix(from, mid, tt), mix(mid, to, tt), tt);
    p += 0.045 * vec3(sin(uTime * 1.3 + aRand * 40.0), cos(uTime * 1.1 + aRand * 30.0), sin(uTime * 0.9 + aRand * 20.0));

    vec4 wp = modelMatrix * vec4(p, 1.0);
    vec2 d = wp.xy - uMouse.xy;
    float dist = length(d);
    float f = smoothstep(1.7, 0.0, dist) * uMouseStrength;
    wp.xy += normalize(d + 0.0001) * f * 1.1;

    vec4 mv = viewMatrix * wp;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.0 + aRand * 2.8) * uPixelRatio * (7.0 / -mv.z);

    vAlpha = (0.55 + 0.45 * aRand) * (1.0 - f * 0.5);
    vec3 lime = vec3(0.78, 1.0, 0.30);
    vec3 cyan = vec3(0.30, 0.89, 1.0);
    vec3 violet = vec3(0.60, 0.48, 1.0);
    vColor = mix(mix(lime, cyan, aRand), violet, clamp(f * 1.5, 0.0, 1.0));
  }
`;

const fragment = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.12, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

function Particles() {
  const points = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const state = useRef({ from: 0, to: 1, progress: 0, hold: HOLD * 0.6, mouse: new THREE.Vector3(99, 99, 0), strength: 0 });

  const { geometry, material } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const rand = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) rand[i] = Math.random();
    g.setAttribute("position", new THREE.BufferAttribute(sphere(COUNT, 2.2), 3));
    g.setAttribute("aSphere", new THREE.BufferAttribute(sphere(COUNT, 2.2), 3));
    g.setAttribute("aText", new THREE.BufferAttribute(text(COUNT, "OV", 5.6, 340), 3));
    g.setAttribute("aKnot", new THREE.BufferAttribute(torusKnot(COUNT, 2.4, 0.42), 3));
    g.setAttribute("aText2", new THREE.BufferAttribute(text(COUNT, "HIRE ME", 6.2, 215), 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 5);
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
      },
    });
    return { geometry: g, material: m };
  }, []);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame((rs, delta) => {
    const s = state.current;
    const u = material.uniforms;
    u.uTime.value += delta;

    // shape cycle
    if (s.hold > 0) {
      s.hold -= delta;
    } else {
      s.progress = Math.min(1, s.progress + delta / MORPH);
      if (s.progress >= 1) {
        s.from = s.to;
        s.to = (s.to + 1) % SHAPES;
        s.progress = 0;
        s.hold = HOLD;
      }
    }
    u.uFrom.value = s.from;
    u.uTo.value = s.to;
    u.uProgress.value = s.progress;

    // pointer -> world position on z=0 plane
    const { x, y } = rs.pointer;
    v.set(x, y, 0.5).unproject(camera).sub(camera.position).normalize();
    const t = -camera.position.z / v.z;
    const target = camera.position.clone().add(v.multiplyScalar(t));
    s.mouse.lerp(target, 1 - Math.exp(-delta * 8));
    (u.uMouse.value as THREE.Vector3).copy(s.mouse);
    const active = Math.abs(x) < 1 && Math.abs(y) < 1 ? 1 : 0;
    s.strength = THREE.MathUtils.damp(s.strength, active, 4, delta);
    u.uMouseStrength.value = s.strength;

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, x * 0.35 + Math.sin(u.uTime.value * 0.15) * 0.25, 2, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -y * 0.25, 2, delta);
    }
  });

  return (
    <group ref={group} position={[1.3, 0.15, 0]}>
      <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

function Rig() {
  useFrame((rs, delta) => {
    rs.camera.position.x = THREE.MathUtils.damp(rs.camera.position.x, rs.pointer.x * 0.5, 2.5, delta);
    rs.camera.position.y = THREE.MathUtils.damp(rs.camera.position.y, rs.pointer.y * 0.35, 2.5, delta);
    rs.camera.lookAt(1.3, 0.15, 0);
  });
  return null;
}

export function ParticleField({ active = true }: { active?: boolean }) {
  return (
    <div className="scene" aria-hidden>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 7.2], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Particles />
        <Rig />
      </Canvas>
    </div>
  );
}
