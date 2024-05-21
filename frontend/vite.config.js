import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Resolute POS",
        short_name: "Resolute",
        description: "Manage Your Restaurant, Cafe, Hotel, Bar, Food Truck, Stall, any food store.",
        theme_color: "#EEEEEE",
        icons: [
          {
            src: "/logo_192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
