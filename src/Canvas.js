import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Center,
  useGLTF,
  AccumulativeShadows,
  RandomizedLight,
  OrbitControls
} from "@react-three/drei";
import { useRef } from "react";
import { Camera, RawShaderMaterial } from "three";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { state } from "./store";
import * as THREE from 'three';


export const App = ({ position = [0, 0, 3], fov = 25 }) => (
  <Canvas
    shadows
    camera={{ position, fov }}
    eventSource={document.getElementById("root")}
    eventPrefix="client"
  >

    {/* lighting of shirt */}
     <ambientLight intensity={.5} />  // Adjust ambient light intensity
 <directionalLight
    intensity={1}
    position={[0, 0, 1]}  // Adjust the position to be in front of the shirt
  />
  <Environment preset="city" />

    <CameraRig>
    <Center>
      <Shirt />
      <Backdrop />
      </Center>
    </CameraRig>
     {/* <OrbitControls /> */}
  </Canvas>
);

function Shirt(props) {
  const snap= useSnapshot(state)
  const { nodes, materials } = useGLTF("/shirt_baked2.glb");
  // color of shirt
  useFrame((state, delta) =>
    easing.dampC(materials.lambert1.color, snap.selectedColor, 0.25, delta)
  )
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={2}
        position={[0.419, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
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
