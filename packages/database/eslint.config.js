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
            name: "@repo/ui",
            message: "The database package must not import UI implementation.",
          },
          {
            name: "next",
            message: "The database package must not import Next.js.",
          },
          {
            name: "react",
            message: "The database package must not import React.",
          },
        ],
        patterns: [
          {
            group: ["../../apps/**", "../contracts/**", "../ui/**"],
            message: "The database package must not import application or presentation code.",
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
