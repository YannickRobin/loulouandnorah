#!/usr/bin/env node
"use strict";
// Generate a QR code PNG for a site entry identified by an ID.
// Usage:
//   node scripts/generate_qr.js <id>
// Examples:
//   node scripts/generate_qr.js 1
//   node scripts/generate_qr.js my-slug
// Alternate: pass a full URL as first argument; the script will extract the final
// path segment as the id and generate the same filename (e.g. URL ending with /qr/1 -> id=1):
//   node scripts/generate_qr.js "https://loulouandnorah.com/qr/1"

const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const QRCode = require("qrcode");

function isValidUrl(u) {
  try {
    const parsed = new URL(u);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (e) {
    return false;
  }
}

function usageAndExit(code = 1) {
  console.error("Usage: node scripts/generate_qr.js <id>\nExample: node scripts/generate_qr.js 1");
  console.error("You may also pass a full URL; the script will extract the final path segment as the id.");
  process.exit(code);
}

const argv = process.argv.slice(2);
if (argv.length === 0) usageAndExit(1);

// First argument may be either an ID (e.g. 1) or a full URL. If it's not a valid URL,
// we treat it as the ID and construct the canonical URL. The output filename is
// always `medias/qr-<id>.png`.
const input = argv[0];
let url;
let idForFile;
if (isValidUrl(input)) {
  url = input;
  // extract final non-empty path segment as id
  try {
    const parsed = new URL(input);
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length === 0) {
      console.error("Error: cannot derive id from URL — the path has no segments. Provide an id instead.");
      usageAndExit(2);
    }
    idForFile = parts[parts.length - 1];
  } catch (e) {
    console.error("Error parsing URL");
    process.exit(2);
  }
} else {
  // treat as id (allow simple numeric or slug strings)
  const id = input.trim();
  if (!id) {
    console.error("Error: empty id provided");
    usageAndExit(1);
  }
  idForFile = id;
  url = `https://loulouandnorah.com/qr/${encodeURIComponent(id)}`;
}

if (!isValidUrl(url)) {
  console.error(`Error: constructed URL '${url}' is not a valid http/https URL`);
  process.exit(2);
}

const output = path.join(__dirname, "..", "medias", `qr-${idForFile}.png`);

const outDir = path.dirname(output);
fs.mkdirSync(outDir, { recursive: true });

const options = {
  type: "png",
  // width controls final image size; keep sane default
  width: 400,
};

QRCode.toFile(output, url, options, function (err) {
  if (err) {
    console.error(`Failed to generate QR: ${err.message || err}`);
    process.exit(3);
  }
  console.log(`QR code saved to: ${output}`);
});
