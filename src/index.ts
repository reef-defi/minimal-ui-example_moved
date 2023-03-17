import polyfill from './polyfill';
import {Signer} from "@reef-defi/evm-provider";
import {completeTransferExample} from "./transferUtil";
import {tokenUtil} from "@reef-chain/util-lib";
import {initProvider} from "./providerUtil";
import {BigNumber} from "ethers";
import {getReefExtension} from "./extensionUtil";

polyfill;

window.addEventListener('load',
    async () => {
        try {
            // await completeTransferExample('1000000000000000000', '0xeB33ef5Cd460F79C335bbcdcFC5f1a2EaDd6C6c5', tokenUtil.REEF_ADDRESS)
            const provider = await initProvider('wss://rpc-testnet.reefscan.info/ws');
            console.log('GEN=',provider.api.genesisHash.toString());
            let accAddr = '5FnTGxAVA7bP6wAd39BNBRomg5tooLZ7ZEfJZjPp8dgM7puP';
            const toAddress='5EnY9eFwEDcEJ62dJWrTXhTucJ4pzGym4WZ2xcDKiT3eJecP';
            // const toAddress='5G9f52Dx7bPPYqekh1beQsuvJkhePctWcZvPDDuhWSpDrojN';
            const unsub = provider.api.query.system.account(accAddr, ({ nonce, data: balance }) => {
                console.log('BBBB=',balance.free.toString());
            });
            const unsub1 = provider.api.query.system.account(toAddress, ({ nonce, data: balance }) => {
                console.log('BBBB1=',balance.free.toString());
            });
            //5G9f52Dx7bPPYqekh1beQsuvJkhePctWcZvPDDuhWSpDrojN

            const reefExtension = await getReefExtension('Minimal DApp Example');

            reefExtension.accounts.subscribe((async (accounts) => {
                try {
                    if (!accounts || !accounts.length) {
                        throw new Error('Create or enable account in extension');
                    }
                    console.log('AAAA',accounts);

                    const signer = new Signer(provider, accAddr, reefExtension.signer);

                    const isConn = await signer.isClaimed();
                    console.log('CONN=',isConn)

                    if (!isConn) {
                        signer.claimDefaultAccount();
                    }


                    // const signerTo = new Signer(provider, '5G9f52Dx7bPPYqekh1beQsuvJkhePctWcZvPDDuhWSpDrojN', reefExtension.signer);
                    // const isConnTo = await signerTo.isClaimed();
                    // console.log('CONN=',isConn)
                    //
                    // if (!isConnTo) {
                    //     signerTo.claimDefaultAccount();
                    // }

                    // provider.api.query.system.account(accAddr).then((res)=>{
                    //     let fromBalance = res.data.free.toString();
                    //     let amount = '50000000000000000000000';
                    //
                    //     provider.api.tx.balances
                    //         .transfer(toAddress, amount)
                    //         .signAndSend(accAddr, {signer: reefExtension.signer}, (val)=>{
                    //             console.log('TX CB=',val)
                    //         }).catch(e=>console.log('ERRR=',e));
                    //
                    // });


                } catch (e) {
                    displayError(e);
                }
            }));



        }catch (e) {
            displayError(e);
        }
    });


function displayError(err) {
    document.dispatchEvent(new CustomEvent("display-error", {
        detail: err
    }));
}

function clearError() {
    document.dispatchEvent(new Event('clear-error'));
}

