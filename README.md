# apache-superset-quick-init

## How to use

```bash
./main.sh
cd ./tmp
nano ./docker/.env
nano ./docker/superset-websocket/config.json
# choose tag you want: 'latest' or something specific like '4.1.1'
export TAG='latest'
docker compose up -d --pull always --no-build
# follow logs until completely deployed
docker compose logs -f
```

## TODO

1. create separate script for quick registering of a new database into current superset instance
