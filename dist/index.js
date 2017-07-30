"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const mkdirp_1 = require("mkdirp");
if (process.argv.length < 3) {
    console.error('Missing HAR file argument');
    console.log('Usage: har-to-dir <some-file.har>');
    process.exit(1);
}
const harPath = process.argv[2];
const harFile = JSON.parse(fs_1.readFileSync(harPath, 'utf8'));
const harData = harFile.log;
const basePath = harData.pages[0].title;
for (let i = 0; i < harData.entries.length; i++) {
    const entry = harData.entries[i];
    // in case the url is not relative to the base page, just leave it
    if (!entry.request.url.startsWith(basePath))
        continue;
    const fileName = entry.request.url.substr(basePath.length) || 'index.html';
    const isBase64 = entry.response.content.encoding === 'base64';
    let contents;
    if (isBase64) {
        contents = Buffer.from(entry.response.content.text, 'base64');
    }
    else {
        contents = entry.response.content.text;
    }
    const fileDirectory = path_1.dirname(fileName);
    if (fileDirectory != null) {
        mkdirp_1.sync(fileDirectory);
    }
    fs_1.writeFileSync(fileName, contents);
    console.log('written file:', fileName);
}
