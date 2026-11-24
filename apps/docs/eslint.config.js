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
            message: "The docs app must not access the database.",
          },
        ],
        patterns: [
          {
            group: ["../../packages/*", "../../../packages/*", "../../apps/*", "../../../apps/*"],
            message: "Use workspace package names for cross-package imports.",
          },
        ],
      },
    ],
  },
};

export default [...nextJsConfig, boundaryRules];
