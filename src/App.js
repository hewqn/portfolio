import React, { Suspense, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Stage, useGLTF, Html, useProgress, Environment, OrbitControls } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';
import { useRef } from 'react';
import './App.css';
import * as THREE from 'three';

const lookTargets = {
  projects: [-1.71, -3.7, 0.5],
  experience: [-1.71, -3.7, 0.5],
  techstack: [-1.71, -4.7, 0.5],
  certificates: [-1.71, -8.5, 0.5],
  aboutme: [1.56, -0.35, 0.99], 
  awards: [1.53,-1.35, 0.99],
  contact: [1.50,-3.35, 0.99],
  smile: [1.50,-3.35, 0.99],
  screen_1: [-0.05, -0.9, 0], 
};

function CameraLogger() {
  const { camera } = useThree();
  const prevPosition = useRef(camera.position.clone());

  useFrame(() => {
    const currPos = camera.position;
    if (
      currPos.x !== prevPosition.current.x ||
      currPos.y !== prevPosition.current.y ||
      currPos.z !== prevPosition.current.z
    ) {
      //console.log('Camera moved to:', currPos.toArray());
      prevPosition.current.copy(currPos);
    }
  });

  return null;
}

function Room() {
  return (
    <>
      <mesh position={[0, -24.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[50, 50, 100]} />
        <meshStandardMaterial color="white" roughness={0.7} metalness={1.4} />
      </mesh>

      <mesh position={[0, 5, -12]} receiveShadow castShadow>
        <boxGeometry args={[50, 100, 1]} />
        <meshStandardMaterial color="#d1bba6" roughness={0.7} metalness={1} />
      </mesh>

      <mesh position={[0, 5, 12]} receiveShadow>
        <boxGeometry args={[50, 100, 1]} />
        <meshStandardMaterial color="white" roughness={0.7} metalness={1} />
      </mesh>

      <mesh position={[-10, 5, 0]} receiveShadow castShadow>
        <boxGeometry args={[1, 100, 50]} />
        <meshStandardMaterial color="white" roughness={0.7} metalness={1} />
      </mesh>

      <mesh position={[10, 5, 0]} receiveShadow castShadow>
        <boxGeometry args={[1, 100, 50]} />
        <meshStandardMaterial color="white" roughness={0.7} metalness={1} />
      </mesh>
    </>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
          color: 'white',
          fontSize: '100px',
          fontFamily: 'SoftMarshmallow, sans-serif', 
          textShadow: '1px 1px 2px black',
        }}>{progress.toFixed(0)}%</div>
    </Html>
  );
}

function DrawerGroup({ group, activeDrawer, setActiveDrawer }) {
  const [hovered, setHovered] = useState(false);
  const isOpen = activeDrawer === group.name;

  const { position } = useSpring({
    position: [
      group.position[0],
      group.position[1],
      isOpen ? group.position[2] + 1.1 : hovered ? group.position[2] + 0.5 : group.position[2],
    ],
    config: { mass: 1, tension: 200, friction: 20 },
  });

  const mainMeshes = {
    projects: "projects003",
    experience: "experience003",
    techstack: "techstack003",
    certificates: "certificates003",
    aboutme: "aboutme003",
    awards: "awards003",
    contact: "contact003",
    smile: "smile003",
  };

  return (
    <a.group position={position} scale={group.scale}>
      {group.children.map((mesh, i) => {
        const isMainMesh = mesh.name === mainMeshes[group.name];
        return (
          <primitive
            key={i}
            object={mesh}
            onPointerOver={isMainMesh ? () => setHovered(true) : undefined}
            onPointerOut={isMainMesh ? () => setHovered(false) : undefined}
            onClick={isMainMesh ? () => setActiveDrawer(group.name) : undefined}
          />
        );
      })}
    </a.group>
  );
}

