import { readFileSync, writeFileSync } from 'fs'

import { HarData } from './har'
import { dirname } from 'path'
import { sync as mkdirpSync } from 'mkdirp'

if (process.argv.length < 3) {
  console.error('Missing HAR file argument');
  console.log('Usage: har-to-dir <some-file.har>');
  process.exit(1);
}

const harPath = process.argv[2];

const harFile = JSON.parse(readFileSync(harPath, 'utf8'));
const harData: HarData = harFile.log;

const basePath = harData.pages[0].title;

for (let i = 0; i < harData.entries.length; i++) {
  const entry = harData.entries[i]

  // in case the url is not relative to the base page, just leave it
  if (!entry.request.url.startsWith(basePath)) continue;
  const fileName = entry.request.url.substr(basePath.length) || 'index.html'

  const isBase64 = entry.response.content.encoding === 'base64'
  let contents;
  if (isBase64) {
    contents = Buffer.from(entry.response.content.text, 'base64');
  } else {
    contents = entry.response.content.text
  }

  const fileDirectory = dirname(fileName);
  if (fileDirectory != null) {
    mkdirpSync(fileDirectory);
  }

  writeFileSync(fileName, contents);
  console.log('written file:', fileName);
}
