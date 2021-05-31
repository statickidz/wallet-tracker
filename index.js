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
const shouldOpenPoocoin = /^true$/i.test(process.env.OPEN_POOCOIN.toLowerCase());
const shouldOpenPancake = /^true$/i.test(process.env.OPEN_PANCAKE.toLowerCase());
const shouldPlaySound = /^true$/i.test(process.env.PLAY_SOUND.toLowerCase());

let firstTxFound = false;

console.log(`🟢 Watching`, wallets);

console.log(shouldOpenPancake, shouldOpenPoocoin, shouldPlaySound, process.env.PLAY_SOUND);

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

        const isPancakeV1 = isPancakeSwapV1Router(transaction.to);
        const tokenAddress = getPancakeInputToken(transaction.input);

        if (shouldPlaySound) sound.play(notificationPath);

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