function ClosetModel({ activeDrawer, setActiveDrawer }) {
  const { nodes } = useGLTF(process.env.PUBLIC_URL + '/models/closet/closet.glb');
  const [hoveredCube, setHoveredCube] = useState(false);
  useEffect(() => {
    console.log("GLTF Nodes:");
    Object.entries(nodes).forEach(([key, value]) => {
      console.log(key, value);
    });
  }, [nodes]);
  const drawerGroups = [
    { name: 'projects', position: [-1.726, 1.847, -0.111], scale: [0.671, 0.415, 0.415], children: [nodes.projects003, nodes.projects003_1, nodes.projects003_2] },
    { name: 'experience', position: [-1.743, 1.435, -0.134], scale: [0.58, 0.615, 0.44], children: [nodes.experience003, nodes.experience003_1, nodes.experience003_2] },
    { name: 'techstack', position: [-1.74, 1.023, -0.126], scale: [0.666, 0.455, 0.46], children: [nodes.techstack003, nodes.techstack003_1, nodes.techstack003_2] },
    { name: 'certificates', position: [-1.722, 0.609, -0.111], scale: [0.633, 0.388, 0.441], children: [nodes.certificates003, nodes.certificates003_1, nodes.certificates003_2] },
    { name: 'aboutme', position: [1.539, 1.851, -0.119], scale: [0.637, 1, 0.486], children: [nodes.aboutme003, nodes.aboutme003_1, nodes.aboutme003_2] },
    { name: 'awards', position: [1.549, 1.434, -0.11], scale: [0.716, 0.653, 0.5], children: [nodes.awards003, nodes.awards003_1, nodes.awards003_2] },
    { name: 'contact', position: [1.542, 1.028, -0.117], scale: [0.727, 0.537, 0.481], children: [nodes.contact003, nodes.contact003_1, nodes.contact003_2] },
    { name: 'smile', position: [1.551, 0.627, -0.101], scale: [0.722, 0.663, 0.415], children: [nodes.smile003, nodes.smile003_1, nodes.smile003_2] },
  ];

  const drawerMeshes = drawerGroups.flatMap(g => g.children);
  const otherMeshes = Object.values(nodes).filter(n => n.isMesh && !drawerMeshes.includes(n));

  return (
    <>
      {drawerGroups.map(group => (
        <DrawerGroup
          key={group.name}
          group={group}             
          activeDrawer={activeDrawer}
          setActiveDrawer={setActiveDrawer}
        />
      ))}
{nodes.screen_1 && (
  <>
    <ScreenTime mesh={nodes.screen_1} />
  <mesh
    geometry={nodes.screen_1.geometry}
    material={nodes.screen_1.material}
    castShadow
    receiveShadow
    onPointerOver={(e) => {
      e.stopPropagation();
      setHoveredCube(true);
    }}
    onPointerOut={(e) => {
      e.stopPropagation();
      setHoveredCube(false);
    }}
    onClick={(e) => {
      e.stopPropagation();
      setActiveDrawer("screen_1");
      console.log("Clicked computer!");
    }}
  >
    {hoveredCube && activeDrawer !== "screen_1" && (
      <Html
        position={[0, 2.5, 0]}
        center
        style={{
          transform: 'translateX(-50%)',
          color: 'mediumorchid',
          fontFamily: 'SoftMarshmallow, sans-serif',
          fontSize: '24px',
          whiteSpace: 'nowrap',
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
          WebkitTextStroke: '1px white',
          background: 'transparent',
          border: 'none',
        }}
      >
        click!
      </Html>
    )}
  </mesh>
  </>
)}


      {otherMeshes.map((mesh, i) => (
        <primitive
          key={mesh.name + i}
          object={mesh}
          castShadow
          receiveShadow
        />
      ))}
    </>
  );
}

