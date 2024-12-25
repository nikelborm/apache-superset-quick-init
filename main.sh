#!/usr/bin/env bash

set -euo pipefail

temp_dir=$(mktemp -d);
temp_env=$temp_dir/.temp.env;
temp_js=$temp_dir/index.mjs;

curl -Lo $temp_js https://github.com/nikelborm/download-github-folder/releases/latest/download/index.js;
cp ./template.env $temp_env

mkdir superset
cd superset
read -sp 'Enter github access token: ' gh_token
sed -i "s/\(GITHUB_ACCESS_TOKEN\)=''/\1='$gh_token'/" $temp_env
sed -i "s/\(PATH_TO_LOCAL_DIR_INTO_WHICH_CONTENTS_OF_REPO_DIR_WILL_BE_PUT\)=''/\1='$(pwd | sed 's_/_\\/_g')\/docker'/" $temp_env

node --env-file=$temp_env $temp_js;

curl -Lo ./compose.yml https://raw.githubusercontent.com/apache/superset/master/docker-compose-image-tag.yml;
echo -e "\nnetworks:\n  default:\n    name: apache_superset_network" >> compose.yml;
rm -rf $temp_dir

# fixes bug of download-github-folder util
find ./docker -type f -name '*.sh' -exec chmod +x '{}' \;

sed -i 's/\(DEV_MODE\)=.*/\1=false/' ./docker/.env
sed -i 's/\(FLASK_DEBUG\)=.*/\1=false/' ./docker/.env
sed -i 's/\(SUPERSET_ENV\)=.*/\1=production/' ./docker/.env
sed -i 's/\(SUPERSET_LOAD_EXAMPLES\)=.*/\1=no/' ./docker/.env
sed -i 's/\(ENABLE_PLAYWRIGHT\)=.*/\1=true/' ./docker/.env
sed -i 's/\(PUPPETEER_SKIP_CHROMIUM_DOWNLOAD\)=.*/\1=false/' ./docker/.env

gen_pass() {
  openssl rand -base64 48;
}

db_pass=$(gen_pass)

sed -i "s/\(DATABASE_PASSWORD\)=.*/\1=\"$db_pass\"/" ./docker/.env
sed -i "s/\(POSTGRES_PASSWORD\)=.*/\1=\"$db_pass\"/" ./docker/.env

sed -i "s/\(EXAMPLES_PASSWORD\)=.*/\1=\"$(gen_pass)\"/" ./docker/.env
sed -i "s/\(SUPERSET_SECRET_KEY\)=.*/\1=\"$(gen_pass)\"/" ./docker/.env

sed '/^# Make sure you set this to a unique secure random value/d' ./docker/.env

cat <<< $(jq ". + {\"jwtSecret\": \"$(gen_pass)\"}" docker/superset-websocket/config.json) > docker/superset-websocket/config.json

# to secure envs
sudo chmod -R og= ./docker/{superset-websocket,.env}

echo -e 'psycopg2-binary\npillow' > ./docker/requirements-local.txt
