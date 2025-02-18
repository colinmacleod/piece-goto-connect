#!/bin/bash
READLINK=$(command -v greadlink || command -v readlink)
SCRIPT_PATH="$( $READLINK -m "$(dirname "$0")" )"
cd $SCRIPT_PATH/.. || exit -1

# We need at least 1 argument - the message to use for the commit
if [ $# -eq 0 ]; then
    echo "Usage: $0 <message>"
    exit 1
fi

# Commit the changes
git add .
git commit -m "$@" || exit -1

# Increment the version in package.json
npm version patch || exit -1

# Publish the package to npm
npm publish --access public || exit -1

# Push the changes to the remote repository
git push || exit -1

exit 0
