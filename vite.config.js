import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = env.APP_PORT ? Number(env.APP_PORT) : undefined;

  return {
    plugins: [react()],
    server: { port },
    preview: { port }
  };
});
