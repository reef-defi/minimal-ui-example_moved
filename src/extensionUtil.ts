import {web3Enable} from "@reef-defi/extension-dapp";

export async function initExtension() {
    const ext = await web3Enable('Test REEF DApp');
    if (!ext.length) {
        throw new Error('Install Reef Chain Wallet extension for Chrome or Firefox. See docs.reef.io');
    }
    const extension = ext[0];
    // console.log("Accounts from all extensions=",await web3Accounts());

    console.log("Extension=", extension.name);
    const accounts = await extension.accounts.get();
    if(!accounts.length){
        throw new Error('Create or import account in extension.');
    }
    let testAccount = accounts.find(a => a.address === '5EnY9eFwEDcEJ62dJWrTXhTucJ4pzGym4WZ2xcDKiT3eJecP');
    if(!testAccount){
        testAccount = accounts[0];
    }
    console.log("USING ACCOUNT=", testAccount?testAccount.address:'Test account not found');
    return {extension, testAccount};
}
