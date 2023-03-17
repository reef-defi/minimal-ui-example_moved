import {Signer} from "@reef-defi/evm-provider";
import {transactionUtils} from "@reef-chain/util-lib";
import {Contract} from "ethers";
import {Observable} from "rxjs";
import {TransactionStatusEvent} from "../../reef-util-lib/lib/transaction";
import {initProvider} from "./providerUtil";
import {web3Enable} from "@reef-defi/extension-dapp";
import {REEF_EXTENSION_IDENT} from "@reef-defi/extension-inject";

const ERC20_TRANSFER_ABI = [{
    inputs: [
        {name: 'recipient', type: 'address'},
        {name: 'amount', type: 'uint256'},
    ],
    name: 'transfer',
    outputs: [{name: '', type: 'bool'}],
    stateMutability: 'nonpayable',
    type: 'function',
}];

const STORAGE_LIMIT = 2000;

export async function completeTransferExample(amount: string, toAddress: string, contractAddress: string): Promise<any> {
    const extensionsArr = await web3Enable('Test Transfer');
    const reefExtension = extensionsArr.find(e => e.name === REEF_EXTENSION_IDENT);

    const provider = await initProvider('wss://rpc.reefscan.info/ws');

    const accs = await reefExtension.accounts.get();
    // const fromAddr = accs[0].address;
    const fromAddr='5EnY9eFwEDcEJ62dJWrTXhTucJ4pzGym4WZ2xcDKiT3eJecP'
    console.log('took first account in wallet')
    const signer = new Signer(provider, fromAddr, reefExtension.signer);

    const tokenContract = new Contract(contractAddress, ERC20_TRANSFER_ABI, signer);

    console.log('transfer from=', fromAddr, ' to=', toAddress, ' contract=', contractAddress);

    return tokenContract.transfer(toAddress, amount, {
        customData: {
            storageLimit: STORAGE_LIMIT
        }
    }).then((tx) => {
        console.log('tx ', tx)
        return tx.wait()
    }).then((txRec) => {
        console.log('tx receipt', txRec)
        return txRec;
    });
}
