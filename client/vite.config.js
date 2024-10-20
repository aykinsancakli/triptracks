import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Automatically inject the `mixins.scss` into every SCSS file
        additionalData: `@import './src/sass/mixins.scss';`,
      },
    },
  },
});
