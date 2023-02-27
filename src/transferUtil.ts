import {Signer} from "@reef-defi/evm-provider";
import {transactionUtils} from "@reef-chain/util-lib";
import {Contract} from "ethers";
import {Observable} from "rxjs";
import {TransactionStatusEvent} from "../../reef-util-lib/lib/transaction";

export async function sendNativeREEFTransfer (amount: string, fromSigner: Signer, toAddress: string): Promise<void>{
    await transactionUtils.nativeTransferSigner$(amount, fromSigner, toAddress).subscribe((val: any) => {
        console.log('NATIVE TX STATUS=', val)
    }, (err) => console.log('TRANSACTION ERR=', err));
}

export  function sendERC20Transfer (amount: string, fromSigner: Signer, toAddress: string, contractAddress: string): Observable<TransactionStatusEvent>{
    const ERC20 = [{
        inputs: [
            { name: 'recipient', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    }];
    let tContract=new Contract(contractAddress, ERC20, fromSigner);
    return transactionUtils.reef20Transfer$(toAddress, fromSigner.provider, amount, tContract);
}