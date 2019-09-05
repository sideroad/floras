#!/bin/sh

rm -Rf .next
npm run build
node generate-sw.js

now
NEW_URL=`pbpaste`
now alias ${NEW_URL} floras.now.sh
