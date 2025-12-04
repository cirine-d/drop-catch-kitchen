import { Bodies, Body, Common, Composite, Constraint, Vertices } from 'matter-js';

import polyDecomp from 'poly-decomp';
Common.setDecomp(polyDecomp);

const basketVertices = Vertices.fromPath(
  '-110,-260.6 -121,-260.6 -121,-232.6 -111,-197.6 -92,-181.6 -68,-174.6 -15,-173.6 10,-182.6 29,-200.6 37,-235.6 35,-261.6 27,-261.6 25,-228.6 21,-209.6 0,-190.6 -19,-184.6 -68,-186.6 -88,-191.6 -105,-205.6 -110,-231.6',
  Body.create({})
);

var basketBody = Bodies.fromVertices(0, 0, [basketVertices], {
  label: 'basketBody',
  isStatic: true,
  frictionAir: 0,
  mass: Infinity,
  inverseMass: 0,
});

const ingredientSensor = Bodies.rectangle(0, 15, 90, 2, {
  label: 'basketIngredientSensor',
  isStatic: true,
  isSensor: true, // 👈 key: does not cause collisions, only triggers events
  frictionAir: 0,
  mass: Infinity,
  inverseMass: 0,
});

const basketLid = Bodies.rectangle(0, -60, 130, 5, {
  label: 'basketLid',
  isStatic: true,
  isSensor: true,
  frictionAir: 0,
});

const applianceSensor = Bodies.rectangle(0, 50, 20, 10, {
  label: 'basketApplianceSensor',
  isSensor: true,
  isStatic: false,
});

// Constraint links sensor to basket
const basketConstraint = Constraint.create({
  label: 'constraint',
  bodyA: ingredientSensor,
  bodyB: applianceSensor,
  stiffness: 1,
});

const bodies = [basketBody, ingredientSensor, basketLid, applianceSensor];

bodies.forEach(body => {
  Body.scale(body, 1.2, 1.2);
});

export const BasketMatter = Composite.create({ label: 'basket' });
Composite.add(BasketMatter, [...bodies, basketConstraint]);
