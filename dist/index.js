"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const mkdirp_1 = require("mkdirp");
const url_1 = require("url");
if (process.argv.length < 3) {
    console.error('Missing HAR file argument');
    console.log('Usage: har-to-dir <some-file.har>');
    process.exit(1);
}
const harPath = process.argv[2];
const harFile = JSON.parse(fs_1.readFileSync(harPath, 'utf8'));
const harData = harFile.log;
const basePath = harData.pages[0].title;
const externalFiles = [];
for (let i = 0; i < harData.entries.length; i++) {
    const entry = harData.entries[i];
    // in case the url is not relative to the base page, handle it in the following section
    if (!entry.request.url.startsWith(basePath)) {
        const urlPathname = url_1.parse(entry.request.url).pathname || '';
        externalFiles.push({ id: i, fileName: path_1.basename(urlPathname), fullPath: entry.request.url });
        continue;
    }
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
/**
 * FIXME: after the file name it should be attached a trailing sha to make files unique.
 * Otherwise multiple files in different external paths, that ends with the same basename
 * would be overwritten.
 */
if (externalFiles.length > 0) {
    console.log('== Some external files are dumped into _external-files_  ==');
    console.log('== In order to use them paths have to be edited manually ==');
    mkdirp_1.sync('_external-files_');
    externalFiles.forEach(({ id, fileName, fullPath }) => {
        const entry = harData.entries[id];
        const isBase64 = entry.response.content.encoding === 'base64';
        let contents;
        if (isBase64) {
            contents = Buffer.from(entry.response.content.text, 'base64');
        }
        else {
            contents = entry.response.content.text;
        }
        fs_1.writeFileSync(`_external-files_/${fileName}`, contents);
        console.log(`Original URL: ${fullPath}`);
        console.log(`Written into: _external-path_/${fileName}`);
    });
}
