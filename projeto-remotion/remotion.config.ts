import { Config } from "@remotion/cli/config";
import path from "path";

// Aliasa os pacotes @remotion/google-fonts para shims locais (render offline,
// ambiente sem acesso a fonts.gstatic.com).
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias ?? {}),
      "@remotion/google-fonts/Anton": path.resolve(process.cwd(), "src/lib/gf-anton.ts"),
      "@remotion/google-fonts/Montserrat": path.resolve(process.cwd(), "src/lib/gf-montserrat.ts"),
    },
  },
}));

Config.setConcurrency(4);
Config.setVideoImageFormat("jpeg");
Config.setOutputLocation("out");
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setStudioPort(3001);
