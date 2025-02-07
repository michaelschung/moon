import { create } from "zustand"

export const createMoonStore = (pos, r, angle) =>
    create((set) => ({
        pos: pos,
        r: r,
        angle: angle,
        rotate: () => set((state) => ({angle: state.angle + 0.01})),
        // isRotating: false,
        // setRotating: (isRotating) => set({ isRotating }),
    }));

export const createOrbitStore = (primaryStore, satelliteStore, r, tilt) =>
    create((set) => ({
        primaryStore: primaryStore,
        satelliteStore: satelliteStore,
        r: r,
        angle: 0,
        tilt: tilt,
        revolve: () => set((state) => ({angle: state.angle + 0.01})),
    }));