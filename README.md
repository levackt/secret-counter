# Secret Counter 

Simple secret counter built by following the [Secret Network contracts guide] (https://github.com/enigmampc/enigma-blockchain-contracts-guide)

## Start the network with docker-compose
```bash
# Also starts nginx to proxy requests to the api server
docker-compose up
```

## Start the rest-api server
```bash
# in a new terminal
docker-compose exec secretdev \
  secretcli rest-server \
  --node tcp://localhost:26657 \
  --trust-node \
  --laddr tcp://0.0.0.0:1317
```

# start the faucet
```bash
# todo faucet docs
yarn dev-start
```

# Deploy the contract
# todo copy from guide

# Start the app
```bash
cd client
yarn start:local
```