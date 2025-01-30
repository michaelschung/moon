import { defineConfig } from "vite";

export default defineConfig({
  root: "./",
  publicDir: "public",
  base: "/moon/",
  build: {
    outDir: "dist",
    rollupOptions: {
      // Prevent Vite from injecting scripts into <head>
      input: "index.html"
    }
  },
});