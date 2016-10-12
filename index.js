const ffi = require('ffi');
const url = require('url');

const aliasResolver = ffi.Library(__dirname + '/dist/libAliasResolver', {
  'resolveAliasToBuffer' : [ 'bool' , [ 'CString', 'char *', 'ulong', 'ulong *' ] ]
});


function resolveAliasWithBuffer(path, initialBufferSize) {
  const buffer = Buffer.alloc(initialBufferSize);
  const sizeBuffer = Buffer.alloc(4);

  const isAlias = aliasResolver.resolveAliasToBuffer(path, buffer, initialBufferSize, sizeBuffer);
  if (!isAlias) {
    return null;
  }

  const neededBuffer = sizeBuffer.readUInt32LE();
  if (neededBuffer + 1 > initialBufferSize) {
    return resolveAlias(path, neededBuffer + 1);
  }

  let str = buffer.toString('utf8');
  str = str.substr(0, str.indexOf('\u0000'));
  return str;
}

function resolveAlias(path) {
  const fileURIString = resolveAliasWithBuffer(path, 512);

  if (!fileURIString) {
    return null;
  }

  const fileURL = url.parse(fileURIString);
  return decodeURI(fileURL.path);
}

module.exports = resolveAlias;
