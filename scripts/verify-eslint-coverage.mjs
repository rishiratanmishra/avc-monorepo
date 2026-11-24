import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const expectedParser = "@babel/eslint-parser";
const sourceFilePattern = /\.(js|jsx|mjs|cjs|ts|tsx)$/;
const ignoredDirectories = new Set([
  "node_modules",
  ".next",
  "dist",
  "build",
  "out",
  "coverage",
  ".turbo",
]);

const workspaceDirectories = packageJson.workspaces.flatMap((pattern) => {
  if (!pattern.endsWith("/*")) {
    return [];
  }

  const parent = resolve(root, pattern.slice(0, -2));

  if (!existsSync(parent)) {
    return [];
  }

  return readdirSync(parent, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(parent, entry.name));
});

function walk(directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...walk(join(directory, entry.name)));
      }
      continue;
    }

    if (entry.isFile() && sourceFilePattern.test(entry.name)) {
      files.push(join(directory, entry.name));
    }
  }

  return files;
}

function isEnabled(value) {
  if (Array.isArray(value)) {
    return value[0] !== 0 && value[0] !== "off";
  }

  return value !== 0 && value !== "off" && value !== undefined;
}

function isOff(value) {
  if (Array.isArray(value)) {
    return value[0] === 0 || value[0] === "off";
  }

  return value === 0 || value === "off";
}

function expectedRulesFor(file, workspaceName) {
  const expected = {
    "turbo/no-undeclared-env-vars": { enabled: true },
  };

  if (/\.tsx?$/.test(file)) {
    expected["no-undef"] = { off: true };
    expected["no-unused-vars"] = { off: true };
  }

  if (/\.(jsx|tsx)$/.test(file)) {
    expected["jsx-a11y/alt-text"] = { enabled: true };
  }

  if (workspaceName !== "@repo/ui") {
    expected["no-restricted-imports"] = { enabled: true };
  }

  return expected;
}

const failures = [];
const workspaceSummaries = [];
let checkedFiles = 0;
let ignoredFiles = 0;

for (const workspaceDirectory of workspaceDirectories) {
  const manifestPath = join(workspaceDirectory, "package.json");

  if (!existsSync(manifestPath)) {
    continue;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

  if (!manifest.scripts?.lint) {
    continue;
  }

  const eslint = new ESLint({ cwd: workspaceDirectory });
  let workspaceFiles = 0;

  for (const file of walk(workspaceDirectory)) {
    const relativeFile = relative(workspaceDirectory, file).replace(/\\/g, "/");

    if (await eslint.isPathIgnored(file)) {
      ignoredFiles += 1;
      continue;
    }

    let config;

    try {
      config = await eslint.calculateConfigForFile(file);
    } catch (error) {
      failures.push(`${manifest.name} ${relativeFile}: config resolution failed: ${error.message}`);
      continue;
    }

    const parserName = config.languageOptions?.parser?.meta?.name;

    if (parserName !== expectedParser) {
      failures.push(
        `${manifest.name} ${relativeFile}: expected ${expectedParser}, got ${JSON.stringify(parserName)}`,
      );
    }

    for (const [rule, expectation] of Object.entries(
      expectedRulesFor(relativeFile, manifest.name),
    )) {
      const actual = config.rules?.[rule];

      if (expectation.enabled && !isEnabled(actual)) {
        failures.push(`${manifest.name} ${relativeFile}: ${rule} is not enabled`);
      }

      if (expectation.off && !isOff(actual)) {
        failures.push(`${manifest.name} ${relativeFile}: ${rule} is not off for TypeScript`);
      }
    }

    workspaceFiles += 1;
    checkedFiles += 1;
  }

  if (workspaceFiles === 0) {
    failures.push(`${manifest.name}: no lintable source files discovered`);
  }

  workspaceSummaries.push(`${manifest.name}=${workspaceFiles}`);
}

if (workspaceSummaries.length === 0) {
  failures.push("no workspaces with a lint script were discovered");
}

if (failures.length > 0) {
  console.error("ESLint coverage guard failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `ESLint coverage guard passed: ${checkedFiles} source files across ${workspaceSummaries.length} linted workspaces.`,
);
console.log(`Ignored files skipped: ${ignoredFiles}.`);
console.log(`Coverage: ${workspaceSummaries.join(", ")}.`);
