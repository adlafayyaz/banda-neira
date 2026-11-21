import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        home: resolve("index.html"),
        islands: resolve("island-map.html"),
        guide: resolve("visit-guide.html"),
      },
    },
  },
});
