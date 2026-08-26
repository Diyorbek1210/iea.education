import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ssrDir = join(process.cwd(), ".output/server/_ssr");

function getMjsFiles(dir) {
  const entries = readdirSync(dir);
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...getMjsFiles(full));
    } else if (entry.endsWith(".mjs")) {
      files.push(full);
    }
  }
  return files;
}

const files = getMjsFiles(ssrDir);
let fixed = 0;

for (const filePath of files) {
  const src = readFileSync(filePath, "utf8");
  const lines = src.split("\n");

  const defStart = lines.findIndex((l) =>
    l.match(/^var createServerFn\s*=\s*\(options,\s*__opts\)\s*=>\s*\{/)
  );
  if (defStart === -1) continue;

  let braceCount = 0;
  let defEnd = -1;
  for (let i = defStart; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === "{") braceCount++;
      if (ch === "}") braceCount--;
    }
    if (braceCount === 0) {
      defEnd = i;
      break;
    }
  }
  if (defEnd === -1) {
    console.error(`Could not find end of createServerFn in ${filePath}`);
    continue;
  }

  const firstUsage = lines.findIndex(
    (l, i) => i < defStart && l.includes("createServerFn(")
  );
  if (firstUsage === -1) continue;

  const defLines = lines.slice(defStart, defEnd + 1);
  const after = lines.slice(defEnd + 1);
  const before = [
    ...lines.slice(0, defStart),
    ...lines.slice(defStart, defEnd + 1),
  ];
  // remove original
  const withoutDef = [...lines.slice(0, defStart), ...lines.slice(defEnd + 1)];

  let insertAt = 0;
  for (let i = 0; i < withoutDef.length; i++) {
    const l = withoutDef[i];
    if (
      l.startsWith("//#region") ||
      l.startsWith("var ") ||
      l.startsWith("async function") ||
      l.startsWith("function ")
    ) {
      if (i < firstUsage || i <= 20) {
        continue;
      }
    }
    if (l.includes("createServerFn(") || l.includes("createServerFn (")) {
      insertAt = i;
      break;
    }
  }

  // find the first region comment before the first createServerFn usage
  for (let i = 0; i < withoutDef.length; i++) {
    if (
      withoutDef[i].includes("createServerFn(") ||
      withoutDef[i].match(/=\s*createServerFn\s*\(/)
    ) {
      insertAt = i;
      break;
    }
  }

  const result = [
    ...withoutDef.slice(0, insertAt),
    ...defLines,
    ...withoutDef.slice(insertAt),
  ];

  writeFileSync(filePath, result.join("\n"));
  console.log(
    `Fixed ${filePath}: moved createServerFn (lines ${defStart + 1}-${defEnd + 1}) before line ${insertAt + 1}`
  );
  fixed++;
}

if (fixed === 0) {
  console.log("No files needed fixing (createServerFn ordering is already correct)");
} else {
  console.log(`Fixed ${fixed} file(s)`);
}
