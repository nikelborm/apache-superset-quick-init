#!/usr/bin/env bash

mkdir tmp
cd tmp
temp_dir=$(mktemp -d);
temp_env=$temp_dir/.temp.env;
temp_js=$temp_dir/index.mjs;

curl -Lo $temp_js https://github.com/nikelborm/download-github-folder/releases/latest/download/index.js;
curl -Lo $temp_env https://github.com/nikelborm/download-github-folder/releases/latest/download/template.env;

sed -i "s/PATH_TO_LOCAL_DIR_INTO_WHICH_CONTENTS_OF_REPO_DIR_WILL_BE_PUT='\/tmp\/tmp.pPuwKB2gSZ\/docker'/PATH_TO_LOCAL_DIR_INTO_WHICH_CONTENTS_OF_REPO_DIR_WILL_BE_PUT='$(pwd | sed 's_/_\\/_g')\/docker'/" $temp_env

# to set token
nano $temp_env;
node --env-file=$temp_env $temp_js;

curl -Lo ./compose.yml https://raw.githubusercontent.com/apache/superset/master/docker-compose-image-tag.yml;
echo -e "\nnetworks:\n  default:\n    name: apache_superset_network" >> compose.yml;
rm -rf $temp_dir

# fixes bug of download-github-folder util
find ./docker -type f -name '*.sh' -exec chmod +x '{}' \;

sed -i "s/DEV_MODE=true/DEV_MODE=false/" ./docker/.env
sed -i "s/FLASK_DEBUG=true/FLASK_DEBUG=false/" ./docker/.env
sed -i "s/SUPERSET_ENV=development/SUPERSET_ENV=production/" ./docker/.env

# to secure envs
sudo chmod -R og= ./docker/superset-websocket
sudo chmod -R og= ./docker/.env


echo 'psycopg2-binary' > ./docker/requirements-local.txt
