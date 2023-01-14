import polyfill from './polyfill';
import {flipIt, getFlipperValue} from "./flipperContract";
import {getSigner, subscribeToBalance, toREEFBalanceNormal} from "./signerUtil";
import {getInstallExtensionMessage, getReefExtension, NO_EXT_ERR} from "./extensionUtil";
import {Signer } from "@reef-defi/evm-provider";
import { resolveEvmAddress} from "@reef-defi/evm-provider/utils";
import {InjectedAccount, InjectedExtension, ReefInjected} from "@reef-defi/extension-inject/types";
import {getProvider} from "./providerUtil";

polyfill;

let reefExtension: ReefInjected;
let selectedSigner: Signer;
let selSignerConnectedEVM: boolean;
let unsubBalance = () => {};

document.addEventListener('bind-evm-address', async (evt: any) => {
    if(await isSelectedAddress(evt.detail as string, selectedSigner, 'Error connecting EVM. Selected signer is not the same.')){
        bindEvm(selectedSigner);
    }
});

document.addEventListener('select-account', async (evt: any) => {
    try{
        const signer = await getSigner(reefExtension as InjectedExtension, evt.detail as string);
        await setSelectedSigner(signer.signer);
    }catch (e) {
        displayError(e);
    }
});

document.addEventListener('get-contract-value', async (evt: any) => {
    if(await isSelectedAddress(evt.detail as string, selectedSigner, 'Error getting contract value. Selected signer is not the same.')) {
        getContractValue(selectedSigner);
    }
});

document.addEventListener('toggle-contract-value', async (evt:any) => {
    if(await isSelectedAddress(evt.detail as string, selectedSigner, 'Error changing contract value. Selected signer is not the same.')) {
        toggleContractValue(selectedSigner);
    }
});

window.addEventListener('load', async () => {
    try {
        reefExtension = await getReefExtension('Minimal DApp Example');

        reefExtension.accounts.subscribe((accounts => {
            try {
                if (!accounts || !accounts.length) {
                    throw new Error('Create or enable account in extension');
                }
                setAvailableAccounts(accounts, true);
            } catch (e) {
                displayError(e);
            }
        }));

        /* future feature - this will be available to get selected signer from extension so dApp won't need to manage accounts
        extension.reefSigner.subscribeSelectedAccountSigner(async (sig) => {
            try {
                if (!sig) {
                    throw new Error('Create account in Reef extension or make selected account visible.');
                }
                setSelectedSigner(sig);
            } catch (err) {
                displayError(err);
            }
        });*/
    } catch (e) {
        if (e.message === NO_EXT_ERR) {
            displayError(getInstallExtensionMessage());
            return;
        }
        displayError(e);
    }
});

async function isSelectedAddress(addr: string, selectedSigner: Signer, message: string){
    const selAddr = await selectedSigner.getSubstrateAddress();
    if (addr !== selAddr) {
        displayError({message});
        return false;
    }
    return true;
}

function displayError(err) {
    document.dispatchEvent(new CustomEvent("display-error", {
        detail: err
    }));
}

function clearError() {
    document.dispatchEvent(new Event('clear-error'));
}

async function setSelectedSigner(sig) {
    selectedSigner = sig;
    unsubBalance();
    unsubBalance = await subscribeToBalance(sig, async (balFree) => await updateBalance(selectedSigner, balFree));
    let substrateAddress = await sig?.getSubstrateAddress();
    console.log("new signer=", substrateAddress);
    document.dispatchEvent(new CustomEvent('signer-change', {detail: substrateAddress}));
}

async function isEvmConnected(sig) {
    if (selSignerConnectedEVM) {
        return selSignerConnectedEVM;
    }
    selSignerConnectedEVM = await sig.isClaimed();
    return selSignerConnectedEVM;
}

async function updateBalance(sig, balFree) {
    let balanceNormal = toREEFBalanceNormal(balFree.toString());
    document.dispatchEvent(new CustomEvent('balance-value', {detail: balanceNormal}));

    var evmConnected = await isEvmConnected(sig);
    console.log("New SIGNER balance=", balanceNormal.toString(), ' EVM connected=', evmConnected);

    if (!evmConnected) {
        if (balanceNormal.lt('3')) {
            displayError('<p>To enable contract interaction you need to sign transaction with ~3REEF fee.<br/>To get 1000 testnet REEF simply type:<br/> <code>!drip ' + await sig.getSubstrateAddress() + '</code> <br/>in <a href="https://app.element.io/#/room/#reef:matrix.org" target="_blank">Reef matrix chat</a>. <br/>Listening on chain for balance update.</p>');
            return;
        }
    } else {
        document.dispatchEvent(new Event('evm-connected'));
    }
    clearError();
    document.dispatchEvent(new Event('dapp-connected'));
}

async function bindEvm(sig) {
    try {
        document.dispatchEvent(new Event('tx-progress'));
        await sig.claimDefaultAccount();
        document.dispatchEvent(new Event('tx-complete'));
        document.dispatchEvent(new Event('evm-connected'));
    } catch (e) {
        displayError(e);
    }
}

async function getContractValue(sig) {
    const ctrRes = await getFlipperValue(sig);
    console.log('contract value=',ctrRes)
    document.dispatchEvent(new CustomEvent('contract-value', {detail: ctrRes}));
}

async function toggleContractValue(sig) {
    document.dispatchEvent(new Event('tx-progress'));
    try {
        var ctrRes = await flipIt(sig);
        console.log("flipped=", ctrRes);
        getContractValue(sig);
    } catch (e) {
        displayError(e);
    }
    document.dispatchEvent(new Event('tx-complete'));
}

async function setAvailableAccounts(accounts: InjectedAccount[], useOnlyEvmReadyAccounts: boolean) {
    if(useOnlyEvmReadyAccounts) {
        const provider = await getProvider();
        const resEvmArr = accounts.map(acc => resolveEvmAddress(provider, acc.address));
        const resolved = await Promise.all(resEvmArr);
        accounts = accounts.filter((acc, i) => !!resolved[i]);
    }
    document.dispatchEvent(new CustomEvent('accounts-change', {detail: accounts}));
}
