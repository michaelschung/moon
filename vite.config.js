import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

console.log("VITE_BASE_PATH:", process.env.VITE_BASE_PATH);

export default defineConfig({
  plugins: [react()],
  root: "./",
  publicDir: "public",
  // base: process.env.NODE_ENV === "production" ? "/moon/" : "/",
  base: process.env.VITE_BASE_PATH || "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      // Prevent Vite from injecting scripts into <head>
      input: "index.html"
    }
  },
});