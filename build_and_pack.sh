#!/bin/sh

# Version setup

manifest_version=${1}

if [ -z "$manifest_version"]; then
    read -p "Specify manifest version: v" manifest_version
fi

if [ "$manifest_version" != "2" ] && [ "$manifest_version" != "3" ]; then
    echo "Manifest should either be '2' or '3' version" >&2
    exit 1
fi


# 1) Copies content of the manifest of selected version to a new mainfest.json file
cp "manifest_v$manifest_version.json" manifest.json

# 2) Packs the content of the repository into zip archive, excludes all manifest except the new one
zip -r -FS "../linkerhub-widget_v$manifest_version.zip" * -x "*.git*" -x "manifest_v2.json" -x "manifest_v3.json" -x "manifest_v3.json" -x "build_and_pack.sh"

# 3) Delete the new manifest file
rm manifest.json
