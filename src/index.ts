import polyfill from './polyfill';
import {Signer} from "@reef-defi/evm-provider";
import {completeTransferExample} from "./transferUtil";
import {tokenUtil} from "@reef-chain/util-lib";

polyfill;

window.addEventListener('load',
    async () => {
        try {
            await completeTransferExample('1', '0x8Eb24026196108108E71E45F37591164BDefcB76', tokenUtil.REEF_ADDRESS)
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

