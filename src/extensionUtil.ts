import {web3Enable} from "@reef-defi/extension-dapp";
import {REEF_EXTENSION_IDENT} from "@reef-defi/extension-inject";

export async function getReefExtension(appName) {
    const ext = await web3Enable(appName);
    if (!ext.length) {
        throw new Error('Install Reef Chain Wallet extension for Chrome or Firefox. See docs.reef.io');
    }

    const extension = ext.find(e=>e.name===REEF_EXTENSION_IDENT);
    // console.log("Accounts from all extensions=",await web3Accounts());

    console.log("Extension=", extension.name);

    return extension;
    /*let testAccount = accounts.find(a => a.address === '5EnY9eFwEDcEJ62dJWrTXhTucJ4pzGym4WZ2xcDKiT3eJecP');
    if(!testAccount){
        testAccount = accounts[0];
    }
    console.log("USING ACCOUNT=", testAccount?testAccount.address:'Test account not found');
    return {extension, testAccount};*/
}
