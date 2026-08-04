const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const KEY = 42;
const outDir = path.join(process.env.TEMP, "lordicon-index-scan");
fs.mkdirSync(outDir, { recursive: true });

function decodeLi(text) {
  const raw = Buffer.from(String(text).trim(), "base64");
  const decoded = Buffer.alloc(raw.length);
  for (let i = 0; i < raw.length; i++) decoded[i] = raw[i] ^ KEY;
  return JSON.parse(decoded.toString("utf8"));
}

const want =
  /wrench|hard-?hat|helmet|hammer|screw|toolbox|tools|package|parcel|\bbox\b|clipboard|checklist|to-do|worker|construction|repair|gear|customer-support|support-agent|headset|headphones|broom|laptop|layers|avatar|confetti|consultation|love-heart|\bchat\b/i;

const ranges = [
  [1, 80],
  [120, 220],
  [450, 520],
  [700, 780],
  [960, 1020],
  [1080, 1140],
  [1680, 1720],
];

const hits = [];

for (const [from, to] of ranges) {
  for (let i = from; i <= to; i++) {
    const url = `https://media.lordicon.com/icons/wired/outline/${i}-x.li`;
    const file = path.join(outDir, `${i}.li`);
    try {
      execFileSync("curl.exe", ["-fsSL", "--max-time", "6", "-o", file, url], {
        stdio: "ignore",
      });
    } catch {
      continue;
    }
    if (!fs.existsSync(file) || fs.statSync(file).size < 200) continue;
    try {
      const j = decodeLi(fs.readFileSync(file, "utf8"));
      const nm = j.nm || "";
      if (want.test(nm)) {
        console.log(i, nm);
        hits.push({ i, nm, size: fs.statSync(file).size });
      }
    } catch {
      /* ignore */
    }
  }
  console.log(`range ${from}-${to} done, hits=${hits.length}`);
}

fs.writeFileSync(path.join(outDir, "hits.json"), JSON.stringify(hits, null, 2));
console.log("TOTAL", hits.length);
