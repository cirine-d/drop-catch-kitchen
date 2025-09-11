import { Bodies, Body, Common, Composite, Events, Vertices } from 'matter-js';

import polyDecomp from 'poly-decomp';
Common.setDecomp(polyDecomp);

const basketVertices = Vertices.fromPath(
  '35 7 19 17 14 38 14 58 25 79 45 85 65 84 65 66 46 67 34 59 30 44 33 29 45 23 66 23 66 7 53 7',
  Body.create({})
);

var basketBody = Bodies.fromVertices(0, 0, [basketVertices], {
  label: 'basketBody',
  isStatic: true,
  frictionAir: 0,
  mass: Infinity,
  inverseMass: 0,
});

const sensor = Bodies.rectangle(0, 0, 2, 30, {
  label: 'basketSensor',
  isStatic: true,
  isSensor: true, // 👈 key: does not cause collisions, only triggers events
  frictionAir: 0,
  mass: Infinity,
  inverseMass: 0,
});

const basketLid = Bodies.rectangle(0, -60, 2, 40, {
  label: 'basketLid',
  isStatic: true,
  isSensor: true,
  frictionAir: 0,
  mass: Infinity,
  inverseMass: 0,
});

const bodies = [basketBody, sensor, basketLid];

bodies.forEach(body => {
  Body.scale(body, 2, 2);
  Body.rotate(body, -Math.PI / 2);
});

export const BasketMatter = Composite.create({ label: 'basket' });
Composite.add(BasketMatter, bodies);
