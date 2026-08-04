const fs = require("fs");
const path = require("path");

const t = fs.readFileSync(path.join(process.env.TEMP, "lord_elements.js"), "utf8");

// Find Zn function definition patterns near ".li"
const markers = ["function Zn(", "Zn=function", "const Zn=", "Zn=", "parseLi", "decodeLi"];
for (const m of markers) {
  const i = t.indexOf(m);
  console.log(m, i);
  if (i >= 0) console.log(t.slice(i, i + 400));
}

// Search for base64 decode of icon
const re = /function\s+(\w+)\([^)]*\)\{[^}]{0,80}atob/g;
let m;
let n = 0;
while ((m = re.exec(t)) && n < 10) {
  console.log("atob fn", m[1], "at", m.index);
  console.log(t.slice(m.index, m.index + 500));
  n++;
}

// Find assignment Zn=
const idx = t.indexOf("Zn=");
console.log("\nZn= occurrences");
let start = 0;
for (let k = 0; k < 5; k++) {
  const i = t.indexOf("Zn=", start);
  if (i < 0) break;
  console.log("---", i, t.slice(Math.max(0, i - 80), i + 300));
  start = i + 3;
}
