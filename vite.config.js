import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // root: "./",
  root: process.env.VITE_BASE_PATH || "./",
  publicDir: "public",
  // base: process.env.NODE_ENV === "production" ? "/moon/" : "/",
  base: process.env.VITE_BASE_PATH || "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    assetsBase: "/",
    rollupOptions: {
      // Prevent Vite from injecting scripts into <head>
      input: "index.html"
    }
  },
});