function CameraController({ activeDrawer, setOrbitEnabled }) {
  const camera = useThree((state) => state.camera);

  const LOOK_TARGET = [0, 0.5, 0];
  const START_POSITION = [0, 0, 6.9];

  const cameraPositions = {
    projects: [-1.71, 0.37, 1.06],
    experience: [-1.71, -0.07, 1.03],
    techstack: [-1.71, -0.52, 1.02],
    certificates: [-1.71, -0.84, 1.00],
    aboutme: [1.56, 0.35, 0.99],
    awards: [1.53, 0.05, 1.07],
    contact: [1.50, -0.22, 1.14],
    smile: [1.50, -0.22, 1.14],
    screen_1: [-0.05, -0.2, 1.5],
  };

  useEffect(() => {
    if (activeDrawer) {
      setOrbitEnabled(false); 
      requestAnimationFrame(() => {
        camera.position.set(...cameraPositions[activeDrawer]);
        const target = lookTargets[activeDrawer] || LOOK_TARGET;
        camera.lookAt(...target);
      });
    } else {
      requestAnimationFrame(() => {
        camera.position.set(...START_POSITION);
        camera.lookAt(...LOOK_TARGET);
        setOrbitEnabled(true); 
      });
    }
  }, [activeDrawer, camera, setOrbitEnabled]);
  
  return null;
  }
  function ScreenTime({ mesh }) {
    const canvasRef = useRef(document.createElement('canvas'));
    const texture = useRef(new THREE.CanvasTexture(canvasRef.current));
    texture.current.flipY = false;

    useEffect(() => {
      const canvas = canvasRef.current;
      canvas.width = 2048; 
      canvas.height = 2048; 
      const ctx = canvas.getContext('2d');
  
      const interval = setInterval(() => {
        ctx.fillStyle = 'pink';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
  
        ctx.save();
        const x = canvas.width / 2.005;
        const y = canvas.height / 2.67;
        ctx.translate(x, y);
  
        ctx.scale(1.7, 1);
        
        ctx.rotate(Math.PI / 2);
  
        ctx.fillStyle = '#4B0082';
        ctx.font ='95px "SoftMarshmallow", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
  
        ctx.fillText(new Date().toLocaleTimeString(), 0, 0);

        ctx.restore();
        texture.current.needsUpdate = true;
      }, 1000);
  
      return () => clearInterval(interval);
    }, []);
  
    useEffect(() => {
      if (mesh) {
        const mat = new THREE.MeshBasicMaterial({ map: texture.current });
        mesh.material = mat; 
        mesh.rotation.z = 0; 
      }
      if (mesh) {
        console.log("Mesh object:", mesh);
        console.log("Mesh geometry:", mesh.geometry);
        console.log("Geometry parameters:", mesh.geometry.parameters);
        console.log("Mesh scale:", mesh.scale);
        console.log("Mesh rotation:", mesh.rotation);
        console.log("Mesh position:", mesh.position);
      }
    }, [mesh]);
  
    return null;
  }
  
  const drawerContent = {
    projects: (
      <div style={{ fontSize: '24px', textAlign: 'center' }}>
        <a
          href="https://hewqn.github.io/Fluoride-Project-2025/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            color: 'mediumorchid', 
            textDecoration: 'underline',
            backgroundColor: 'transparent',  
            padding: '0',
            margin: '0',
            display: 'block',     
            transform: ' translateX(1px) translateY(-4px)'     
          }}
        >
          View
        </a>
        <a
      href="https://hewqn.github.io/Sustainabilty-web-game/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        color: 'mediumorchid', 
        textDecoration: 'underline',
        backgroundColor: 'transparent',  
        padding: '0',
        margin: '0',
        display: 'block',
        fontFamily: "'SoftMarshmallow', sans-serif",
        transform: ' translateX(-50px) translateY(140px)'
      }}
    >
      View
    </a>
      </div>
    ),
    certificates: (
      <div style={{fontSize: '20px', textAlign: 'center' }}>
        <a
      href="https://badges.ucalgary.ca/achievements/c45d4b7d5203e4578357c3684f00fba9"
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        color: 'mediumorchid', 
        textDecoration: 'underline',
        backgroundColor: 'transparent',  
        padding: '0',
        margin: '0',
        display: 'block',
        fontFamily: "'SoftMarshmallow', sans-serif",
        transform: 'translateX(120px) translateY(95px)'
      }}
    >
      Tier 1
    </a>
    <a
      href="https://badges.ucalgary.ca/achievements/3e1ec497ae2e13ae7bf933d9dabb6424"
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        color: 'mediumorchid', 
        textDecoration: 'underline',
        backgroundColor: 'transparent',  
        padding: '0',
        margin: '0',
        display: 'block',
        fontFamily: "'SoftMarshmallow', sans-serif",
        transform: 'translateX(190px) translateY(72px)'
      }}
    >
      Tier 2
    </a>
    <a
      href="https://badges.ucalgary.ca/achievements/404b05cfb7b8688456552c16fb0ebc67"
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        color: 'mediumorchid', 
        textDecoration: 'underline',
        backgroundColor: 'transparent',  
        padding: '0',
        margin: '0',
        display: 'block',
        fontFamily: "'SoftMarshmallow', sans-serif",
        transform: 'translateX(260px) translateY(49px)'
      }}
    >
      Tier 3
    </a>
    <a
      href="https://badges.ucalgary.ca/achievements/301c09736300f4c6a8253a25fa957758"
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        color: 'mediumorchid', 
        textDecoration: 'underline',
        backgroundColor: 'transparent',  
        padding: '0',
        margin: '0',
        display: 'block',
        fontFamily: "'SoftMarshmallow', sans-serif",
        transform: 'translateX(120px) translateY(96px)'
      }}
    >
      Tier 1
    </a>
    <a
      href="https://badges.ucalgary.ca/achievements/b548ca065ac99d66147a02416a5cc29d"
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        color: 'mediumorchid', 
        textDecoration: 'underline',
        backgroundColor: 'transparent',  
        padding: '0',
        margin: '0',
        display: 'block',
        fontFamily: "'SoftMarshmallow', sans-serif",
        transform: 'translateX(190px) translateY(73px)'
      }}
    >
      Tier 2
    </a>
      </div>

    ),
    awards: (
      <div style={{fontSize: '24px', textAlign: 'center' }}>
        <a
      href="https://psacunion.ca/psac-announces-winners-2023-scholarship-program"
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        color: 'mediumorchid', 
        textDecoration: 'underline',
        backgroundColor: 'transparent',  
        padding: '0',
        margin: '0',
        display: 'block',
        fontFamily: "'SoftMarshmallow', sans-serif",
        transform: 'translateX(-20px) translateY(-8px)'
      }}
    >
     View
    </a>
      </div>
    ),
    contact: (
      <div style={{fontSize: '24px', textAlign: 'center' }}>
         <a
      href="https://github.com/hewqn"
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        color: 'mediumorchid', 
        textDecoration: 'underline',
        backgroundColor: 'transparent',  
        padding: '0',
        margin: '0',
        display: 'block',
        fontFamily: "'SoftMarshmallow', sans-serif",
        transform: 'translateX(-260px) translateY(-57px)'
      }}
    >
     GitHub
    </a>
    <a
      href="https://www.linkedin.com/in/hewqn/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        color: 'mediumorchid', 
        textDecoration: 'underline',
        backgroundColor: 'transparent',  
        padding: '0',
        margin: '0',
        display: 'block',
        fontFamily: "'SoftMarshmallow', sans-serif",
        transform: 'translateX(-230px) translateY(-3px)'
      }}
    >
     LinkedIn
    </a>
      </div>
    ),
  };
  
