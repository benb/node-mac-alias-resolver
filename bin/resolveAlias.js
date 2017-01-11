#!/usr/bin/env node
const resolveAlias = require('../').default;

if (process.argv.length != 3) {
  console.log("USAGE: resolve-alias <alias file>");
  return;
}

const result = resolveAlias(process.argv[2]);

if (result) {
  console.log(result);
} else {
  console.error(process.argv[2] + ": not an alias?");
}

