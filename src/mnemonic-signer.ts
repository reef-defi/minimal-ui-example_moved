import {Signer as SignerInterface, SignerResult} from "@polkadot/api/types";
import {u8aToHex} from "@polkadot/util";
// import {wrapBytes} from '@reef-defi/extension-dapp/wrapBytes';
import {TypeRegistry} from '@polkadot/types';
import {KeyringPair} from '@polkadot/keyring/types';
import type {SignerPayloadJSON, SignerPayloadRaw} from '@polkadot/types/types';
import {KeypairType} from "@polkadot/util-crypto/types";
import {Keyring as ReefKeyring} from "@polkadot/keyring";
import {cryptoWaitReady, decodeAddress, signatureVerify} from "@polkadot/util-crypto";

// this script should be run with 'npx ts-node ./src/mnemonic-signer.ts' since it's meant to be server-side only
// use with caution at your own risk !!!

const CRYPTO_TYPE: KeypairType = "sr25519";
const SS58_FORMAT = 42;
const keyring = new ReefKeyring({type: CRYPTO_TYPE, ss58Format: SS58_FORMAT});

async function keyPairFromMnemonic(mnemonic: string): Promise<KeyringPair> {
    try {
        return keyring.addFromMnemonic(mnemonic, {}, CRYPTO_TYPE);
    } catch (err) {
        console.log("error in keyPairFromMnemonic", err);
        return null;
    }
}

const isValidSignature = (signedMessage, signature, address) => {
    const publicKey = decodeAddress(address);
    const hexPublicKey = u8aToHex(publicKey);

    return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
};

export class MnemonicSigner implements SignerInterface {
    mnemonic: string;
    private nextId = 0;

    constructor(mnemonic: string) {
        this.mnemonic = mnemonic;
    }

    async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
        const registry = new TypeRegistry();
        registry.setSignedExtensions(payload.signedExtensions);

        const pair: KeyringPair = await keyPairFromMnemonic(this.mnemonic);

        return {
            id: ++this.nextId,
            ...registry
                .createType('ExtrinsicPayload', payload, {version: payload.version})
                .sign(pair)
        };
    }

    async signRaw(payloadRaw: SignerPayloadRaw): Promise<SignerResult> {
        throw new Error('not implemented')
        /*const pair: KeyringPair = await keyPairFromMnemonic(this.mnemonic);
        if (pair.address === payloadRaw.address) {

        }
        return {id: ++this.nextId, signature: u8aToHex(pair.sign(wrapBytes(payloadRaw.data)))};*/
    }
}

/*(async function test() {
    const isReady = await cryptoWaitReady();
    if (isReady) {
        console.log("WASM initialized");
    } else {
        console.log("Error initializing WASM");
    }
    const signingKey = new MnemonicSigner('burger provide angry return spell silver ceiling produce antenna decrease evolve private');
    const signMessage = 'hello world';
    const signingAddress = '5Fmkd81ZxQHc8krcy6oLJxdW88F8ZqWi8GPPFX4nYz9Wecvy';

    const signedResult = await signingKey.signRaw({
        data: signMessage,
        address: signingAddress,
        type: "bytes"
    });

    console.log('signature=', signedResult.signature);
    console.log('isValid=', await isValidSignature(signMessage, signedResult.signature, signingAddress));
})();*/
