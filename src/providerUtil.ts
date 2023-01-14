import {Provider} from "@reef-defi/evm-provider";
import {isMainnet} from "@reef-defi/evm-provider/utils";
import {WsProvider} from "@polkadot/rpc-provider";

export async function getProvider() {
var search = location.search.substring(1);
if(search){
    JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
    console.log('ssss',search.split('='))
 }
let URL=search?.split('=')[1]
if(!URL){
    
//     const URL = 'ws://34.77.4.36/ws';
    URL = 'ws://rpc-testnet.reefscan.info/ws';
//    const URL = 'ws://34.77.125.110:9944';
}
    console.log('connecting provider =',URL);
    const evmProvider = new Provider({
        provider: new WsProvider(URL)
    });
    await evmProvider.api.isReadyOrError;
    console.log('CONNECTED provider mainnet=', await isMainnet(evmProvider));
const now=await evmProvider.api.query.timestamp.now()  
const blockH=await evmProvider.api.query.system.number();      

    console.log('NOW AT=',new Date(now.toNumber()), ' at height=',blockH.toString())
    return evmProvider;
}
