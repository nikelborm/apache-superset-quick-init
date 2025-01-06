# apache-superset-quick-init

[![Release Workflow](https://github.com/nikelborm/apache-superset-quick-init/actions/workflows/main.yml/badge.svg)](https://github.com/nikelborm/apache-superset-quick-init/actions/workflows/main.yml)
[![npm version](https://badge.fury.io/js/apache-superset-quick-init.svg)](https://badge.fury.io/js/apache-superset-quick-init)
[![JSR](https://jsr.io/badges/@nikelborm/apache-superset-quick-init)](https://jsr.io/@nikelborm/apache-superset-quick-init)
[![JSR Score](https://jsr.io/badges/@nikelborm/apache-superset-quick-init/score)](https://jsr.io/@nikelborm/apache-superset-quick-init)
[![JSR Scope](https://jsr.io/badges/@nikelborm)](https://jsr.io/@nikelborm)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/nikelborm/apache-superset-quick-init)
![GitHub top language](https://img.shields.io/github/languages/top/nikelborm/apache-superset-quick-init)
![NPM License](https://img.shields.io/npm/l/apache-superset-quick-init)
<!-- ![npms.io](https://img.shields.io/npms-io/final-score/apache-superset-quick-init) -->

I'm currently in the process of rewriting it to typescript since it uses js script ([nikelborm/fetch-github-folder](https://github.com/nikelborm/fetch-github-folder/)) anyway

## Dependencies

1. curl (for loading scripts and compose files)
2. openssl (for automatic password generation)
3. node (You can install it easily using [NVM](https://github.com/nvm-sh/nvm))
4. docker (for running superset)

## How to use

```bash
curl https://raw.githubusercontent.com/nikelborm/apache-superset-quick-init/refs/heads/main/main.sh | bash

cd ./superset
# To generate passwords you can use `openssl rand -base64 48`.
# Passwords are auto-generated by default in ./main.sh, so you don't need to generate them manually.
# If you need to edit some unusual vars, uncomment those commands to edit them
# nano ./docker/.env
# nano ./docker/superset-websocket/config.json

# Choose the tag you want: 'latest' or something specific like '4.1.1'
# here are examples of tags:
# https://superset.apache.org/docs/installation/docker-builds/#key-tags-examples
# https://github.com/apache/superset/blob/master/CHANGELOG.md
# https://github.com/apache/superset/releases

export TAG='latest'
# If use choose `latest`, good idea to always pull
# docker compose up -d --pull always
docker compose up -d
# Follow logs until completely deployed
docker compose logs -f
```

## TODO

1. create a separate script for quick registering of a new database into a newly created Superset instance
