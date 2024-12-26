# apache-superset-quick-init

## Dependencies

1. curl (for loading scripts and compose files)
2. openssl (for automatic password generation)
3. jq (for inserting automatically generated password into one of the config files)
4. node (You can install it easily using [NVM](https://github.com/nvm-sh/nvm))
5. docker (for running superset)

## How to use

```bash
curl https://raw.githubusercontent.com/nikelborm/apache-superset-quick-init/refs/heads/main/main.sh | bash

cd ./superset
# for passwords you can use for example `openssl rand -base64 48`
# passwords auto-generated by ./main.sh, and you don't need to generate them
# if you need to edit some unusual vars, uncomment and edit them here
# nano ./docker/.env
# nano ./docker/superset-websocket/config.json

# choose tag you want: 'latest' or something specific like '4.1.1'
# here are examples of tags:
# https://superset.apache.org/docs/installation/docker-builds/#key-tags-examples
# https://github.com/apache/superset/blob/master/CHANGELOG.md
# https://github.com/apache/superset/releases

export TAG='latest'
# if use chose latest, good idea to always pull
# docker compose up -d --pull always
docker compose up -d
# follow logs until completely deployed
docker compose logs -f
```

## TODO

1. create separate script for quick registering of a new database into current superset instance
