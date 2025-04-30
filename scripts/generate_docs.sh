#!/usr/bin/env bash
set -euo pipefail

# If you use vscode's live server plugin, it's better to leave this disabled
# rm -rf tmp

mkdir -p tmp

cp -rf src package.json package-lock.json deno.json tmp/.

cd tmp

ln -sf ../node_modules node_modules

deno doc --html --name=apache-superset-quick-init --output=docs src/index.ts

cd docs
mv index/~/* index/.
rmdir index/~

find . -type f -exec sed -i 's/index\/~/index/g' {} +
find . -type f -exec sed -i 's/index&#x2F;~/index/g' {} +

# npx http-server -c-1 -o=index.html
