#!/bin/sh

# Version setup

manifest_version=${1}
widget_version=${2}

if [ -z "$manifest_version" ]; then
    read -p "Specify manifest version: v" manifest_version
fi

if [ -z "$widget_version" ]; then
    read -p "Specify widget version: " widget_version
fi

if [ "$manifest_version" != "2" ] && [ "$manifest_version" != "3" ]; then
    echo "Manifest should either be '2' or '3' version" >&2
    exit 1
fi

cd widget

# Copies content of the manifest of selected version to a new mainfest.json file
cp "manifest_v$manifest_version.json" manifest.json

# Replaces the version in the manifest file
sed -i "s/REPLACE_VERSION/$widget_version/g" manifest.json

# Packs the content of the repository into zip archive, excludes all manifest except the new one
zip -r -FS "../lw-v$manifest_version.zip" * -x "manifest_v*.json"

# Delete the new manifest file
rm manifest.json
