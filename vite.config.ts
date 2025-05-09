import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Alias Node.ts modules to our polyfills
        "default-browser-id": path.resolve(__dirname, "./nodeModulePolyfills.ts"),
        "default-browser": path.resolve(__dirname, "./nodeModulePolyfills.ts"),
        "open": path.resolve(__dirname, "./nodeModulePolyfills.ts"),
        "node:util": path.resolve(__dirname, "./nodeModulePolyfills.ts"),
        "node:process": path.resolve(__dirname, "./nodeModulePolyfills.ts"),
        "node:child_process": path.resolve(__dirname, "./nodeModulePolyfills.ts"),
      },
    },

    // Add optimizeDeps to exclude problematic packages
    optimizeDeps: {
      exclude: ['default-browser-id', 'default-browser', 'open'],
    },

    // Handle node modules in browser
    build: {
      rollupOptions: {
        external: ['default-browser-id', 'default-browser', 'open'],
      },
    },

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true,
      host: env.TAURI_DEV_HOST || false,
      hmr: env.TAURI_DEV_HOST
        ? {
          protocol: "ws",
          host: env.TAURI_DEV_HOST,
          port: 1421,
        }
        : undefined,
      watch: {
        // 3. tell vite to ignore watching `src-tauri`
        ignored: ["**/src-tauri/**"],
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  };
});
