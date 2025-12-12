"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, useProgress } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Target state refs for smooth lerping
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetScale = useRef(new THREE.Vector3(1.05, 1.05, 1.05));
  const targetColor = useRef(new THREE.Color("#ffffff"));

  const { viewport } = useThree();
  const scrollProgress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current =
        maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const progress = scrollProgress.current;

    // 2. Define "Keyframes" based on progress
    // Hero (0.0 - 0.2) -> Calculators (0.2 - 0.5) -> Features (0.5 - 0.8) -> CTA (0.8 - 1.0)

    if (progress < 0.15) {
      // Hero: Center, Glassy White
      targetPos.current.set(0, 0, 0);
      targetScale.current.set(1.2, 1.2, 1.2);
      targetColor.current.set("#ffffff");
    } else if (progress < 0.45) {
      // Calculators: Right side, Emerald Green
      // Move to right (positive X)
      targetPos.current.set(viewport.width / 5, 0, -1);
      targetScale.current.set(0.9, 0.9, 0.9);
      targetColor.current.set("#10b981"); // Emerald
    } else if (progress < 0.75) {
      // Features: Left side, Blue/Purple
      // Move to left (negative X)
      targetPos.current.set(-viewport.width / 5, 0, -0.5);
      targetScale.current.set(1.0, 1.0, 1.0);
      targetColor.current.set("#3b82f6"); // Blue
    } else {
      // CTA: Center, Gold, Big
      targetPos.current.set(0, 0, 1.5);
      targetScale.current.set(1.4, 1.4, 1.4);
      targetColor.current.set("#fbbf24"); // Amber/Gold
    }

    // 3. Smoothly Interpolate (Lerp) current state to target state
    const lerpSpeed = delta * 1.5; // Slightly slower for smoother motion

    meshRef.current.position.lerp(targetPos.current, lerpSpeed);
    meshRef.current.scale.lerp(targetScale.current, lerpSpeed);

    // Rotation logic
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.08;
    // Add scroll-based rotation torque
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      progress * Math.PI * 2,
      lerpSpeed
    );

    // Material Color Lerp
    if (materialRef.current) {
      materialRef.current.color.lerp(targetColor.current, lerpSpeed);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={1.05}>
        <torusKnotGeometry args={[1, 0.3, 48, 10]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#f5f7fb"
          roughness={0.35}
          metalness={0.25}
          emissive="#0f172a"
          emissiveIntensity={0.12}
        />
      </mesh>
    </Float>
  );
}

export default function Background3D() {
  const { progress } = useProgress();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setReady(true), 100);
      return () => clearTimeout(t);
    }
  }, [progress]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {!ready && (
        <div className="absolute inset-0 bg-black transition-opacity duration-500 opacity-80 flex items-center justify-center text-white text-xs uppercase tracking-[0.2em]">
          Loading...
        </div>
      )}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.05]} // lower DPR for performance
        gl={{ antialias: false }}
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 5, 2]} intensity={0.7} />

        <FloatingShape />

        {/* Add some floating particles for depth */}
        <Stars />
      </Canvas>
    </div>
  );
}

function Stars() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={group}>
      {[...Array(12)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          scale={0.02}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}
