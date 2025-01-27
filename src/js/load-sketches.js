import { moonPhases, moonRevolve, moonQuarters, phaseView } from "./phases.js";
import { lunarEclipse, testShadow } from "./eclipses.js";

// Map ids to p5 instances
const sketchMap = {
    // Why does the Moon have phases?
    // moonPhases: moonPhases,
    // moonRevolve: moonRevolve,
    // moonQuarters: moonQuarters,
    // quarterView0: phaseView(0, false),
    // quarterView1: phaseView(1, false),
    // quarterView2: phaseView(2, false),
    // quarterView3: phaseView(3, false),
    // waxingCrescent: phaseView(0.5, false),
    // waxingGibbous: phaseView(1.5, false),
    // waningGibbous: phaseView(2.5, false),
    // waningCrescent: phaseView(3.5, false),
    // phaseView: phaseView(0, true),
    // What about eclipses?
    lunarEclipse: lunarEclipse,
    // testShadow: testShadow
};

// Store active p5 instances
const sketches = {};

function loadSketch(sketchID) {
    if (!sketches[sketchID]) {
        const sketchFn = sketchMap[sketchID];
        sketches[sketchID] = new p5(sketchFn, sketchID);
    } else {
        const sketch = sketches[sketchID];
        const canvas = document.getElementById(sketchID).querySelector("canvas");
        canvas.style.display = "block";
        sketch.loop();

        // Call the p5 instance"s showSlider (if it exists)
        if (sketch.showSlider) {
            sketch.showSlider();
        }
    }
}

function unloadSketch(sketchID) {
    if (sketches[sketchID]) {
        const sketch = sketches[sketchID];
        // Call the p5 instance"s hideSlider (if it exists)
        if (sketch.hideSlider) {
            sketch.hideSlider();
        }
        const canvas = document.getElementById(sketchID).querySelector("canvas");
        canvas.style.display = "none";
        sketch.noLoop();
    }
}

// Intersection Observer callback
function handleIntersect(entries) {
    entries.forEach((entry) => {
        const sketchID = entry.target.id;

        if (entry.isIntersecting) {
            // Load sketch when the container is in the viewport
            loadSketch(sketchID);
        } else {
            // Unload sketch when the container leaves the viewport
            unloadSketch(sketchID);
        }
    });
}

const observer = new IntersectionObserver(handleIntersect, {
    root: null,
    rootMargin: "500px", // Expand viewport by 500px (keeps just-offscreen elements loaded)
    threshold: 0, // Load when at least 1% of the element is in the viewport
});

// Observe all sketch containers
document.querySelectorAll(".sketch-container").forEach((sketch) => {
    observer.observe(sketch);
});