import polyfill from './polyfill';
import {flipIt, getFlipperValue} from "./flipperContract";
import {getSigner, subscribeToBalance, toREEFBalanceNormal} from "./signerUtil";
import {getReefExtension} from "./extensionUtil";

polyfill;

window.getMnmlDappAPI = async function () {
    return {
        getReefExtension,
        getSigner,
        toREEFBalanceNormal,
        subscribeToBalance,
        getFlipperValue: async (signer) => {
            let val = await getFlipperValue(signer);
            console.log('Flipper value = ', val);
            return val;
        },
        flipIt: async (signer) => {
            console.log("FLIPPING NOW");
            await flipIt(signer);
            const val = await getFlipperValue(signer);
            console.log('New value = ', val);
            return val;
        }
    }
};
