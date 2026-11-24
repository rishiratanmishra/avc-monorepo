import { nextJsConfig } from "@repo/eslint-config/next-js";
import { sourceFiles } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config} */
const boundaryRules = {
  files: sourceFiles,
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@repo/database",
            message: "Database access belongs in the API and @repo/database.",
          },
        ],
        patterns: [
          {
            group: ["../../packages/*", "../../../packages/*", "../../apps/*", "../../../apps/*"],
            message: "Use workspace package names or app-local aliases for cross-boundary imports.",
          },
        ],
      },
    ],
  },
};

export default [...nextJsConfig, boundaryRules];
