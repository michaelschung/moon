import { defineConfig } from "vite";

export default defineConfig({
  root: "./",
  publicDir: "public",
  base: process.env.NODE_ENV === 'production' ? '/moon/' : '/',
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      // Prevent Vite from injecting scripts into <head>
      input: "index.html"
    }
  },
});