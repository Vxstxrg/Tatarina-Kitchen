const defineComputeConfig = <T,>(config: T) => config;

export default defineComputeConfig({
  app: {
    framework: "nextjs",
    region: "eu-central-1",
    build: {
      command:
        "\"C:\\Program Files\\nodejs\\node.exe\" \"C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js\" run build",
      outputDirectory: ".next/standalone",
    },
  },
});
