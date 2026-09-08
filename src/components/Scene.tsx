import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/** Distorted "core" blob that reacts to the pointer. */
function Core() {
  const mesh = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const { x, y } = state.pointer;
    const t = state.clock.elapsedTime;
    if (mesh.current) {
      mesh.current.rotation.y = THREE.MathUtils.damp(mesh.current.rotation.y, x * 0.6 + t * 0.12, 3, delta);
      mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, -y * 0.5, 3, delta);
    }
    if (wire.current) {
      wire.current.rotation.y -= delta * 0.08;
      wire.current.rotation.z += delta * 0.05;
    }
    if (ring.current) {
      ring.current.rotation.z += delta * 0.25;
      ring.current.rotation.x = THREE.MathUtils.damp(ring.current.rotation.x, Math.PI / 2.4 + y * 0.35, 3, delta);
    }
    if (ring2.current) {
      ring2.current.rotation.z -= delta * 0.18;
      ring2.current.rotation.y = THREE.MathUtils.damp(ring2.current.rotation.y, x * 0.5, 3, delta);
    }
  });

  return (
    <group position={[1.4, 0.1, 0]}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.2}>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.35, 48]} />
          <MeshDistortMaterial color="#c8ff4d" emissive="#5a7a00" emissiveIntensity={0.25} roughness={0.25} metalness={0.7} distort={0.42} speed={1.8} />
        </mesh>
      </Float>

      <mesh ref={wire} scale={2.1}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#7c6cff" wireframe transparent opacity={0.22} />
      </mesh>

      <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.6, 0.012, 16, 200]} />
        <meshBasicMaterial color="#4de3ff" transparent opacity={0.7} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 3, 0.4, 0]}>
        <torusGeometry args={[3.1, 0.008, 16, 220]} />
        <meshBasicMaterial color="#c8ff4d" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

/** Slowly drifting particle field for depth. */
function Dust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 900;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(phi) - 4;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.015;
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, state.pointer.y * 0.08, 2, delta);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#9aa3b8" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Rig() {
  useFrame((state, delta) => {
    const { x, y } = state.pointer;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, x * 0.6, 2.5, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, y * 0.4, 2.5, delta);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function Scene({ active = true }: { active?: boolean }) {
  return (
    <div className="scene" aria-hidden>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[4, 5, 6]} intensity={2.2} color="#ffffff" />
          <pointLight position={[-6, -3, -2]} intensity={14} color="#7c6cff" />
          <pointLight position={[5, -4, 3]} intensity={10} color="#4de3ff" />
          <Core />
          <Dust />
          <Sparkles count={70} scale={[9, 5, 6]} size={2.2} speed={0.3} opacity={0.5} color="#c8ff4d" />
          <Rig />
        </Suspense>
      </Canvas>
    </div>
  );
}
