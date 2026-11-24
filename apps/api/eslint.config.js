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
            message: "The API must not import presentation components.",
          },
          {
            name: "next",
            message: "The API must not import Next.js modules.",
          },
          {
            name: "react",
            message: "The API must not import React modules.",
          },
        ],
        patterns: [
          {
            group: ["../web/**", "../admin/**", "../docs/**"],
            message: "The API must not import application code from client apps.",
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
