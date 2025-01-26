import { moonPhases, moonRevolve, moonQuarters, phaseView } from "./phases.js";
import { sketch2 } from "./sketch2.js";
import { sketch3 } from "./sketch3.js";

// Why does the Moon have phases?
new p5(moonPhases, "moonPhases");
new p5(moonRevolve, "moonRevolve");
new p5(moonQuarters, "moonQuarters");
new p5(phaseView(0, false), "quarterView0");
new p5(phaseView(1, false), "quarterView1");
new p5(phaseView(2, false), "quarterView2");
new p5(phaseView(3, false), "quarterView3");
new p5(phaseView(0.5, false), "waxingCrescent");
new p5(phaseView(1.5, false), "waxingGibbous");
new p5(phaseView(2.5, false), "waningGibbous");
new p5(phaseView(3.5, false), "waningCrescent");
new p5(phaseView(0, true), "phaseView");

// new p5(phaseView(1), "sketch2");
// new p5(sketch3, 'sketch3');