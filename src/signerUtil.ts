import {Signer as EvmSigner} from "@reef-defi/evm-provider/Signer";
import {initExtension} from "./extensionUtil";
import {BigNumber} from "ethers";
import {initProvider} from "./providerUtil";

export const getSigner = async () => {
    let {extension, testAccount} = await initExtension();
    // const  signature = await extension.signer.signRaw({data: JSON.stringify({value:'hello'}), type:'bytes', address:testAccount.address});
    // console.log("DAPP SIGN RESULT =", signature);

    const signer:EvmSigner = await initSigner(testAccount.address, extension.signer);

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
    return signer;
}

export async function initSigner(address: String, extensionSigner) {
    return  new EvmSigner(await initProvider(), address, extensionSigner);
}

function getReefDecimals() {
    return BigNumber.from('10').pow('18');
}
