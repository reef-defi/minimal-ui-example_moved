import {Provider} from "@reef-defi/evm-provider";
import {isMainnet} from "@reef-defi/evm-provider/utils";
import {WsProvider} from "@polkadot/rpc-provider";

export async function initProvider() {
    // const URL = 'wss://rpc.reefscan.com/ws';
    // const URL = 'wss://reef-rpc-node-v10-sqysk3ad2a-uc.a.run.app:9944';
    // const URL = 'ws://35.205.95.115:9944'; // testnet
    const URL = 'wss://rpc.reefscan.info/ws'; // mainnet
    // const URL = 'wss://qibkuag35lfo19renrejfsoteo.ingress.bdl.computer:30993';
    console.log("connecting to",URL);
    const evmProvider = new Provider({
        provider: new WsProvider(URL)
    });
    await evmProvider.api.isReadyOrError;
    console.log("CONNECTED to",URL,await isMainnet(evmProvider));
    return evmProvider;
}
