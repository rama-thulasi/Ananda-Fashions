import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  base: "./",
  publicDir: false,
  build: {
    outDir: "dist-app",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "mobile.html"),
      },
    },
  },
});
