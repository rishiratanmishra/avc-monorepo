import pluginReactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import { config as baseConfig, sourceFiles } from "./base.js";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = [
  ...baseConfig,
  {
    files: sourceFiles,
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    ...pluginReactHooks.configs.flat.recommended,
    files: sourceFiles,
  },
  {
    ...jsxA11y.flatConfigs.recommended,
    files: ["**/*.{jsx,tsx}"],
  },
];
