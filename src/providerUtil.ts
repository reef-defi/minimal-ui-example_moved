import {Provider} from "@reef-defi/evm-provider";
import {WsProvider} from "@polkadot/rpc-provider";

export async function initProvider(rpcUrl: string = 'wss://rpc-testnet.reefscan.info/ws') {
    console.log('connecting provider =',rpcUrl);
    const evmProvider = new Provider({
        provider: new WsProvider(rpcUrl)
    });
    await evmProvider.api.isReadyOrError;
    console.log('provider connected');
    return evmProvider;
}

export function getProviderFromUrl(): string|null {

    var search = location.search.substring(1);
    if(search){
        JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
    }
    return search?.split('=')[0]==='rpc'?search?.split('=')[1]:null
}