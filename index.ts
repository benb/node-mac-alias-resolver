import * as ffi from 'ffi';
import * as url from 'url'

const aliasResolver = ffi.Library(__dirname + '/dist/libAliasResolver', {
  'resolveAliasToBuffer' : [ 'bool' , [ 'CString', 'char *', 'ulong', 'ulong *' ] ]
});


function resolveAliasWithBuffer(path: string, initialBufferSize: number): string | null {
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

function fmap<T,U>(val: T | null, f: (v:T) => U): U | null {
  return val ? f(val) : null;
}

function resolveAlias(path: string): string | null {
  return fmap(resolveAliasWithBuffer(path, 512), fileURIString => {
    const fileURL = url.parse(fileURIString);
    return fileURL.path ? decodeURI(path) : null; 
  });
}

module.exports = resolveAlias;
