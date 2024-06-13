import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        game: "space_invaders_3D.html",
      },
    },
  },
  assetsInclude: ["**/*.glb"],
});
