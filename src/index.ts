import polyfill from './polyfill';
import {flipIt, getFlipperValue} from "./flipperContract";
import {getSigner} from "./signerUtil";
import {availableNetworks, reefState, selectedSigner$} from "@reef-chain/util-lib";
import {web3Enable} from "@reef-defi/extension-dapp";
import {getReefExtension} from "./extensionUtil";

polyfill;

/*(window as any).flipperApi = {
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
};*/

window.initMinDapp = async function () {
    console.log("min dApp init");
    /*const extension = await getReefExtension('Minimal DApp Example');
    extension.accounts.subscribe(async (accounts) => {
        if (!accounts.length) {
            document.dispatchEvent(new CustomEvent('min-dapp_error', {detail: {message: 'Create or import account in extension.'}}))
            return;
        }
        console.log("acounts=", accounts);
        // const selectedSigner = await getSigner(extension, accounts[0]);
        document.dispatchEvent(new CustomEvent('min-dapp_app-state', {
            detail: {
                state: {
                    extension,
                    accounts
                }
            }
        }));
    });*/
    return {
        getReefExtension,
        getSigner,
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
    // document.body.classList.add("extension-initialized");
    // document.dispatchEvent(new Event('min-dapp_initialized'))
};

/*
function displayError(e) {
    document.body.classList.add("reef-extension-error");
    document.getElementsByClassName('error-msg')[0].innerHTML = e.message;
}*/

/*async function bindEvm() {
    try {
        document.body.classList.add("claiming-evm");
        await window.reefSigner.claimDefaultAccount();
        document.body.classList.add("evm-connected");
    } catch (e) {
        displayError(e);
    }
}*/
