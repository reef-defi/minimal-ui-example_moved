import {Signer as EvmSigner} from "@reef-defi/evm-provider/Signer";
import {BigNumber} from "ethers";
import {initProvider} from "./providerUtil";
import {InjectedExtension} from "@reef-defi/extension-inject/types";
import type {Signer as SignerInterface, SignerResult} from '@polkadot/api/types';
import {wrapBytes} from "@reef-defi/extension-dapp";

export const subscribeSigner = async (extension: InjectedExtension, cb: ({signer: EvmSigner, balance:BigNumber, evmConnected: boolean})=>void, err: (err: Error)=>void) => {
    // const signer:EvmSigner = await initSigner(testAccount.address, extension.signer);

    (extension)['reefSigner'].subscribeSelectedAccountSigner(async (signer: EvmSigner) => {
        let address = await signer.getAddress();
        console.log("Signer address=", address, await signer.getSubstrateAddress());
        const balanceBigNumber = await signer.getBalance();

        const balance = balanceBigNumber.div(getReefDecimals());
        console.log("Signer balance=", balance.toString());

        const evmConnected = await signer.isClaimed();
        if (!evmConnected) {
            if (balance.lt('3')) {
                err( new Error('<p>To enable contract interaction you need to sign transaction with ~3REEF fee.<br/>To get 1000 testnet REEF simply type:<br/> <code>!drip ' + await signer.getSubstrateAddress() + '</code> <br/>in <a href="https://app.element.io/#/room/#reef:matrix.org" target="_blank">Reef matrix chat</a>. Refresh this page after receiving testnet REEF (~10sec).</p>'));
            }
        }
        cb( {signer, balance, evmConnected});
    });

}

export const getSigner = async (extension: InjectedExtension, testAccount) => {
    const signer:EvmSigner = await initSigner(testAccount.address, extension.signer);

    let address = await signer.getAddress();
    console.log("Signer address=",address, await signer.getSubstrateAddress());
    const balanceBigNumber = await signer.getBalance();

    const balance = balanceBigNumber.div(getReefDecimals());
    console.log("Signer balance=",balance.toString());

    const evmConnected = await signer.isClaimed();
    if(!evmConnected){
        if(balance.lt( '3') ){
            throw new Error('<p>To enable contract interaction you need to sign transaction with ~3REEF fee.<br/>To get 1000 testnet REEF simply type:<br/> <code>!drip '+testAccount.address+'</code> <br/>in <a href="https://app.element.io/#/room/#reef:matrix.org" target="_blank">Reef matrix chat</a>. Refresh this page after receiving testnet REEF (~10sec).</p>');
        }
    }
    return {signer, balance, evmConnected};
}

export async function initSigner(address: String, extensionSigner) {
    return  new EvmSigner(await initProvider(), address, extensionSigner);
}

function getReefDecimals() {
    return BigNumber.from('10').pow('18');
}

async function getMnemonicSigner_serverSideOnly(mnemonic: string): Promise<EvmSigner> {
    const sigKey = new MnemonicSigner(mnemonic);
    return  new EvmSigner(await initProvider(), address, sigKey);
}

// IMPORTANT !!! do not share your mnemonic with anyone or you can loose all funds on account !!!
// do not expose mnemonic in front-end
// - protected server side example
class MnemonicSigner implements SignerInterface {
    mnemonic: string;

    constructor(mnemonic: string){
     this.mnemonic = mnemonic;
    }

    async signPayload(payload: SignerPayloadJSON): Promise<SignerResult>{
        const registry = new TypeRegistry();
        registry.setSignedExtensions(payload.signedExtensions);

        const pair: KeyringPair = await Keyring.keyPairFromMnemonic(this.mnemonic);

        return registry
            .createType('ExtrinsicPayload', payload, { version: payload.version })
            .sign(pair);
    }

    async signRaw(payload: SignerPayloadRaw): Promise<SignerResult>{
        const pair: KeyringPair = await Keyring.keyPairFromMnemonic(this.mnemonic);

        return {id: 0, signature: u8aToHex(pair.sign(wrapBytes(message)))};
    }
}
