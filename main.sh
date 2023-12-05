temp_dir=$(mktemp -d);
original_dir=$(cwd);
temp_env=$temp_dir/temp.env;
temp_js=$temp_dir/index.mjs;
curl -Lo $temp_js https://github.com/nikelborm/download-github-folder/releases/latest/download/index.js;
curl -Lo $temp_env https://github.com/nikelborm/download-github-folder/releases/latest/download/template.env;
nano $temp_env;
# sadly absolute paths are not supported by node.js for now, so here is workaround with temporary directory
# there is a pull request to fix this, but it is not merged yet: https://github.com/nodejs/node/pull/49232
cd $temp_dir;
node --env-file=temp.env index.mjs;
