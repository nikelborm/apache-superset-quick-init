# apache-superset-quick-init

## Clone with

```bash
git clone -b main --depth 1 https://github.com/nikelborm/apache-superset-quick-init.git
cd apache-superset-quick-init
```

## How to use

```bash
./main.sh
cd ./superset
# for passwords you can use for example openssl rand -base64 48
nano ./docker/.env
nano ./docker/superset-websocket/config.json
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
