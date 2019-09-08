#!/bin/sh

rm -Rf .next
npm run build
node generate-sw.js
node generate-event-json.js
mkdir -p server/bundle

rollup server/bff-proxy.js -o server/bundle/bff-proxy.js --output.format=cjs
rollup server/bff-photos.js -o server/bundle/bff-photos.js --output.format=cjs
rollup server/events-crawler.js -o server/bundle/events-crawler.js --output.format=cjs
rollup server/trend.js -o server/bundle/trend.js --output.format=cjs

now -e KOIKI_FLORAS_FLICKR_API_KEY=@koiki_floras_flickr_api_key
NEW_URL=`pbpaste`
now alias ${NEW_URL} floras.now.sh
