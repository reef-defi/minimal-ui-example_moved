import polyfill from './polyfill';
import {Signer} from "@reef-defi/evm-provider";
import {completeTransferExample} from "./transferUtil";
import {tokenUtil} from "@reef-chain/util-lib";
import {initProvider} from "./providerUtil";

polyfill;

window.addEventListener('load',
    async () => {
        try {
            // await completeTransferExample('1000000000000000000', '0xeB33ef5Cd460F79C335bbcdcFC5f1a2EaDd6C6c5', tokenUtil.REEF_ADDRESS)
            const provider = initProvider('wss://rpc-testnet.reefscan.info/ws');
            // const bal = provider.api.
        }catch (e) {
            displayError('ERR=',e);
        }
    });


function displayError(err) {
    document.dispatchEvent(new CustomEvent("display-error", {
        detail: err
    }));
}

function clearError() {
    document.dispatchEvent(new Event('clear-error'));
}

