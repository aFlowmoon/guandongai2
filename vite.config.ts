import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

function getPlugins() {
  const plugins = [
    react(),
    tsconfigPaths({
      configFile: "./tsconfig.json", // 显式指定 tsconfig.json 路径
    }),
  ];
  return plugins;
}

export default defineConfig({
  plugins: getPlugins(),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 手动配置 alias，避免找不到 @
    },
  },
  server: {
    host: "0.0.0.0", // 可以通过局域网访问
    port: 5173,      // 默认端口，可以改成你需要的
    proxy: {
      "/platform/dify": {
        target: "http://192.168.5.49:9900", // 代理到后端服务
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/platform\/dify/, "/platform/dify"), 
      },
    },
  },
});
