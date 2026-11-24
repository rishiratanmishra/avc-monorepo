import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baselinePath = join(root, "scripts", "css-token-baseline.json");
const baselineSchemaVersion = 3;
const updateBaseline = process.argv.includes("--update-baseline");
const reviewedBy = argumentValue("--reviewed-by");
const reviewReason = argumentValue("--reason");
const ignoredDirectories = new Set([
  "node_modules",
  ".next",
  "dist",
  "build",
  "out",
  "coverage",
  ".turbo",
]);

const canonicalBreakpointValues = new Set([639, 640, 768, 991, 992, 1024]);
const spacingProperties = new Set([
  "column-gap",
  "gap",
  "grid-column-gap",
  "grid-gap",
  "grid-row-gap",
  "margin",
  "margin-block",
  "margin-block-end",
  "margin-block-start",
  "margin-bottom",
  "margin-inline",
  "margin-inline-end",
  "margin-inline-start",
  "margin-left",
  "margin-right",
  "margin-top",
  "padding",
  "padding-block",
  "padding-block-end",
  "padding-block-start",
  "padding-bottom",
  "padding-inline",
  "padding-inline-end",
  "padding-inline-start",
  "padding-left",
  "padding-right",
  "padding-top",
  "row-gap",
]);

function argumentValue(name) {
  const prefix = `${name}=`;
  const argument = process.argv.find((value) => value.startsWith(prefix));
  return argument ? argument.slice(prefix.length).trim() : "";
}

function walk(directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...walk(join(directory, entry.name)));
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".css")) {
      files.push(join(directory, entry.name));
    }
  }

  return files;
}

function normalizeRawColor(value) {
  return value.toLowerCase().replace(/\s+/g, " ");
}

function normalizeLength(value) {
  const amount = Number(value[1]);

  if (!Number.isFinite(amount)) {
    return null;
  }

  if (amount === 0) {
    return null;
  }

  return `${String(amount)}${value[2].toLowerCase()}`;
}

function addCount(target, key, value) {
  const counts = target.get(key) ?? new Map();
  counts.set(value, (counts.get(value) ?? 0) + 1);
  target.set(key, counts);
}

function serializeCounts(target) {
  return Object.fromEntries(
    [...target.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, counts]) => [
        key,
        Object.fromEntries(
          [...counts.entries()].sort(([left], [right]) => left.localeCompare(right)),
        ),
      ]),
  );
}

function inspectSpacing(source, file, rawSpacingValuesByFile) {
  const declarationPattern = /(?:^|[;{])\s*([a-zA-Z-]+)\s*:\s*([^;}]+)/g;

  for (const declaration of source.matchAll(declarationPattern)) {
    const property = declaration[1].toLowerCase();

    if (!spacingProperties.has(property)) {
      continue;
    }

    for (const length of declaration[2].matchAll(/(-?\d*\.?\d+)(px|rem)\b/gi)) {
      const normalized = normalizeLength(length);

      if (normalized) {
        addCount(rawSpacingValuesByFile, file, `${property}:${normalized}`);
      }
    }
  }
}

function inspectBreakpoints(source, file, breakpointValuesByFile) {
  const atRulePattern = /@(media|container)\s+([^{]+)\{/gi;
  const lengthPattern = /(\d*\.?\d+)px\b/gi;

  for (const atRule of source.matchAll(atRulePattern)) {
    const prelude = atRule[2];

    for (const feature of prelude.matchAll(/\(\s*(min-width|max-width|width)\s*:\s*([^)]+)\)/gi)) {
      for (const length of feature[2].matchAll(lengthPattern)) {
        const normalized = normalizeLength([length[0], length[1], "px"]);

        if (normalized) {
          addCount(breakpointValuesByFile, file, normalized);
        }
      }
    }

    for (const range of prelude.matchAll(/\bwidth\s*(?:>=|<=|>|<|=)\s*(\d*\.?\d+)px\b/gi)) {
      const normalized = normalizeLength([range[0], range[1], "px"]);

      if (normalized) {
        addCount(breakpointValuesByFile, file, normalized);
      }
    }
  }
}

const cssFiles = ["apps", "packages"]
  .map((directory) => join(root, directory))
  .flatMap((directory) => walk(directory));

const definedTokens = new Set();
const usedTokens = new Set();
const rawColorValuesByFile = new Map();
const rawSpacingValuesByFile = new Map();
const breakpointValuesByFile = new Map();

for (const file of cssFiles) {
  const source = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const key = relative(root, file).replace(/\\/g, "/");

  for (const match of source.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)) {
    definedTokens.add(match[1]);
  }

  for (const match of source.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)/g)) {
    usedTokens.add(match[1]);
  }

  const rawColors = source.match(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\([^)]*\)/gi) ?? [];

  if (rawColors.length > 0) {
    const counts = new Map();

    for (const rawColor of rawColors) {
      const normalized = normalizeRawColor(rawColor);
      counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    }

    rawColorValuesByFile.set(key, counts);
  }

  inspectSpacing(source, key, rawSpacingValuesByFile);
  inspectBreakpoints(source, key, breakpointValuesByFile);
}

