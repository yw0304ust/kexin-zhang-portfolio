import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: "github-pages",
  base: "./",
  plugins: [react()],
  build: {
    outDir: "../dist-github-pages",
    emptyOutDir: true,
  },
});
