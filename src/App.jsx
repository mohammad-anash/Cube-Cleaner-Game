import { OrbitControls, useKeyboardControls } from '@react-three/drei';
import { Physics, RigidBody, InstancedRigidBodies } from '@react-three/rapier';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CreateGeometrys({ onRef }) {
  const [cubes, setCubes] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      index: i,
      position: [Math.random() * 20 - 10, 0.5, Math.random() * 20 - 10],
      color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    }))
  );

  useEffect(() => {
    onRef.current = (indexToRemove) => {
      setCubes((prev) => prev.filter((cube) => cube.index !== indexToRemove));
    };
  }, [onRef]);

  return (
    <>
      {cubes.map((cube) => (
        <RigidBody key={cube.index} userData={{ index: cube.index }}>
          <mesh scale={0.8} position={cube.position}>
            <boxGeometry />
            <meshBasicMaterial color={cube.color} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}

export function GameResult() {
  return <div className="result"></div>;
}

export function App() {
  const body = useRef();
  const [countCubes, setCubes] = useState(1);
  const cubeRemover = useRef(null);
  const [_, getKeys] = useKeyboardControls();
  const audio = new Audio('./pop-331049.mp3');
  const [second, setSecond] = useState(0);

  useFrame((state, delta) => {
    const { forward, rightward, backward, leftward } = getKeys();

    if (forward || backward || leftward || rightward) {
      setSecond(second + 1);
    }
    const impulse = { x: 0, y: 0, z: 0 };
    const impulseStrength = 100 * delta;

    if (forward) impulse.z -= impulseStrength;
    if (backward) impulse.z += impulseStrength;
    if (leftward) impulse.x -= impulseStrength;
    if (rightward) impulse.x += impulseStrength;

    body.current?.applyImpulse(impulse);
  });

  const handleCollision = (e) => {
    audio.play();

    const index = e.other.rigidBody?.userData?.index;
    if (typeof index === 'number') {
      setCubes(countCubes + 1);

      if (countCubes === 20) {
        const restart = document.querySelector('.restart');
        restart.style.display = 'block';
        restart.style.display = 'flex';

        const result = document.querySelector('.result');
        result.innnerText = `YOU CLEANED 20 CUBES WITHIN ${second}`;
        result.style.opacity = 1;
      }
      cubeRemover.current?.(index);
    }
  };

  const handleCollisionExit = (e) => {
    const index = e.other.rigidBody?.userData?.index;

    if (typeof index !== 'number') {
      const restart = document.querySelector('.restart');
      restart.style.display = 'block';
      restart.style.display = 'flex';
    }
  };

  return (
    <>
      <OrbitControls />
      <Physics>
        <CreateGeometrys onRef={cubeRemover} />

        <RigidBody type="fixed">
          <mesh scale={[25, 0.1, 25]}>
            <boxGeometry />
            <meshBasicMaterial color="orangered" />
          </mesh>
        </RigidBody>

        <RigidBody
          ref={body}
          colliders="cuboid"
          onCollisionEnter={handleCollision}
          onCollisionExit={handleCollisionExit}
        >
          <mesh scale={2} position={[0, 0.4, 11]}>
            <boxGeometry />
            <meshBasicMaterial color="limegreen" />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  );
}
