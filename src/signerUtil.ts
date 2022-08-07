import {Signer as EvmSigner} from "@reef-defi/evm-provider/Signer";
import {initExtension} from "./extensionUtil";
import {BigNumber} from "ethers";
import {initProvider} from "./providerUtil";

export const getSigner = async () => {
    let {extension, testAccount} = await initExtension();
    // const  signature = await extension.signer.signRaw({data: JSON.stringify({value:'hello'}), type:'bytes', address:testAccount.address});
    // console.log("DAPP SIGN RESULT =", signature);

    const signer = await initSigner(testAccount.address, extension.signer);

    const balanceBigNumber = await signer.getBalance();
    const balance = balanceBigNumber.div(getReefDecimals());
    if(balance.lt( '3') ){
        alert('Balance should be at least 3 for transaction. Check the docs.reef.io how to get testnet REEF coins.');
    }
    console.log("Signer balance=",balance.toString());

    const hasEvmAddress = await signer.isClaimed();
    if(!hasEvmAddress){
        // create EVM address for smart contract interaction
        await signer.claimDefaultAccount();
    }
    // console.log("account evm address=", await signer.queryEvmAddress());
    return signer;
}

export async function initSigner(address: String, extensionSigner) {
    const provider = await initProvider();
    return  new EvmSigner(provider, address, extensionSigner);
}

function getReefDecimals() {
    return BigNumber.from('10').pow('18');
}
