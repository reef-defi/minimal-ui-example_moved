import {WsProvider} from "@polkadot/api";
import {ApiPromise} from "@polkadot/api"
import {types} from "@reef-defi/type-definitions";

export async function initProvider(rpcUrl: string = 'wss://rpc-testnet.reefscan.info/ws') {
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