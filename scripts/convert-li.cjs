const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const file = process.argv[2];
const buf = fs.readFileSync(file);
const text = buf.toString("utf8").trim();
console.log("file", file, "len", buf.length);
console.log("head ascii", text.slice(0, 80));

function tryParseJson(b, label) {
  try {
    const s = Buffer.isBuffer(b) ? b.toString("utf8") : String(b);
    const j = JSON.parse(s);
    console.log("JSON OK", label, "nm=", j.nm, "layers=", j.layers?.length);
    return j;
  } catch {
    return null;
  }
}

if (tryParseJson(buf, "raw")) process.exit(0);

let dec;
try {
  dec = Buffer.from(text, "base64");
  console.log("b64 decoded", dec.length, "head", dec.slice(0, 16));
} catch (e) {
  console.log("b64 fail", e.message);
  process.exit(1);
}

if (tryParseJson(dec, "b64-utf8")) {
  fs.writeFileSync(file.replace(/\.li$/, ".json"), dec);
  process.exit(0);
}

// try gunzip
for (const offset of [0, 1, 2, 4, 8, 16]) {
  try {
    const slice = dec.subarray(offset);
    const unzipped = zlib.gunzipSync(slice);
    console.log("gunzip offset", offset, "->", unzipped.length);
    if (tryParseJson(unzipped, "gunzip@" + offset)) {
      fs.writeFileSync(file.replace(/\.li$/, ".json"), unzipped);
      process.exit(0);
    }
    // maybe inflate
  } catch {}
  try {
    const slice = dec.subarray(offset);
    const inflated = zlib.inflateSync(slice);
    console.log("inflate offset", offset, "->", inflated.length);
    if (tryParseJson(inflated, "inflate@" + offset)) {
      fs.writeFileSync(file.replace(/\.li$/, ".json"), inflated);
      process.exit(0);
    }
  } catch {}
}

// look for JSON start in decoded buffer
const asStr = dec.toString("latin1");
const idx = asStr.indexOf('{"v":');
const idx2 = asStr.indexOf('{"nm":');
console.log("json markers", { idx, idx2, brace: asStr.indexOf("{") });
if (idx >= 0) {
  const maybe = asStr.slice(idx);
  if (tryParseJson(maybe, "embedded@v")) {
    fs.writeFileSync(file.replace(/\.li$/, ".json"), maybe);
    process.exit(0);
  }
}

console.log("could not convert");
process.exit(2);
