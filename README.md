# Kyberswap Aggregator Subgraph

Subgraph to index data from aggregation router smart contract.

## Prerequisites

- Global Yarn Packages
- graph-cli

## How to use

### Clone the aggregator subgraph

```shell
git clone git@github.com:dynamic-amm/aggregator-subgraph.git
```

### Install dependencies

```shell
yarn
```

### Update config file

_Note_: NETWORK is the file name in `config` folder without the `.json` suffix (for example: avalanche, bsc, ethereum, ...)

```shell
NETWORK=bsc yarn router:prepare
```

### Generate the graph code

```shell
yarn router:codegen
```

### Build

```shell
yarn router:build
```

### Deploy

```shell
NETWORK=bsc yarn router:deploy
```
