import {web3Enable, web3FromSource} from "@reef-defi/extension-dapp";
import {REEF_EXTENSION_IDENT} from "@reef-defi/extension-inject";
import {ReefInjected} from "@reef-defi/extension-inject/types";

export async function getReefExtension(appName) {
    // delay init not needed in normal app
    let delayInit = [()=>{
        return new Promise((r)=>{
            setTimeout(()=>{
                r(true);
            }, 300);
        });

    }];
    const extensionsArr = await web3Enable(appName, delayInit);
    const extension = extensionsArr.find(e=>e.name===REEF_EXTENSION_IDENT);
    // const extension = await web3FromSource(REEF_EXTENSION_IDENT);
    if (!extension) {
        throw new Error('Install Reef Chain Wallet extension for Chrome or Firefox. See docs.reef.io');
    }
    console.log("Extension=", extension);
    return extension as ReefInjected;
}
