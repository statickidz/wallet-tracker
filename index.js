require('dotenv').config();
const Web3 = require('web3');
const open = require('open');
const InputDataDecoder = require('ethereum-input-data-decoder');
const decoder = new InputDataDecoder(`${__dirname}/data/abi.json`);
const sound = require('sound-play');
const notificationPath = `${__dirname}/sound/notification.mp3`;

const network = process.env.NETWORK ? process.env.NETWORK : 'mainnet';
const address = process.env.WATCH_ADDRESS;

const web3 = new Web3(`wss://bsc.getblock.io/${network}/?api_key=00854c01-32fa-4602-b14a-7b0b2e54650e`);

let firstTxFound = false;

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
        sound.play(notificationPath);
        const result = decoder.decodeData(transaction.input);
        const routes = result.inputs ? result.inputs.find(route => Array.isArray(route)) : false;
        if (result && routes) {
          const tokenAddress = `0x${routes[routes.length - 1]}`;

          console.log(`----------------------------------------------------------------------------`);
          console.log(`🚩 TransactionHash: ${transaction.hash}`);
          console.log(`🚩 Token Address: ${tokenAddress}`);

          if (!firstTxFound) {
            firstTxFound = true;
            await open(`https://poocoin.app/tokens/${tokenAddress}`);
            await open(`https://exchange.pancakeswap.finance/#/swap?outputCurrency=${tokenAddress}`);
          }
        }
      }
    });
  });