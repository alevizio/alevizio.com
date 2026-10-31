import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next 16's flat config (the FlatCompat form Messa uses no longer loads).
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // The Stageshow kit is vendored as it ships (MIT, src/stageshow/LICENSE).
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "src/stageshow/**"]),
]);

export default eslintConfig;
