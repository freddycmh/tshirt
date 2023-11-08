import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Center,
  useGLTF,
  AccumulativeShadows,
  RandomizedLight
} from "@react-three/drei";
import { useRef } from "react";
import { Camera, RawShaderMaterial } from "three";
import { easing } from "maath";

export const App = ({ position = [0, 0, 3], fov = 25 }) => (
  <Canvas
    shadows
    camera={{ position, fov }}
    eventSource={document.getElementById("root")}
    eventPrefix="client"
  >
    <ambientLight intensity={0.5} />
    <Environment preset="city" />

    <CameraRig>
    <Center>
      <Shirt />
      <Backdrop />
      </Center>
      
      </CameraRig>
  </Canvas>
);

function Shirt(props) {
  const { nodes, materials } = useGLTF("/shirt_baked2.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        position={[0.419, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

function Backdrop() {
  return (
    <AccumulativeShadows
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
