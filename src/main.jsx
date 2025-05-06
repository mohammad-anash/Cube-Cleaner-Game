import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { App } from './App.jsx';
import { GameResult } from './App.jsx';
import { KeyboardControls } from '@react-three/drei';
import Interface from './interface.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <>
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
        { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
        { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] }, // Fixed: 'leftward' should be left movement
        { name: 'rightward', keys: ['ArrowRight', 'KeyD'] }, // Fixed: 'rightward' should be right movement
      ]}
    >
      <Canvas
        style={{ backgroundColor: 'grey' }}
        camera={{
          position: [0, 10, 15],
        }}
      >
        <App />
      </Canvas>
      <Interface />
      <GameResult />
    </KeyboardControls>
  </>
);