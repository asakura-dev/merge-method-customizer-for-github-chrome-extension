import { defineManifest } from "@crxjs/vite-plugin";
import { REPOSITORY_HOSTS } from "./src/constant/constant";

export default defineManifest(async () => ({
  manifest_version: 3,
  name: "Merge Method Customizer For Github Chrome Extension",
  version: "1.0.0",
  action: { default_popup: "index.html" },
  permissions: ["storage", "tabs"],
  content_scripts: [
    {
      js: ["./src/content_script.ts"],
      matches: REPOSITORY_HOSTS,
    },
  ],
  background: {
    service_worker: "./src/background.ts",
    persistent: true,
  },
}));
