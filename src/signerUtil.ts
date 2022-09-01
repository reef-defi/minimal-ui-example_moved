import {Signer as EvmSigner} from "@reef-defi/evm-provider/Signer";
import {BigNumber} from "ethers";
import {initProvider} from "./providerUtil";
import {ReefSigner} from "@reef-chain/util-lib/lib/account/ReefAccount";
import {reefState, availableNetworks} from "@reef-chain/util-lib";
import {InjectedExtension} from "@reef-defi/extension-inject/types";
import type { Signer as SignerInterface, SignerResult } from '@polkadot/api/types';
import {wrapBytes} from "@reef-defi/extension-dapp";

export const getExtension = async () => {

}

export const getSigner = async (extension: InjectedExtension, testAccount) => {
    // const  signature = await extension.signer.signRaw({data: JSON.stringify({value:'hello'}), type:'bytes', address:testAccount.address});
    // console.log("DAPP SIGN RESULT =", signature);

    const signer:EvmSigner = await initSigner(testAccount.address, extension.signer);

    let address = await signer.getAddress();
    console.log("Signer address=",address);
    const balanceBigNumber = await signer.getBalance();

    const balance = balanceBigNumber.div(getReefDecimals());
    console.log("Signer balance=",balance.toString());

    const hasEvmAddress = await signer.isClaimed();
    if(!hasEvmAddress){
        if(balance.lt( '3') ){
            throw new Error('<p>To enable contract interaction you need to sign transaction with ~3REEF fee.<br/>To get 1000 testnet REEF simply type:<br/> <code>!drip '+testAccount.address+'</code> <br/>in <a href="https://app.element.io/#/room/#reef:matrix.org" target="_blank">Reef matrix chat</a>. Refresh this page after receiving testnet REEF (~10sec).</p>');
            // throw new Error('To enable contract interaction you need to sign transaction with ~3REEF fee. Check the docs.reef.io how to get testnet REEF coins.');
        }
        // create EVM address for smart contract interaction
        // alert('To enable contract interaction you need to sign transaction to get Reef Ethereum VM address.')
        // await signer.claimDefaultAccount();
    }
    // console.log("account evm address=", await signer.queryEvmAddress());
    return {signer, balance: balance, evmConnected: hasEvmAddress};
}

export async function initSigner(address: String, extensionSigner) {
    return  new EvmSigner(await initProvider(), address, extensionSigner);
}

function getReefDecimals() {
    return BigNumber.from('10').pow('18');
}

function getMnemonicSigner_serverSideOnly(mnemonic: string): EvmSigner{
    const sigKey = new MnemonicSigner(mnemonic);
    return  new EvmSigner(await initProvider(), address, sigKey);
}

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
