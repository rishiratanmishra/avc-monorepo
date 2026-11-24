import { config as baseConfig, sourceFiles } from "@repo/eslint-config/base";
import globals from "globals";

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
            message: "API clients must not depend on database implementation.",
          },
          {
            name: "@repo/ui",
            message: "API clients must not depend on UI implementation.",
          },
          {
            name: "next",
            message: "API clients must not depend on Next.js.",
          },
          {
            name: "react",
            message: "API clients must not depend on React.",
          },
        ],
        patterns: [
          {
            group: ["../../apps/**", "../database/**", "../ui/**"],
            message: "API clients are boundary packages and must not import implementation packages.",
          },
        ],
      },
    ],
  },
};

export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  boundaryRules,
];
