Alias Resolver for Node
=======================

MacOS has had a concept of [Aliases](https://support.apple.com/kb/PH19065?locale=en_GB) since System 7.
These work a little like symbolic links, a little like hard links, but basically appear to be empty files 
to command-line applications.

Since I need to figure out where these links point to, I created this node
module. For obvious reasons, it will only work on macOS.

Usage
=====

Given a file at `/Users/foo/file` that has an alias `/Users/foo/Documents/doc`:
    
    const aliasResolver = require('alias-resolver');
    const resolvedFile = aliasResolver('/Users/foo/file'); 
    //resolvedFile is /Users/foo/Documents/doc

    const anotherResolvedFile = aliasResolver('/Users/foo/notAnAlias');
    //anotherResolvedFile is null
