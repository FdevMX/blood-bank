"use client";
import { useRef } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, Float, Sphere, Instances, Instance } from "@react-three/drei";

function BloodCells({ count = 30 }) {
  const instances = useRef<any>(null);
  
  // Posiciones estáticas de glóbulos flotando
  const particles = Array.from({ length: count }).map(() => ({
    position: [
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 1.5
    ],
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
    scale: 0.5 + Math.random() * 0.5,
    speed: Math.random() * 0.2 + 0.1
  }));

  useFrame((state) => {
    if (!instances.current) return;
    const time = state.clock.elapsedTime;
    instances.current.children.forEach((child: any, i: number) => {
      const p = particles[i];
      child.position.y = p.position[1] + Math.sin(time * p.speed) * 0.1;
      child.rotation.x += p.speed * 0.01;
      child.rotation.y += p.speed * 0.01;
    });
  });

  return (
    <group ref={instances}>
      {particles.map((data, i) => (
        <mesh key={i} position={data.position as any} rotation={data.rotation as any} scale={data.scale * 0.05}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#ff6666" />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
    }
  });

  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 3, 2]} intensity={4} color="#ff3333" />
      <pointLight position={[-2, -3, -2]} intensity={1} color="#111111" />
      
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          {/* Geometría distorsionada para parecer gota */}
          <coneGeometry args={[1.4, 2.5, 64, 1]} translate={[0, 0.5, 0]} />
          <sphereGeometry args={[1.4, 64, 64]} />
          <meshPhysicalMaterial 
            color="#cc1111"
            roughness={0.05}
            metalness={0.1}
            transmission={0.7}
            thickness={1.2}
            ior={1.4}
            envMapIntensity={1.5}
            transparent
            opacity={0.9}
          />
          <BloodCells />
        </mesh>
      </Float>
    </>
  );
}

export default function BloodDropCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      <Scene />
    </Canvas>
  );
}

