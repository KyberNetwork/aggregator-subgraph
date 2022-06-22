import {AggregationExecutor, RouterExchange, RouterSwapped} from "../types/router/schema";
import {Exchange, Swapped} from "../types/router/Router/Router";
import {ClientData} from "../types/router/RouterV3/RouterV3";
import {Executor as AggregationExecutorTemplate} from "../types/router/templates";

export function handleExchange(event: Exchange): void {
  let executor = AggregationExecutor.load(event.params.pair.toHex());
  if (executor == null) {
    AggregationExecutorTemplate.create(event.params.pair);
    executor = new AggregationExecutor(event.params.pair.toHex());

    executor.save();
  }

  let id = event.transaction.hash
    .toHex();

  let routerExchange = createOrLoadRouterExchange(id);
  routerExchange.router = event.address;
  routerExchange.pair = event.params.pair;
  routerExchange.token = event.params.output;
  routerExchange.amount = event.params.amountOut.toBigDecimal();
  routerExchange.userAddress = event.transaction.from;
  routerExchange.tx = event.transaction.hash;
  routerExchange.blockNumber = event.block.number;
  routerExchange.time = event.block.timestamp;
  routerExchange.save();
}

export function handleSwapped(event: Swapped): void {
  let id = event.transaction.hash
      .toHex();
  let routerSwapped = createOrLoadRouterSwapped(id);
  routerSwapped.router = event.address;
  routerSwapped.pair = event.params.srcToken
    .toHex()
    .concat("_")
    .concat(event.params.dstToken.toHex());
  routerSwapped.tokenIn = event.params.srcToken;
  routerSwapped.amountIn = event.params.spentAmount.toBigDecimal();
  routerSwapped.tokenOut = event.params.dstToken;
  routerSwapped.amountOut = event.params.returnAmount.toBigDecimal();
  routerSwapped.userAddress = event.transaction.from;
  routerSwapped.tx = event.transaction.hash;
  routerSwapped.blockNumber = event.block.number;
  routerSwapped.time = event.block.timestamp;
  routerSwapped.save();

  let routerExchange = createOrLoadRouterExchange(id);
  routerExchange.tokenIn = event.params.srcToken;
  routerExchange.tokenOut = event.params.dstToken;
  routerExchange.save();
}

export function handleClientData(event: ClientData): void {
  let id = event.transaction.hash
      .toHex();

  let routerSwapped = createOrLoadRouterSwapped(id);

  routerSwapped.clientData = event.params.clientData;
  routerSwapped.clientDataStr = event.params.clientData.toString();

  routerSwapped.save();
}

export function createOrLoadRouterSwapped(id: string): RouterSwapped {
  let routerSwapped = RouterSwapped.load(id);

  if (routerSwapped === null) {
    routerSwapped = new RouterSwapped(id);
  }

  return routerSwapped as RouterSwapped;
}

export function createOrLoadRouterExchange(id: string): RouterExchange {
  let routerExchange = RouterExchange.load(id);

  if (routerExchange == null) {
    routerExchange = new RouterExchange(id);
  }

  return routerExchange as RouterExchange;
}
