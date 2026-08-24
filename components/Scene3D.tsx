"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  useGLTF,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

function Building() {
  const { scene } = useGLTF("/building.glb");

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.2}>
      <primitive object={scene} scale={0.5} />
    </Float>
  );
}

useGLTF.preload("/building.glb");

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 2, 6], fov: 50 }}
     
      gl={{alpha: true ,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
          }}
          
      >
        <color attach="background" args={["transparent"]} />
      {/* 🌍 REALISTIC LIGHT ENVIRONMENT */}
      <Environment preset="city" />

      {/* 💡 LIGHTS */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      {/* 🧱 YOUR MODEL */}
      <Building />

      {/* 🪶 GROUND SHADOW (THIS FIXES “FLOATING” FEEL) */}
      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.6}
        scale={10}
        blur={2}
        far={5}
      />

      {/* 🎥 CAMERA CONTROL */}
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}