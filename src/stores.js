import { create } from "zustand"

export const createBodyStore = (pos, r, angle) =>
    create((set) => ({
        pos: pos,
        r: r,
        angle: angle,
        setPos: (newPos) => set((state) => ({pos: newPos})),
        rotate: () => set((state) => ({angle: state.angle + 0.01})),
    }));

export const createOrbitStore = (primaryStore, satelliteStore, r, angle, tilt) =>
    create((set) => ({
        priStore: primaryStore,
        satStore: satelliteStore,
        r: r,
        angle: angle,
        tilt: tilt,
        setAngle: (newAngle) => set((state) => ({angle: newAngle})),
        revolve: () => set((state) => ({angle: state.angle + 0.01})),
    }));