import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// See README for how VITE_API_URL is used - it points the frontend at the
// deployed backend URL in production, and localhost during development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
