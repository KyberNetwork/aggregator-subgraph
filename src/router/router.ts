import {AggregationExecutor, RouterExchange} from "../types/router/schema";
import {Exchange} from "../types/router/Router/Router";
import {AggregationExecutor as AggregationExecutorTemplate} from "../types/router/templates";

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
  routerExchange.pair = event.params.pair;
  routerExchange.token = event.params.output;
  routerExchange.amount = event.params.amountOut.toBigDecimal();
  routerExchange.userAddress = event.transaction.from;
  routerExchange.tx = event.transaction.hash;
  routerExchange.blockNumber = event.block.number;
  routerExchange.time = event.block.timestamp;
  routerExchange.save();
}
