
import {ReefInjected, ReefSignerResponse, ReefSignerStatus} from "@reef-defi/extension-inject/types";
import {web3Accounts, web3Enable} from "@reef-defi/extension-dapp";
import {getReefExtension} from "./extensionUtil";

function getAccountNfts(address: string) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
        query: "query {\n    tokenHolders(limit: 100, where: {signer: {id_eq: \""+address+"\"}, balance_gt: \"0\", nftId_isNull: false}) {\n    balance\n    id\n  }\n }",
        variables: {}
    })
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow'
    };

    let reefGqlUrl = "https://squid.subsquid.io/reef-explorer/graphql";

    return fetch(reefGqlUrl, requestOptions)
        .then(res=>res.text())
        .then(async (response) => {
            const res = JSON.parse(response);
            return res.data.tokenHolders.map(r=>({...r, contractAddress:r.id.split('-')[0], nftId:r.id.split('-')[2]}));
        })
        .catch(error => console.log('error', error));
}

(async function init() {
    const w3 = await getReefExtension('ttt');
    const acc = await web3Accounts();
    w3.accounts.subscribe(async (accs)=>{
        const sel = accs.find(a => a.isSelected);
        console.log('selected address=', sel);
        const res= await getAccountNfts(sel.address)
        console.log('Account NFTs=',res)
    });
})();

