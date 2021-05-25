require('dotenv').config();
const Web3 = require('web3');
const open = require('open');
const InputDataDecoder = require('ethereum-input-data-decoder');
const decoder = new InputDataDecoder(`${__dirname}/abi.json`);

// testnet
//const web3 = new Web3('wss://bsc.getblock.io/testnet/?api_key=00854c01-32fa-4602-b14a-7b0b2e54650e');

// mainnet 
const web3 = new Web3('wss://bsc.getblock.io/mainnet/?api_key=00854c01-32fa-4602-b14a-7b0b2e54650e');

let address = process.env.WATCH_ADDRESS;

console.log(`🟢 Watching ${address} ...`);
web3.eth.subscribe('pendingTransactions', (err, txHash) => {
  if (err) {
    console.log(`🔴 Error retrieving network pending transactions`);
    throw (err);
  }
})
  .on('data', function (txHash) {
    return web3.eth.getTransaction(txHash, async (err, transaction) => {
      if (err) {
        console.log(`🔴 ${txHash} not valid transaction`);
        throw (err);
      }
      if (transaction && (transaction.from === address || transaction.to === address)) {
        const result = decoder.decodeData(transaction.input);
        if (result && result.inputs && result.inputs[2]) {
          const routes = result.inputs[2];
          const tokenAddress = `0x${routes[routes.length - 1]}`;

          console.log(`🚩 TransactionHash: ${transaction.hash}`);
          console.log(`🚩 Token Address: ${tokenAddress}`);

          await open(`https://poocoin.app/tokens/${tokenAddress}`);
          await open(`https://exchange.pancakeswap.finance/#/swap?outputCurrency=${tokenAddress}`);
        }
      }
    });
  });
