[![Build Status](https://github.com/michaelschung/moon/actions/workflows/ci.yml/badge.svg)](https://github.com/michaelschung/moon/actions/workflows/ci.yml) ![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D23.3.0-brightgreen) ![License](https://img.shields.io/badge/license-GPL%20v3-blue)

# Phases of the Moon

## Introduction

A simple web page exploring the phases of the moon (and related topics) by way of interactive graphics. Built in HTML/CSS/JavaScript, using p5.js for the visuals.

## Table of Contents

- [View live site](#view-live-site)
- [Local development](#local-development)
- [Technical overview](#technical-overview)
- [Updates](#updates)
- [License](#license)

## [View live site](https://moon-344h.onrender.com/)

This app is publicly hosted as a [Render](https://render.com/) app -- click above to check it out!

## Local development

Clone this repo and enter the home folder.

```bash
$ git clone git@github.com:michaelschung/moon.git moon
$ cd moon
```

Install Node dependencies and start the development server.

```bash
$ npm install
$ npm run dev
```

This will launch a local server to [`localhost:5173`](http://localhost:5173/) using Vite for fast development. See the [Vite docs](https://vite.dev/guide/static-deploy.html) for instructions on deployment.

## Technical overview

The architecture of this page is incredibly simple – just a plain, static website that calls in some p5 instances for graphics. The real work was in those graphics. There are seven JS files in this project: six of them organize p5 code into logical groups, and the seventh acts as a module to dynamically load and unload sketches within the page. Here are some highlights.

**Organizational p5 code**
- `phases.js`: All sketches found in the "Why does the Moon have phases?" section.
- `eclipses.js`: All sketches found in the "What about eclipses?" section.
- `fov.js`: All sketches found in the "What about daytime?" section.
- `body.js`: Defines a `Body` class, which is extended by `Moon`, `Earth`, and `Sun`. The fun part here is in `drawLitSphere`, which renders a body as a collection of longitudinal slices, colored according to their orientation with respect to a light direction.
- `orbit.js`: Defines an `Orbit` class, which maintains the relationship between a primary body and its satellite. My favorite function here is `calculateCoords`, which computes the position of the satellite as a function of the orbital radius and angular tilt of the orbital plane.
- `utils.js`: A whole bunch of functions (and two small classes) for repetitive code. These include:
  - `rotateToCamera`: Rotates the world axes to align with a given camera. Crucial for drawing legible text on screen.
  - `cameraAwareText`: Uses `rotateToCamera` to draw text in 3D space that's always oriented toward the camera.
  - `draw2DText`: Draws text a fixed distance away from the camera, so that it appears fixed to the 2D canvas.
  - `interpolate`: Calculates a vector in between a given `start` and `end` based on a slider's value, using linear interpolation.

**Sketch-loading module: `load-sketches.js`**
- Maintains a map of sketch IDs to their p5 instances.
- Uses an `IntersectionObserver` to detect when sketches enter and exit the viewport, loading and unloading as appropriate.

This dynamic sketch loading is necessary since rendering all sketches simultaneously slows them all down. But it exhibits slightly glitchy behavior when scrolling too quickly, or when the taller sketches load or unload and pull the page with them. There may be a smart way to fix this, but I'm already planning to move the whole thing to React which I *think* will be a better long-term solution.

## Updates

### Releases

- **1.0.0**: Initial release (1/16/2025)

### Roadmap

There are two main changes that I would like to make:
- **Remake the app in React** to enhance performance and provide a smoother experience.
- **Migrate graphics to Three.js** for more powerful 3D rendering.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](https://github.com/michaelschung/moon/blob/main/LICENSE) file for details.