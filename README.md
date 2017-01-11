Alias Resolver for Node
=======================

MacOS has had a concept of [Aliases](https://support.apple.com/kb/PH19065?locale=en_GB) since System 7.
These work a little like symbolic links, a little like hard links, but basically appear to be empty files 
to command-line applications.

Since I need to figure out where these links point to, I created this node
module. For obvious reasons, it will only work on macOS.

This module now also allows the creation of alias files, and includes two bin/ utilities.

Usage
=====

Given a file at `/Users/foo/file` that has an alias `/Users/foo/Documents/doc`:
    
    const aliasResolver = require('alias-resolver').default;
    const resolvedFile = aliasResolver('/Users/foo/file'); 
    //resolvedFile is /Users/foo/Documents/doc

    const anotherResolvedFile = aliasResolver('/Users/foo/notAnAlias');
    //anotherResolvedFile is null

    const createAlias = require('alias-resolver').createAlias;
    createAlias('/usr/bin/ls', './ls-alias');

Global Usage
============

Alias files are tricky to deal with on the command-line. This module now
includes two helpers to make things easier.

      > npm -g install alias-resolver
      > create-alias /usr/bin/ls ./ls-alias
      > resolve-alias ls-alias
      /usr/bin/ls


