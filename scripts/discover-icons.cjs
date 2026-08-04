const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const KEY = 42;
const outDir = path.join(process.env.TEMP, "lordicon-discover");
fs.mkdirSync(outDir, { recursive: true });

const want = [
  /wrench/i,
  /hard.?hat/i,
  /helmet/i,
  /hammer/i,
  /screwdriver/i,
  /toolbox/i,
  /tools?/i,
  /\bbox\b/i,
  /package/i,
  /parcel/i,
  /clipboard/i,
  /document/i,
  /list/i,
  /check.?list/i,
  /worker/i,
  /construction/i,
  /repair/i,
];

const families = [
  "wired/outline",
  "wired/flat",
  "system/regular",
  "system/solid",
];

// Probe known index ranges from earlier discoveries + neighbors
const indexes = [];
for (let i = 1; i <= 100; i++) indexes.push(i);
for (let i = 130; i <= 220; i++) indexes.push(i);
for (let i = 460; i <= 520; i++) indexes.push(i);
for (let i = 700; i <= 780; i++) indexes.push(i);
for (let i = 980; i <= 1000; i++) indexes.push(i);
for (let i = 1680; i <= 1720; i++) indexes.push(i);

function decodeLi(text) {
  const raw = Buffer.from(String(text).trim(), "base64");
  const decoded = Buffer.alloc(raw.length);
  for (let i = 0; i < raw.length; i++) decoded[i] = raw[i] ^ KEY;
  return JSON.parse(decoded.toString("utf8"));
}

const hits = [];

for (const family of families) {
  for (const index of indexes) {
    // First try without name (404), Lordicon requires name in path.
    // We discovered pattern: {index}-{name}.li — name unknown.
    // Instead probe SVG listing? Skip.
  }
}

// Better: scrape icon names from lordicon sitemap or search API pages we already have.
// Use outline SVG directory guess from earlier successful list + neighbors by fetching
// with common name slugs.

const nameGuesses = [
  "wrench",
  "hammer",
  "screwdriver",
  "hard-hat",
  "helmet",
  "toolbox",
  "tools",
  "box",
  "package",
  "parcel",
  "clipboard",
  "document",
  "to-do-list",
  "checklist",
  "worker",
  "construction",
  "repair",
  "settings",
  "gear",
  "cog",
  "support",
  "customer-support",
];

const indexGuesses = [
  40, 41, 42, 133, 134, 185, 186, 187, 190, 191, 499, 500, 501, 735, 736, 737,
  738, 739, 740, 1700, 1701, 1702, 464, 465, 479, 480, 20, 21, 12, 56, 112,
  268, 981, 1103, 177,
];

for (const family of ["wired/outline", "wired/flat"]) {
  for (const index of indexGuesses) {
    for (const name of nameGuesses) {
      const url = `https://media.lordicon.com/icons/${family}/${index}-${name}.li`;
      const file = path.join(outDir, `${family.replace("/", "_")}_${index}-${name}.li`);
      try {
        execFileSync("curl.exe", ["-fsSL", "--max-time", "8", "-o", file, url], {
          stdio: "ignore",
        });
      } catch {
        continue;
      }
      if (!fs.existsSync(file) || fs.statSync(file).size < 200) continue;
      try {
        const j = decodeLi(fs.readFileSync(file, "utf8"));
        const nm = j.nm || "";
        if (want.some((re) => re.test(nm) || re.test(name))) {
          console.log("HIT", url, "=>", nm);
          hits.push({ url, nm, index, name, family });
        }
      } catch {
        /* ignore */
      }
    }
  }
}

console.log("total hits", hits.length);
fs.writeFileSync(path.join(outDir, "hits.json"), JSON.stringify(hits, null, 2));
