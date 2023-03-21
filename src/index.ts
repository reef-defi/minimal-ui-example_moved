import polyfill from './polyfill';
import {initProvider} from "./providerUtil";
import {BigNumber} from "ethers";

polyfill;

window.addEventListener('load',
    async () => {
        try {
            // await completeTransferExample('1000000000000000000', '0xeB33ef5Cd460F79C335bbcdcFC5f1a2EaDd6C6c5', tokenUtil.REEF_ADDRESS)
            const api = await initProvider('wss://rpc-testnet.reefscan.info/ws');
            console.log('GEN=',api.genesisHash.toString());
            let accAddr = '5FnTGxAVA7bP6wAd39BNBRomg5tooLZ7ZEfJZjPp8dgM7puP';
            const toAddress='5GsucwmqZtAZfBaXPV77qcCAL1ekaAfHLekbn41gKv1qfjnH';
            // const toAddress='5G9f52Dx7bPPYqekh1beQsuvJkhePctWcZvPDDuhWSpDrojN';
            const decimals = 10e18;
            const unsub = api.query.system.account(accAddr, ({ nonce, data: balance }) => {

                console.log('acc=',accAddr,'balance=',balance.free.toString());
            });
            const unsub1 = api.query.system.account(toAddress, ({ nonce, data: balance }) => {
                console.log('acc1=',toAddress,'balance=',BigNumber.from(balance.free.toString()));
            });
            //5G9f52Dx7bPPYqekh1beQsuvJkhePctWcZvPDDuhWSpDrojN




        }catch (e) {
            displayError(e);
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

