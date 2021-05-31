const InputDataDecoder = require('ethereum-input-data-decoder');
const decoder = new InputDataDecoder(`${__dirname}/data/abi.json`);
const Web3 = require('web3');
const { readFileSync } = require('fs');

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
const isAddress = function (address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true;
  } else {
    // Otherwise check each case
    return isChecksumAddress(address);
  }
};

/**
* Checks if the given string is a checksummed address
*
* @method isChecksumAddress
* @param {String} address the given HEX adress
* @return {Boolean}
*/
const isChecksumAddress = function (address) {
  // Check each case
  address = address.replace('0x', '');
  const addressHash = sha3(address.toLowerCase());
  for (let i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
      return false;
    }
  }
  return true;
};

/**
* Decode PancakeSwap input token 
*
* @method getPancakeInputToken
* @param {TransactionInput}
* @return {Token}
*/
const getPancakeInputToken = function (input) {
  const result = decoder.decodeData(input);
  const routes = result.inputs ? result.inputs.find(route => Array.isArray(route)) : false;
  return routes ? `0x${routes[routes.length - 1]}` : '';
};

/**
* Get PancakeSwap token URL
*
* @method getPancakeTokenURL
* @param {String} token the given token
* @return {String}
*/
const getPancakeTokenURL = function (token, v1 = false) {
  if (process.env.NETWORK === 'testnet') {
    return `https://${v1 ? 'v1' : ''}pancake.kiemtienonline360.com/#/swap?outputCurrency=${token}`;
  }
  return `https://${v1 ? 'v1' : ''}exchange.pancakeswap.finance/#/swap?outputCurrency=${token}`;
};

/**
* Get Poocoin token URL
*
* @method getPoocoinTokenURL
* @param {String} token the given token
* @return {String}
*/
const getPoocoinTokenURL = function (token) {
  return `https://poocoin.app/tokens/${token}`;
};

/**
* Get BscScan Transaction URL
*
* @method getBscScanTxURL
* @param {String}
* @return {String}
*/
const getBscScanTxURL = function (txHash) {
  if (process.env.NETWORK === 'testnet') {
    return `https://testnet.bscscan.com/tx/${txHash}`;
  }
  return `https://bscscan.com/tx/${txHash}`;
};

/**
* Get Web3 connection
*
* @method getWeb3Connection
* @return {Web3}
*/
const getWeb3Connection = function () {
  const network = process.env.NETWORK ? process.env.NETWORK : 'mainnet';
  return new Web3(`wss://bsc.getblock.io/${network}/?api_key=00854c01-32fa-4602-b14a-7b0b2e54650e`);
};

/**
* Get wallets to watch
*
* @method getWallets
* @return {Array} address
*/
const getWallets = function () {
  return readFileSync('.wallets').toString().replace(/\r\n/g, '\n').split('\n');
};

/**
 * Checks if the given router address is PancakeSwap V1
 *
 * @method isPancakeSwapV1Token
 * @param {Transaction}
 * @return {Boolean}
*/
const isPancakeSwapV1Router = function (router) {
  return router.toLowerCase() === '0x05ff2b0db69458a0750badebc4f9e13add608c7f';
};

module.exports = {
  isAddress: isAddress,
  isPancakeSwapV1Router: isPancakeSwapV1Router,
  getPancakeInputToken: getPancakeInputToken,
  getPancakeTokenURL: getPancakeTokenURL,
  getPoocoinTokenURL: getPoocoinTokenURL,
  getWeb3Connection: getWeb3Connection,
  getWallets: getWallets,
  getBscScanTxURL: getBscScanTxURL,
}