import {ExecutorExchange} from "../types/router/schema";
import {Exchange} from "../types/router/templates/Executor/Executor";

export function handleExecutorExchange(event: Exchange): void {
  let id = event.transaction.hash
    .toHex()
    .concat("-")
    .concat(event.logIndex.toString());

  let executorExchange = new ExecutorExchange(id);
  executorExchange.executor = event.address;
  executorExchange.pair = event.params.pair;
  executorExchange.token = event.params.output;
  executorExchange.amount = event.params.amountOut.toBigDecimal();
  executorExchange.userAddress = event.transaction.from;
  executorExchange.tx = event.transaction.hash;
  executorExchange.blockNumber = event.block.number;
  executorExchange.time = event.block.timestamp;
  executorExchange.save();
}
