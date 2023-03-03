import {Provider} from "@reef-defi/evm-provider";
import {WsProvider} from "@polkadot/rpc-provider";
import {isMainnet} from "@reef-defi/evm-provider/utils";

export async function initProvider(rpcUrl: string = 'wss://rpc-testnet.reefscan.info/ws') {
    console.log('connecting provider =',rpcUrl);
    const evmProvider = new Provider({
        provider: new WsProvider(rpcUrl)
    });
    await evmProvider.api.isReadyOrError;
    console.log('TEST OK, CONNECTED provider mainnet=', await isMainnet(evmProvider));
    const now=await evmProvider.api.query.timestamp.now()
    const blockH=await evmProvider.api.query.system.number();

    console.log(rpcUrl, ' RPC NOW AT=',new Date(now.toNumber()), ' at height=',blockH.toString())
    return evmProvider;
}

export function getProviderFromUrl(): string|null {

    var search = location.search.substring(1);
    if(search){
        JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
    }
    return search?.split('=')[0]==='rpc'?search?.split('=')[1]:null
}