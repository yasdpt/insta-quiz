import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  if (mode !== "production") {
    return {
      server: {
        host: true,
        https: true,
      },
      plugins: [vue(), mkcert()],
    };
  } else {
    return {
      plugins: [vue()],
      build: {
        outDir: "dist",
      },
    };
  }
});
