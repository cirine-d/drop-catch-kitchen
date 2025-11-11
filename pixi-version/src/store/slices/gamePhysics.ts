import { StateCreator } from 'zustand';
import { BoundSlices } from '..';
import { Body, Composite, Engine, Runner, World } from 'matter-js';

export interface GamePhysics {
  engine: Engine;
  physicsWorld: World;
  addBody: (body: Body) => void;
  removeBody: (body: Body) => void;
  clearPhysics: () => void;
  updatePhysics: (delta: number) => void;
}

export const createGamePhysicsSlice: StateCreator<BoundSlices, [], [], GamePhysics> = (set, get) => {
  const engine = Engine.create();

  engine.world.bounds = { min: { x: 0, y: 0 }, max: { x: window.outerWidth, y: window.outerHeight } };

  return {
    engine,
    physicsWorld: engine.world,

    addBody: (body: Body) => {
      World.add(get().physicsWorld, body);
    },

    removeBody: (body: Body) => {
      World.remove(get().physicsWorld, body);
    },

    clearPhysics: () => {
      Composite.clear(engine.world, false);
    },

    updatePhysics: (delta: number) => {
      Engine.update(get().engine, delta * (1000 / 60));
    },
  };
};
