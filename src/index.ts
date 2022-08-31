import polyfill from './polyfill';
import {flipIt, getFlipperValue} from "./flipperContract";
import {getSigner} from "./signerUtil";
import {availableNetworks, reefState, selectedSigner$} from "@reef-chain/util-lib";

polyfill;

(window as any).flipperApi = {
    getSigner,
    flipIt: async (signer)=>{
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
    initState: async ( ) =>{
        reefState.initReefState(availableNetworks.mainnet );
    },
    getTokens: async  () => {
        console.log("ggg=",selectedSigner$);
        // return firstValueFrom(selectedSignerTokenBalances$);
        selectedSigner$.subscribe((val) => console.log('SSSS', val));
    }
};
