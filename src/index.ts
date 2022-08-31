import polyfill from './polyfill';
import {flipIt, getFlipperValue} from "./flipperContract";
import {getSigner} from "./signerUtil";
import {availableNetworks, reefState, selectedSigner$} from "@reef-chain/util-lib";

polyfill;

(window as any).flipperApi = {
    getSigner,
    flipIt: async (signer) => {
        console.log("FLIPPING NOW");
        await flipIt(signer);
        const val = await getFlipperValue(signer);
        console.log('New value = ', val);
        return val;
    },
    getFlipperValue: async (signer) => {
        let val = await getFlipperValue(signer);
        console.log('Flipper value = ', val);
        return val;
    },
    initState: async () => {

        reefState.initReefState(availableNetworks.mainnet);
    },
    getTokens: async () => {
        console.log("ggg=", selectedSigner$);
        // return firstValueFrom(selectedSignerTokenBalances$);
        selectedSigner$.subscribe((val) => console.log('SSSS', val));
    }
};

(async function init() {
    try {
        console.log("min dApp init");
        const reefSigner = await getSigner();
        // await initState();
        // document.body.classList.add("connected");
        document.dispatchEvent(new CustomEvent('min-dapp_app-state', {detail:reefSigner}));
        document.dispatchEvent(new Event('min-dapp_init'));
        if (await reefSigner.isClaimed()) {
            // document.body.classList.add("evm-connected");
            document.dispatchEvent(new Event('min-dapp_evm-connected'))
        }
    } catch (e) {
        console.log("Error=", e);
        document.dispatchEvent(new CustomEvent('min-dapp_error', {detail:e}))
    }
    // document.body.classList.add("extension-initialized");
    document.dispatchEvent(new Event('min-dapp_initialized'))
}());

/*
function displayError(e) {
    document.body.classList.add("reef-extension-error");
    document.getElementsByClassName('error-msg')[0].innerHTML = e.message;
}*/

async function bindEvm() {
    try {
        document.body.classList.add("claiming-evm");
        await window.reefSigner.claimDefaultAccount();
        document.body.classList.add("evm-connected");
    } catch (e) {
        displayError(e);
    }
}
