import reactRefresh from "@vitejs/plugin-react-refresh";
import path from "path";
import { injectHtml } from "vite-plugin-html";
import xtend from "xtend";

process.env.TARGET = process.env.TARGET || "web";
const isCordova = process.env.TARGET === "cordova";

const SRC_DIR = path.resolve(__dirname, "./src");
const PUBLIC_DIR = path.resolve(__dirname, "./public");
const BUILD_DIR = path.resolve(
  __dirname,
  isCordova ? "./cordova/www" : "./www"
);

export default {
  define: {
    "process.env": xtend(
      process.env,
      process.env.NODE_ENV !== "production"
        ? {
            BASE_URL: "http://localhost:8080",
          }
        : {
            BASE_URL: "http://watcher-api.cloud.koodeyo.com",
          }
    ),
  },
  plugins: [
    reactRefresh(),
    injectHtml({
      injectData: {
        TARGET: process.env.TARGET,
      },
    }),
  ],
  root: SRC_DIR,
  base: "",
  publicDir: PUBLIC_DIR,
  build: {
    outDir: BUILD_DIR,
    assetsInlineLimit: 0,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": SRC_DIR,
    },
  },
  server: {
    host: true,
  },
};
