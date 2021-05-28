require('dotenv').config();
const open = require('open');
const sound = require('sound-play');
const {
  isPancakeSwapV1Router,
  getPancakeTokenURL,
  getPancakeInputToken,
  getPoocoinTokenURL,
  getWeb3Connection,
} = require('./helpers');

const web3 = getWeb3Connection();
const notificationPath = `${__dirname}/sound/notification.mp3`;
const address = process.env.WATCH_ADDRESS;

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

        const isPancakeV1 = isPancakeSwapV1Router(transaction.to);
        const tokenAddress = getPancakeInputToken(transaction.input);

        if (tokenAddress) {
          console.log(`----------------------------------------------------------------------------`);
          console.log(`🚩 TransactionHash: ${transaction.hash}`);
          console.log(`🚩 Token Address: ${tokenAddress}`);

          if (!firstTxFound) {
            firstTxFound = true;
            await open(getPoocoinTokenURL(tokenAddress));
            await open(getPancakeTokenURL(tokenAddress, isPancakeV1));
          }
        }
      }
    });
  });