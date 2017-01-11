import * as ffi from 'ffi';
import * as url from 'url'
import * as fs from 'fs';

// Library file could be bundled outside of file bundle (e.g. for an Electron-based app).
// Check if it is available in the 'proper' location, else use system search paths:
const aliasResolverLib = fs.existsSync(__dirname + '/dist/libAliasResolver.dylib') ? __dirname + '/dist/libAliasResolver' : 'libAliasResolver';

const aliasResolver = ffi.Library(aliasResolverLib, {
  'resolveAliasToBuffer' : [ 'bool' , [ 'CString', 'char *', 'ulong', 'ulong *' ] ],
  'createAliasForFile' : [ 'bool' , [ 'CString', 'CString' ] ]
});


function resolveAliasWithBuffer(path: string, initialBufferSize: number): Maybe<string> {
  const buffer = Buffer.alloc(initialBufferSize);
  const sizeBuffer = Buffer.alloc(4);

  const isAlias = aliasResolver.resolveAliasToBuffer(path, buffer, initialBufferSize, sizeBuffer);
  if (!isAlias) {
    return null;
  }

  const neededBuffer = sizeBuffer.readUInt32LE(0);
  if (neededBuffer + 1 > initialBufferSize) {
    return resolveAliasWithBuffer(path, neededBuffer + 1);
  }

  let str = buffer.toString('utf8');
  str = str.substr(0, str.indexOf('\u0000'));
  return str;
}

type Maybe<T> = T | null;

function fmap<T,U>(val: Maybe<T>, f: (v:T) => U): Maybe<U> {
  return val ? f(val) : null;
}

export default function resolveAlias(path: string): string | null {
  return fmap(resolveAliasWithBuffer(path, 512), fileURIString => {
    const fileURL = url.parse(fileURIString);
    return fileURL.path ? decodeURI(fileURL.path) : null; 
  });
}

export function createAlias(from: string, to: String): boolean{
  return aliasResolver.createAliasForFile(from, to);
}
