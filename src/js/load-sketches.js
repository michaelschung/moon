import { moonPhases, moonRevolve, rotateTest } from "./phases.js";
import { sketch2 } from "./sketch2.js";
import { sketch3 } from "./sketch3.js";

new p5(moonPhases, 'sketch1');
new p5(moonRevolve, 'sketch2');
// new p5(sketch3, 'sketch3');