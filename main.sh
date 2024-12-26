#!/usr/bin/env bash

set -euo pipefail

command -v curl >/dev/null 2>&1 || { echo "curl is required but not installed."; exit 1; }
command -v openssl >/dev/null 2>&1 || { echo "openssl is required but not installed."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "node.js is required but not installed. Install it using your OS's default package manager or using https://github.com/nvm-sh/nvm"; exit 1; }

temp_dir=$(mktemp -d);
temp_env=$temp_dir/.temp.env;
temp_js=$temp_dir/index.mjs;

curl -Lo $temp_js https://github.com/nikelborm/download-github-folder/releases/latest/download/index.js;

cat >> $temp_env << 'END'
# Get here: https://github.com/settings/tokens
GITHUB_ACCESS_TOKEN=''

GITHUB_REPO_OWNER='apache'

GITHUB_REPO_NAME='superset'

PATH_TO_DIRECTORY_IN_REPO='docker'

# If commented, default branch in repo will be used
# COMMIT_SHA_HASH_OR_BRANCH_NAME_OR_TAG_NAME='main'

PATH_TO_LOCAL_DIR_INTO_WHICH_CONTENTS_OF_REPO_DIR_WILL_BE_PUT=''
END

mkdir superset
cd superset

curl -Lo ./compose.yml https://raw.githubusercontent.com/apache/superset/master/docker-compose-image-tag.yml;
echo -e "\nnetworks:\n  default:\n    name: apache_superset_network" >> compose.yml;

mkdir docker
cd docker

read -sp 'Enter github access token: ' gh_token < /dev/tty
echo
sed -i "s/\(GITHUB_ACCESS_TOKEN\)=''/\1='$gh_token'/" $temp_env
sed -i "s/\(PATH_TO_LOCAL_DIR_INTO_WHICH_CONTENTS_OF_REPO_DIR_WILL_BE_PUT\)=''/\1='$(pwd | sed 's_/_\\/_g')'/" $temp_env

node --env-file=$temp_env $temp_js;

rm -rf $temp_dir

sed -i 's/\(DEV_MODE\)=.*/\1=false/' .env
sed -i 's/\(FLASK_DEBUG\)=.*/\1=false/' .env
sed -i 's/\(SUPERSET_ENV\)=.*/\1=production/' .env
sed -i 's/\(SUPERSET_LOAD_EXAMPLES\)=.*/\1=no/' .env
sed -i 's/\(ENABLE_PLAYWRIGHT\)=.*/\1=true/' .env
sed -i 's/\(PUPPETEER_SKIP_CHROMIUM_DOWNLOAD\)=.*/\1=false/' .env

gen_pass() {
  openssl rand -base64 48 | sed 's_/_\\/_g';
}

db_pass=$(gen_pass)

sed -i "s/\(DATABASE_PASSWORD\)=.*/\1=\"$db_pass\"/" .env
sed -i "s/\(POSTGRES_PASSWORD\)=.*/\1=\"$db_pass\"/" .env

sed -i "s/\(EXAMPLES_PASSWORD\)=.*/\1=\"$(gen_pass)\"/" .env
sed -i "s/\(SUPERSET_SECRET_KEY\)=.*/\1=\"$(gen_pass)\"/" .env

sed -i '/^# Make sure you set this to a unique secure random value/d' .env

sed -i "s/\(\"jwtSecret\": \"\).*\",/\1$(gen_pass)\",/" superset-websocket/config.json

# to secure envs
chmod -R og= {superset-websocket,.env}

echo -e 'psycopg2-binary\npillow' > requirements-local.txt
