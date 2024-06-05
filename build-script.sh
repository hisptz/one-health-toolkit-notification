#!/bin/bash
clear
echo "Start of build process for the script"
rm -r dist
npm run build-script
echo "Copy necessary assets for the script"
cp -r node_modules dist/
cp -r *.sh dist/
cd dist && zip -r -D one-health-toolkit-notification . && cd ..
echo "End of the build for the script"