const undefinedTokens = [...usedTokens].filter((token) => !definedTokens.has(token)).sort();

if (updateBaseline && (!reviewedBy || !reviewReason)) {
  console.error(
    "Baseline updates require an explicit review record. Run:\n" +
      "  node scripts/check-css-tokens.mjs --update-baseline --reviewed-by=<name> --reason=<why>\n" +
      "Then include the baseline diff in code review.",
  );
  process.exit(1);
}

const baseline = updateBaseline
  ? null
  : existsSync(baselinePath)
    ? JSON.parse(readFileSync(baselinePath, "utf8"))
    : null;

if (updateBaseline || !baseline) {
  const nextBaseline = {
    schemaVersion: baselineSchemaVersion,
    review: {
      reviewedBy,
      reason: reviewReason,
      updatedAt: new Date().toISOString(),
    },
    allowedUndefinedCustomProperties: undefinedTokens,
    rawColorValuesByFile: serializeCounts(rawColorValuesByFile),
    rawSpacingValuesByFile: serializeCounts(rawSpacingValuesByFile),
    breakpointValuesByFile: serializeCounts(breakpointValuesByFile),
  };
  writeFileSync(baselinePath, `${JSON.stringify(nextBaseline, null, 2)}\n`, "utf8");

  if (updateBaseline) {
    console.log(`Updated CSS token baseline from ${cssFiles.length} CSS files.`);
    console.log("Include the baseline diff in code review; --update-baseline is not a bypass.");
    process.exit(0);
  }

  console.error(
    "Missing CSS token baseline. Run the reviewed baseline update command in docs/design-system/standards.md.",
  );
  process.exit(1);
}

if (
  baseline.schemaVersion !== baselineSchemaVersion ||
  !baseline.review?.reviewedBy ||
  !baseline.review?.reason
) {
  console.error(
    `CSS token baseline is missing schemaVersion ${baselineSchemaVersion} review metadata. Regenerate it with --update-baseline.`,
  );
  process.exit(1);
}

const allowedUndefined = new Set(baseline.allowedUndefinedCustomProperties ?? []);
const allowedRawColors = baseline.rawColorValuesByFile ?? {};
const allowedRawSpacing = baseline.rawSpacingValuesByFile ?? {};
const allowedBreakpoints = baseline.breakpointValuesByFile ?? {};
const problems = [];

for (const token of undefinedTokens) {
  if (!allowedUndefined.has(token)) {
    problems.push(`new undefined custom property: ${token}`);
  }
}

for (const [file, counts] of rawColorValuesByFile) {
  for (const [value, count] of counts) {
    const allowedCount = allowedRawColors[file]?.[value] ?? 0;

    if (count > allowedCount) {
      problems.push(
        `new raw color value in ${file}: ${value} (${count} found, ${allowedCount} allowed)`,
      );
    }
  }
}

for (const [file, counts] of rawSpacingValuesByFile) {
  for (const [value, count] of counts) {
    const allowedCount = allowedRawSpacing[file]?.[value] ?? 0;

    if (count > allowedCount) {
      problems.push(
        `new raw spacing value in ${file}: ${value} (${count} found, ${allowedCount} allowed)`,
      );
    }
  }
}

for (const [file, counts] of breakpointValuesByFile) {
  for (const [value, count] of counts) {
    if (canonicalBreakpointValues.has(Number.parseFloat(value))) {
      continue;
    }

    const allowedCount = allowedBreakpoints[file]?.[value] ?? 0;

    if (count > allowedCount) {
      problems.push(
        `new noncanonical breakpoint width in ${file}: ${value} (${count} found, ${allowedCount} allowed)`,
      );
    }
  }
}

if (problems.length > 0) {
  console.error("CSS token guard failed:");
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

console.log(`CSS token guard passed: ${cssFiles.length} CSS files checked.`);
