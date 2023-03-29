import {WsProvider} from "@polkadot/api";
import {ApiPromise} from "@polkadot/api"
import {types} from "@reef-defi/type-definitions";
import {Provider} from "@reef-defi/evm-provider";

export async function initProvider(rpcUrl: string = 'wss://rpc-testnet.reefscan.com/ws'):Promise<Provider> {
    console.log('connecting provider =',rpcUrl);
    const evmProvider = new Provider({
        provider: new WsProvider(rpcUrl)
    });
    await evmProvider.api.isReadyOrError;
    const now=await evmProvider.api.query.timestamp.now()
    const blockH=await evmProvider.api.query.system.number();

    console.log(rpcUrl, ' RPC NOW AT=',new Date(now.toNumber()), ' at height=',blockH?.toString())
    return evmProvider;
}

export async function initProviderFromTypes(rpcUrl: string = 'wss://rpc-testnet.reefscan.com/ws'):Promise<ApiPromise> {
    console.log('connecting provider =',rpcUrl);
    const provider= new WsProvider(rpcUrl)

    const api = await ApiPromise.create({types, provider});
    await api.isReadyOrError;
    console.log('provider connected !!!!!!!!!!');
    return api;
}

export function getProviderFromUrl(): string|null {

    var search = location.search.substring(1);
    if(search){
        JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
    }
    return search?.split('=')[0]==='rpc'?search?.split('=')[1]:null
}