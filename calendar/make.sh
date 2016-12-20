#!/bin/bash
set -e -x

# creates a target folder combining jidesha chrome with calendar integration

rm -rf target

mkdir -p target/content

cp manifest.json target/content
cp -r css target/content
cp ../chrome/background.js target/content
cp ../chrome/*.png target/content
cp *.png target/content
cp *.js target/content
