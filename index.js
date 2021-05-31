require('dotenv').config();
const open = require('open');
const sound = require('sound-play');
const notificationPath = `${__dirname}/sound/notification.mp3`;
const {
  isPancakeSwapV1Router,
  getPancakeTokenURL,
  getPancakeInputToken,
  getPoocoinTokenURL,
  getWeb3Connection,
  getWallets,
  getBscScanTxURL,
} = require('./helpers');

const wallets = getWallets();
const web3 = getWeb3Connection();
const shouldOpenPoocoin = process.env.OPEN_POOCOIN ? process.env.OPEN_POOCOIN : true;
const shouldOpenPancake = process.env.OPEN_POOCOIN ? process.env.OPEN_POOCOIN : true;

let firstTxFound = false;

console.log(`🟢 Watching`, wallets);

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
      if (transaction && (wallets.includes(transaction.from) || wallets.includes(transaction.to))) {

        sound.play(notificationPath);

        const isPancakeV1 = isPancakeSwapV1Router(transaction.to);
        const tokenAddress = getPancakeInputToken(transaction.input);

        if (tokenAddress) {
          const poocoinURL = getPoocoinTokenURL(tokenAddress);
          const pancakeURL = getPancakeTokenURL(tokenAddress, isPancakeV1);
          const txURL = getBscScanTxURL(transaction.hash);
          const ownerAddress = wallets.includes(transaction.from) ? transaction.from : transaction.to;

          console.log(`❗️💥 New token transation in address ${ownerAddress}`);
          console.log(`🔰 Transaction: ${txURL}`);
          console.log(`🔰 Poocoin: ${poocoinURL}`);
          console.log(`🔰 PancakeSwap: ${pancakeURL}`);
          console.log(`----------------------------------------------------------------------------`);

          if (!firstTxFound) {
            firstTxFound = true;
            if (shouldOpenPoocoin) await open(poocoinURL);
            if (shouldOpenPancake) await open(pancakeURL);
          }
        }
      }
    });
  });