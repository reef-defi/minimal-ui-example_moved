import {web3Enable} from "@reef-defi/extension-dapp";

// TODO move to lib
(window as any).onReefInjectedPromise = ()=>new Promise(resolve => {
    // remove timeout
    setTimeout(() => resolve(), 1000);
});

export async function initExtension() {
    const compatInits = (window as any).onReefInjectedPromise?[(window as any).onReefInjectedPromise]:[];
    const ext = await web3Enable('Test REEF DApp', compatInits);
    if (!ext.length) {
        alert('Install Reef Chain Wallet extension for Chrome or Firefox. See docs.reef.io')
        return;
    }
    const extension = ext[0];
    // console.log("Accounts from all extensions=",await web3Accounts());

    console.log("Extension=", extension.name);
    const accounts = await extension.accounts.get();
    if(!accounts.length){
        alert('Create or import account in extension.')
        return;
    }
    let testAccount = accounts.find(a => a.address === '5EnY9eFwEDcEJ62dJWrTXhTucJ4pzGym4WZ2xcDKiT3eJecP');
    if(!testAccount){
        testAccount = accounts[0];
    }
    console.log("USING ACCOUNT=", testAccount?testAccount.address:'Test account not found');
    return {extension, testAccount};
}
