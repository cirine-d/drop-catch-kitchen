import Matter, { Bodies, Body, Common, Engine, Events, Render, Runner, World } from 'matter-js';
import { useRef, useEffect } from 'react';
import { Application, extend } from '@pixi/react';
import { Container, Sprite } from 'pixi.js';
import { UI } from './UI';
import { Scene } from './Scene';
import { useBoundStore } from './store';

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Sprite,
});

export const App = () => {
  const { engine, world } = useBoundStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const render = Render.create({
      element: document.getElementById('main'),
      canvas: canvasRef.current!,
      engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: true,
        background: 'transparent',
        wireframeBackground: 'transparent',
      },
    });

    // Start the renderer + runner
    Render.run(render);
    // Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      // Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  return (
    <>
      <UI />
      <Application background={'#1099bb'} resizeTo={window}>
        <Scene />
      </Application>

      {/* remove after development */}
      <canvas
        id="mattersCanvas"
        ref={canvasRef}
        style={{
          position: 'absolute',
          width: ' 100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 10, // 👈 put on top
          pointerEvents: 'none', // 👈 let clicks go through
        }}
      />
      {/* remove after development */}
    </>
  );
};
