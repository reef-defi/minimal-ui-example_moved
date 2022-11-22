import {Provider} from "@reef-defi/evm-provider";
import {WsProvider} from "@polkadot/rpc-provider";

export let provider: Provider;

export async function getProvider() {
    if (!provider) {
        const URL = 'wss://rpc-testnet.reefscan.com/ws';
        provider = new Provider({
            provider: new WsProvider(URL)
        });
        await provider.api.isReadyOrError;
    }

    return provider;
}