export default function App() {
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const fullText = "Welcome To My Closet!";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const { active: loadingActive } = useProgress();

  useEffect(() => {
    const speed = deleting ? 50 : 150; 
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayedText(fullText.slice(0, index + 1));
        setIndex(index + 1);
        if (index + 1 === fullText.length) {
          setTimeout(() => setDeleting(true), 1000); 
        }
      } else {
        setDisplayedText(fullText.slice(0, index - 1));
        setIndex(index - 1);
        if (index - 1 === 0) setDeleting(false);
      }
    }, speed);
  
    return () => clearTimeout(timeout);
  }, [index, deleting]);
  
  const showHeaders = !loadingActive && !activeDrawer;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {showHeaders && (
        <>
      <div
  style={{
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'mediumorchid',
    fontSize: '100px',
    fontFamily: 'SoftMarshmallow, sans-serif',
    textShadow: '2px 2px 4px black', 
    WebkitTextStroke: '1px white',   
    whiteSpace: 'nowrap',
    zIndex: 1000,
  }}
>
{displayedText}
  <span></span> 
</div>
<div
  style={{
    position: 'absolute',
    top: '120px', 
    left: '20px',
    color: 'white',
    fontSize: '30px',
    fontFamily: 'SoftMarshmallow, sans-serif',
    textShadow: '1px 1px 2px black',
    zIndex: 1000,
    maxWidth: '300px',
  }}
>
  *Use your mouse to drag/rotate/zoom*
</div>
<div
 style={{
  position: 'absolute',
  top: '120px', 
  right: '20px',
  color: 'white',
  fontSize: '30px',
  fontFamily: 'SoftMarshmallow, sans-serif',
  textShadow: '1px 1px 2px black',
  zIndex: 1000,
  maxWidth: '300px',
}}
>
*Click on drawer names to explore content!*
</div>
</>
      )}
      {activeDrawer && (
        <button
         className="back-button"
          onClick={() => setActiveDrawer(null)}
        >
          Back
        </button>
      )}
      <Canvas camera={{ position: [0, 0, 6.9], fov: 50 }} shadows>
        <ambientLight intensity={1} />
        <directionalLight
          position={[0, 400, 250]}
          intensity={5}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
        />

        <Suspense fallback={<Loader />}>
          <Stage
            environment="night"
            intensity={0.4}
            contactShadow={true}
            contactShadowBlur={20}
            shadows={true}
            adjustCamera={false}
          >
            <Environment preset="night" />
            <Room />
            <ClosetModel activeDrawer={activeDrawer} setActiveDrawer={setActiveDrawer} />
          </Stage>
        </Suspense>

        <CameraController
          activeDrawer={activeDrawer}
          setOrbitEnabled={setOrbitEnabled}
        />
 <CameraLogger />
        <OrbitControls
          target={[0, 0.5, 0]}
          enabled={orbitEnabled}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      {activeDrawer && drawerContent[activeDrawer] && (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(100%, -50%)',
        padding: '20px',
        borderRadius: '12px',
        color: 'white',
        pointerEvents: 'auto', 
        textAlign: 'center',
        fontFamily: "'SoftMarshmallow', sans-serif",
      }}
    >
      {drawerContent[activeDrawer]}
    </div>
  )}
    </div>
  );
}