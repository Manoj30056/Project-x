"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useScroll, useTransform, motion } from "framer-motion";

function Camera3D({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const lensRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Subtle rotation based on scroll and time
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 + scrollProgress * Math.PI * 0.5;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05 - scrollProgress * 0.3;
    
    // Lens animation
    if (lensRef.current) {
      const scale = 1 + scrollProgress * 0.3;
      lensRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef} position={[0, 0, 0]}>
        {/* Camera body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.2, 1.5, 1.2]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
        </mesh>
        
        {/* Camera grip */}
        <mesh position={[1.3, -0.2, 0]}>
          <boxGeometry args={[0.4, 1.1, 1]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.6} />
        </mesh>
        
        {/* Lens mount */}
        <mesh position={[0, 0, 0.7]}>
          <cylinderGeometry args={[0.6, 0.7, 0.4, 32]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.2} metalness={0.9} />
        </mesh>
        
        {/* Lens outer */}
        <mesh ref={lensRef} position={[0, 0, 1.1]}>
          <cylinderGeometry args={[0.55, 0.6, 0.6, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.95} />
        </mesh>
        
        {/* Lens glass */}
        <mesh position={[0, 0, 1.45]}>
          <circleGeometry args={[0.5, 32]} />
          <MeshDistortMaterial
            color="#8b5cf6"
            roughness={0}
            metalness={0.1}
            transparent
            opacity={0.6}
            distort={0.2}
            speed={2}
          />
        </mesh>
        
        {/* Lens inner ring */}
        <mesh position={[0, 0, 1.42]}>
          <ringGeometry args={[0.35, 0.5, 32]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
        </mesh>
        
        {/* Top dial */}
        <mesh position={[0.5, 0.85, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.15, 32]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
        </mesh>
        
        {/* Shutter button */}
        <mesh position={[0.8, 0.85, 0.3]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 32]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Flash */}
        <mesh position={[-0.7, 0.9, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingPhotos({ scrollProgress }: { scrollProgress: number }) {
  const photosRef = useRef<THREE.Group>(null);
  
  const photos = useMemo(() => {
    const items = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 3 + Math.random() * 1.5;
      items.push({
        id: i,
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 2,
          Math.sin(angle) * radius - 2,
        ] as [number, number, number],
        rotation: [
          Math.random() * 0.3,
          angle + Math.PI,
          Math.random() * 0.2 - 0.1,
        ] as [number, number, number],
        scale: 0.4 + Math.random() * 0.3,
        color: ["#8b5cf6", "#3b82f6", "#ec4899", "#10b981", "#f59e0b"][i % 5],
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (!photosRef.current) return;
    photosRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    
    photosRef.current.children.forEach((child, i) => {
      child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.002;
    });
  });

  return (
    <group ref={photosRef}>
      {photos.map((photo) => (
        <Float key={photo.id} speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
          <mesh
            position={photo.position}
            rotation={photo.rotation}
            scale={photo.scale * (1 + scrollProgress * 0.5)}
          >
            <planeGeometry args={[1.2, 0.9]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.1}
              metalness={0}
              transparent
              opacity={0.3 + scrollProgress * 0.4}
            />
          </mesh>
          {/* Photo border glow */}
          <mesh
            position={[photo.position[0], photo.position[1], photo.position[2] - 0.01]}
            rotation={photo.rotation}
            scale={photo.scale * (1 + scrollProgress * 0.5)}
          >
            <planeGeometry args={[1.25, 0.95]} />
            <meshStandardMaterial
              color={photo.color}
              emissive={photo.color}
              emissiveIntensity={0.3}
              transparent
              opacity={0.2 + scrollProgress * 0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      const color = new THREE.Color(
        Math.random() > 0.5 ? "#8b5cf6" : "#3b82f6"
      );
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#8b5cf6" />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#3b82f6" />
      
      <Camera3D scrollProgress={scrollProgress} />
      <FloatingPhotos scrollProgress={scrollProgress} />
      <Particles />
      
      <Environment preset="city" />
    </>
  );
}

export function Hero3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0]) }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SceneWrapper scrollYProgress={scrollYProgress} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}

function SceneWrapper({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const { viewport } = useThree();
  
  // Use a ref to store the current scroll progress value
  const scrollRef = useRef(0);
  
  useFrame(() => {
    scrollRef.current = scrollProgress.get();
  });

  return <Scene scrollProgress={scrollRef.current} />;
}
