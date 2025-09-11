import { StateCreator } from 'zustand';
import { BoundSlices } from '..';
import { Body, Engine, Runner, World } from 'matter-js';

export interface GamePhysics {
  engine: Engine;
  world: World;
  addBody: (body: Body) => void;
  removeBody: (body: Body) => void;
  updatePhysics: (delta: number) => void;
}

export const createGamePhysicsSlice: StateCreator<BoundSlices, [], [], GamePhysics> = (set, get) => {
  const engine = Engine.create();

  engine.world.bounds = { min: { x: 0, y: 0 }, max: { x: window.outerWidth, y: window.outerHeight } };

  return {
    engine,
    world: engine.world,

    addBody: (body: Body) => {
      World.add(get().world, body);
    },

    removeBody: (body: Body) => {
      World.remove(get().world, body);
    },

    updatePhysics: (delta: number) => {
      Engine.update(get().engine, delta * (1000 / 60));
    },
  };
};
