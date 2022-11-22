import {web3Enable, web3FromSource} from "@reef-defi/extension-dapp";
import {REEF_EXTENSION_IDENT} from "@reef-defi/extension-inject";
import {ReefInjected} from "@reef-defi/extension-inject/types";

export const NO_EXT_ERR = 'no-extension-err';

export async function getReefExtension(appName) {
    const extensionsArr = await web3Enable(appName);
    const extension = extensionsArr.find(e=>e.name===REEF_EXTENSION_IDENT);
    // const extension = await web3FromSource(REEF_EXTENSION_IDENT);
    if (!extension) {
        throw new Error(NO_EXT_ERR);
    }
    console.log("Extension=", extension);
    return extension as ReefInjected;
}

export function getBrowserExtensionUrl(): string | undefined {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
        return 'https://addons.mozilla.org/en-US/firefox/addon/reef-js-extension/';
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    if (isChrome) {
        return 'https://chrome.google.com/webstore/detail/reefjs-extension/mjgkpalnahacmhkikiommfiomhjipgjn';
    }
    return undefined;
}

export function getInstallExtensionMessage(): { message: string; url?: string } {
    const extensionUrl = getBrowserExtensionUrl();
    const installText = extensionUrl
        ? 'Please install Reef Chain browser extension or enable this domain and refresh the page.'
        : 'Please use Chrome or Firefox browser.';
    return {
        message: `App uses browser extension to get accounts and securely sign transactions. ${installText}`,
        url: extensionUrl,
    };
}
