import { Config } from "@remotion/cli/config";

Config.setConcurrency(4);
Config.setVideoImageFormat("jpeg");
Config.setOutputLocation("out");
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setStudioPort(3001);
