const ethers = require('ethers');
const list = require('./list.json')
const lnrWrapperContractInterface = require('./lnrWrapper-contract-abi.json');
const lnrContractInterface = require('./contract-abi.json');
const lnraddress = '0x5564886ca2C518d1964E5FCea4f423b41Db9F561';
const wlnrAddress = '0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7';

const mnemonic = 'word word word word word word word word word word word word';

const url = 'https://mainnet.infura.io/v3/726d2356949c40749b2c888d65a2db03'
const provider = new ethers.providers.JsonRpcProvider(url);

const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);

const lnrWrapperContract = new ethers.Contract(wlnrAddress, lnrWrapperContractInterface, account);
const lnrContract = new ethers.Contract(lnraddress, lnrContractInterface, account);


async function wrap(inputField) {
    const bytes = ethers.utils.formatBytes32String(inputField);
    console.log("Creating wrapper for  " + inputField)
    const createWrapper = await lnrWrapperContract.createWrapper(bytes)
    await createWrapper.wait()
    console.log("Wrapper created")
    console.log("Transferring ownership of to WLNR contract")
    const transfer = await lnrContract.transfer(bytes, wlnrAddress)
    await transfer.wait()
    console.log("Ownership transferred")
    console.log("Wrapping " + inputField)
    const wrap = await lnrWrapperContract.wrap(bytes);
    await wrap.wait()
    console.log("Wrapped " + inputField)
}

async function main() {
    for (let i = 0; i < list.results.length; i++) {
        await wrap(list.results[i])
    }
}

main()
