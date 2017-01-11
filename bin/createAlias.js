#!/usr/bin/env node
const createAlias = require('../').createAlias;

if (process.argv.length != 4) {
  console.log("USAGE: create-alias <from file> <to file>");
  return;
}

createAlias(process.argv[2], process.argv[3]);
