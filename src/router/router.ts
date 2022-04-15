import {AggregationExecutor, RouterExchange, RouterSwapped} from "../types/router/schema";
import {Exchange, Swapped} from "../types/router/Router/Router";
import {Executor as AggregationExecutorTemplate} from "../types/router/templates";

export function handleExchange(event: Exchange): void {
  let executor = AggregationExecutor.load(event.params.pair.toHex());
  if (executor == null) {
    AggregationExecutorTemplate.create(event.params.pair);
    executor = new AggregationExecutor(event.params.pair.toHex());

    executor.save();
  }

  let id = event.transaction.hash
    .toHex()
    .concat("-")
    .concat(event.logIndex.toString());

  let routerExchange = new RouterExchange(id);
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
    .toHex()
    .concat("-")
    .concat(event.logIndex.toString());
  let routerSwapped = new RouterSwapped(id)
  routerSwapped.router = event.address;
  routerSwapped.pair = event.params.srcToken.toHex().concat("_").concat(event.params.dstToken.toHex())
  routerSwapped.tokenIn = event.params.srcToken;
  routerSwapped.amountIn = event.params.spentAmount.toBigDecimal();
  routerSwapped.tokenOut = event.params.dstToken
  routerSwapped.amountOut = event.params.returnAmount.toBigDecimal();
  routerSwapped.userAddress = event.transaction.from;
  routerSwapped.tx = event.transaction.hash;
  routerSwapped.blockNumber = event.block.number;
  routerSwapped.time = event.block.timestamp;
  routerSwapped.save();
}