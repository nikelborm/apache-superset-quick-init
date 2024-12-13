#!/usr/bin/env bash

temp_dir=$(mktemp -d);
original_dir=$(cwd);
temp_env=$temp_dir/.temp.env;
temp_js=$temp_dir/index.mjs;
curl -Lo $temp_js https://github.com/nikelborm/download-github-folder/releases/latest/download/index.js;
curl -Lo $temp_env https://github.com/nikelborm/download-github-folder/releases/latest/download/template.env;
nano $temp_env;
node --env-file=$temp_env $temp_js;
curl -Lo ./docker-compose-non-dev.yml https://raw.githubusercontent.com/apache/superset/master/docker-compose-non-dev.yml;
echo -e "\nnetworks:\n  default:\n    name: apache_superset_network" >> docker-compose-non-dev.yml;
rm -rf $temp_dir
