import test from 'ava';
import temp from 'temp';
import fs from 'fs';
import resolveAlias, { createAlias } from '.'

temp.track();

test(t => {
  const file = temp.openSync()
  t.truthy(createAlias(file.path, file.path + ".alias"), "create alias");
  const resolvedPath = resolveAlias(file.path + ".alias");
  const statA = fs.statSync(file.path);
  const statB = fs.statSync(resolvedPath);

  t.is(statA.dev, statB.dev, "Same device");
  t.is(statA.ino, statB.ino, "Same inode");
});
