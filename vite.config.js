import { defineConfig } from "vite";

export default defineConfig({
  root: "./",
  publicDir: "public",
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    assetsBase: process.env.NODE_ENV === "production" ? "moon" : "/",
    rollupOptions: {
      // Prevent Vite from injecting scripts into <head>
      input: "index.html"
    }
  },
});