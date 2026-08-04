const fs = require("fs");
const path = require("path");

const KEY = 42;
const dir = process.argv[2] || path.join(__dirname, "..", "public", "lottie");

function decodeLi(text) {
  const raw = Buffer.from(String(text).trim(), "base64");
  const decoded = Buffer.alloc(raw.length);
  for (let i = 0; i < raw.length; i++) decoded[i] = raw[i] ^ KEY;
  return JSON.parse(decoded.toString("utf8"));
}

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith(".li")) continue;
  const liPath = path.join(dir, file);
  const jsonPath = path.join(dir, file.replace(/\.li$/, ".json"));
  try {
    const j = decodeLi(fs.readFileSync(liPath, "utf8"));
    fs.writeFileSync(jsonPath, JSON.stringify(j));
    console.log(
      "OK",
      file,
      "->",
      path.basename(jsonPath),
      "nm=",
      j.nm,
      "kb=",
      (fs.statSync(jsonPath).size / 1024).toFixed(1)
    );
  } catch (e) {
    console.error("FAIL", file, e.message);
  }
}
