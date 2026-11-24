import babelParser from "@babel/eslint-parser";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import onlyWarn from "eslint-plugin-only-warn";

/**
 * File patterns for source files that must be linted. ESLint flat config
 * defaults only match .js/.mjs/.cjs, so TypeScript and JSX must be explicit.
 *
 * @type {string[]}
 * */
export const sourceFiles = ["**/*.{js,jsx,mjs,cjs,ts,tsx}"];

const typescriptFiles = ["**/*.{ts,tsx}"];

/**
 * A shared ESLint configuration for the repository.
 *
 * Babel 8's ESLint parser supports ESLint 10 and can parse TypeScript syntax
 * without upgrading the repository's TypeScript version. TypeScript-aware
 * scope rules remain a known limitation; see `docs/architecture/standards.md`.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  {
    ...js.configs.recommended,
    files: sourceFiles,
  },
  {
    ...eslintConfigPrettier,
    files: sourceFiles,
  },
  {
    files: sourceFiles,
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        babelOptions: {
          presets: ["@babel/preset-typescript"],
          parserOpts: {
            plugins: ["jsx"],
          },
        },
      },
    },
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    // Babel parses TypeScript syntax but does not build TypeScript-aware
    // scopes. These core rules report false positives on type references,
    // type-only imports, and JSX-transformed names. `tsc` is authoritative for
    // identifier resolution; ESLint remains authoritative for syntax, import,
    // framework, and accessibility rules.
    files: typescriptFiles,
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
  {
    files: sourceFiles,
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  },
];
