[![Build Status](https://github.com/michaelschung/moon/actions/workflows/ci.yml/badge.svg)](https://github.com/michaelschung/moon/actions/workflows/ci.yml) ![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D23.3.0-brightgreen) ![License](https://img.shields.io/badge/license-GPL%20v3-blue)

# Phases of the Moon

## Introduction

An explainer article exploring the phases of the moon (and related topics) by way of interactive graphics. Built as a React app with Three.js graphics.

## Table of Contents

- [View live site](#view-live-site)
- [Local development](#local-development)
- [Technical overview](#technical-overview)
- [Updates](#updates)
- [License](#license)

## [View live site](https://michaelschung.github.io/moon/)

This app is publicly hosted on my GitHub Pages -- click above to check it out!

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

As mentioned above, this page is built as a React app with Three.js graphics. But specifically, it uses [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction) for declarative scene construction and [Zustand](https://github.com/pmndrs/zustand) for easier state management.

Admittedly, this page doesn't have a very good reason to be written in React, other than my own desire to learn it as a framework. Also, the previous version was created as plain JavaScript with p5.js graphics, which looked worse and behaved more jankily. But given that the task of simulating bodies in 3D space very much begs an object-oriented approach, I found myself fighting against the aggressively hierarchical nature of React. Thankfully, Zustand came to my rescue, and I learned by negation the types of apps that React is meant for -- perhaps that will be my next project!

In any case, this React-powered web page looks and functions much better than the previous version, and I'd like to point out a few technical highlights.

**React Three Fiber components (`src/three/`)**
- `PhaseScenes.jsx`/`EclipseScenes.jsx`/`FOVScenes.jsx`: These define all of the full scenes for each major section of the article.
- `Body.jsx`: Defines a `Body` component that renders a single celestial body according to various parameters, as well as `Moon`, `Earth`, and `Sun` components that are effectively "sub-classes" to `Body`.
- `Orbit.jsx`: Defines an `Orbit` component that renders an orbital relationship. You can tell that this is where I discovered Zustand.
- `Utils.jsx`: Various functions and components that are used consistently throughout the article. These include:
  - `getQuaternion`: Returns a quaternion for rotating shapes to a desired orientation.
  - `interpolate`: Calculates a vector in between a given `start` and `end` based on a slider's value, using linear interpolation. Used for all camera movements.
  - `Camera`/`TextToCamera`: Components for the camera within the scene, as well as a way to draw text that always faces towards the camera.
  - `StarryBackground`/`Sunlight`: Components to simulate the background elements of each scene.

**React components (`src/components/`)**
- Pretty straightforward. These each define a section of the article, and call in React Three Fiber scenes as necessary.
- One thing of note: `Main.jsx` uses an `IntersectionObserver` to detect when major sections enter and exit the viewport, loading and unloading as appropriate to avoid too many simultaneous WebGL contexts.

## Updates

### Releases

- **1.0**: Initial release (1/29/2025)
- **2.0**: Updated to React Three Fiber (2/13/2025)

### Roadmap

This is pretty much in its final state, but here are a few things that I may come back to:

#### Bugs

- In the final scene, it's possible to de-sync the "Hold mouse to move Moon" instructions.
- The accordions at the very end behave slightly weirdly at smaller screen sizes. This is a Pico problem, so I'm ignoring it for now.

#### Improvements

- Upgrade the "little red sphere" to an actual little figure of a person.
- Add Sun/Earth/Moon axial tilt/wobble for better realism.
- Add the solar corona to the solar eclipse scene, only at totality.
- Attach some kind of label to each slider(?)
- Standardize the usage of Zustand stores -- currently, earlier components such as `Body` and `Camera` rely on all attributes being passed in individually, which differs from later components like `Orbit`.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](https://github.com/michaelschung/moon/blob/main/LICENSE) file for details.