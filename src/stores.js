import { create } from "zustand"

export const createBodyStore = (pos, r, angle) =>
    create((set) => ({
        pos: pos,
        r: r,
        angle: angle,
        setPos: (newPos) => set((state) => ({pos: newPos})),
        setAngle: (newAngle) => set((state) => ({angle: newAngle})),
        rotate: (rate) => set((state) => ({angle: state.angle + rate})),
    }));

export const createOrbitStore = (primaryStore, satelliteStore, r, angle, tilt) =>
    create((set) => ({
        priStore: primaryStore,
        satStore: satelliteStore,
        r: r,
        angle: angle,
        tilt: tilt,
        setAngle: (newAngle) => set((state) => ({angle: newAngle})),
        revolve: (rate) => set((state) => ({angle: state.angle + rate})),
    }));