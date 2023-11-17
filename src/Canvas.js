import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Center,
  AccumulativeShadows,
  RandomizedLight,
  useTexture,
  Decal,
  OrbitControls
} from "@react-three/drei";
import { useRef } from "react";
import { Camera, RawShaderMaterial } from "three";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { state } from "./store";
import * as THREE from 'three';


export const App = ({ position = [0, 0, 2.5], fov = 25 }) => (
  <Canvas
      // camera={{ position, fov, near: 0.1, far: 1000 }}  // Adjust near and far values

    shadows
    gl={{preserveDrawingBuffer:true}}
    camera={{ position, fov }}
    eventSource={document.getElementById("root")}
    eventPrefix="client"
  >

     <ambientLight intensity={.5} />  // Adjust ambient light intensity
 <directionalLight
    intensity={1}
    position={[0, 0, 1]}  // Adjust the position to be in front of the shirt
  />
  <Environment preset="city" />

    <CameraRig>
      <Backdrop />
    <Center>
      <Shirt />
      </Center>
    </CameraRig>
    {/* <OrbitControls/> */}
  </Canvas>
);

function Shirt(props) {
  const snap = useSnapshot(state)
  
  const texture = useTexture(`/${snap.selectedDecal}.png`)
  const { nodes, materials } = useGLTF("/shirt_baked2.glb");
  // color of shirt
  useFrame((state, delta) =>
    easing.dampC(materials.lambert1.color, snap.selectedColor, 0.25, delta)
  )

console.log('Decal Texture:', texture);
  
  return (
   
      <mesh
      castShadow
      // receiveShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={materials.lambert1}
      material-roughness={2}
      position={[0.419, 0, 0]}
      rotation={[Math.PI / 2, 0, 0]}
      {...props}
      dispose={null}
    >
 <Decal
  position={[-.41, .35, -0.24]}
  rotation={[2, 0, 1]}
  scale={[0.15, 0.15, 0.7]}  // Adjust the scale as needed
  opacity={16} // Adjust the opacity if needed
  map={texture}
  mapAnisotropy={16}
/>
    </mesh>

  );
}

function Backdrop() {

    const shadows = useRef()

  useFrame((state, delta) =>
    easing.dampC(
      shadows.current.getMesh().material.color,
      state.selectedColor,
      0.25,
      delta
    )
  )
  
  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.85}
      scale={10}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}
    >
      <RandomizedLight
        amount={4}
        radius={9}
        intensity={0.55}
        ambient={0.25}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={0.25}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  );
}

function CameraRig({ children }) {
  const group = useRef()
  
  useFrame((state,delta) => {
    easing.dampE(
      group.current.rotation,
      [state.pointer.y / 10, -state.pointer.x / 5, 0],
      0.25,
      delta
    )
  })
  return <group ref={group}>{children}</group>
}


useGLTF.preload("/shirt_baked2.glb");
['/react.png', '/three2.png', '/pmndrs.png'].forEach(useTexture.preload)
