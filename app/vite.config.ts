/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import react from "@vitejs/plugin-react";
import { URL, fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineProject } from "vitest/config";

const publicEnvVars = [
  "APP_ENV",
  "APP_NAME",
  "APP_ORIGIN",
  "VITE_GOOGLE_CLOUD_PROJECT",
  "VITE_FIREBASE_APP_ID",
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_GA_MEASUREMENT_ID",
];

/**
 * Vite configuration.
 * https://vitejs.dev/config/
 */
export default defineProject(async ({ mode }) => {
  const envDir = fileURLToPath(new URL("..", import.meta.url));
  const env = loadEnv(mode, envDir, "");

  publicEnvVars.forEach((key) => {
    if (!env[key]) throw new Error(`Missing environment variable: ${key}`);
    // VITE_ 접두사가 이미 있으므로 추가로 붙이지 않음
    process.env[key] = env[key];
  });

  return {
    cacheDir: fileURLToPath(new URL("../.cache/vite-app", import.meta.url)),

    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            firebase: ["firebase/analytics", "firebase/app", "firebase/auth"],
            react: ["react", "react-dom", "react-router-dom"],
          },
        },
      },
    },

    plugins: [
      // The default Vite plugin for React projects
      // https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"],
        },
      }),
    ],

    server: {
      proxy: {
        "/api": {
          target: process.env.LOCAL_API_ORIGIN ?? process.env.API_ORIGIN,
          changeOrigin: true,
        },
      },
    },

    test: {
      ...{ cache: { dir: "../.cache/vitest" } },
      environment: "happy-dom",
    },
  };
});
