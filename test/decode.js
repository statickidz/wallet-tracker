const InputDataDecoder = require('ethereum-input-data-decoder');
const decoder = new InputDataDecoder(`${__dirname}/../data/abi.json`);
const open = require('open');

(async () => {
  const psInput = `0x7ff36ab5000000000000000000000000000000000000000000000016d1bafc4efa4d12120000000000000000000000000000000000000000000000000000000000000080000000000000000000000000462c4b17eab238e07d04f9776470517cf7eed6f30000000000000000000000000000000000000000000000000000000060a7e8d10000000000000000000000000000000000000000000000000000000000000002000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c0000000000000000000000000a4dc3ac9426e1c85db6b618de48a2bbdd596c4e`;
  const txInput = `0xa9059cbb0000000000000000000000004695471820b70f2309f87df9936cbda08b764aab0000000000000000000000000000000000000000000000056bc75e2d63100000`;

  const result = decoder.decodeData(psInput);
  const routes = result.inputs ? result.inputs.find(route => Array.isArray(route)) : false;
  if (result && routes) {
    const tokenAddress = `0x${routes[routes.length - 1]}`;

    console.log(`Token Address: ${tokenAddress}`);

    await open(`https://poocoin.app/tokens/${tokenAddress}`);
    await open(`https://exchange.pancakeswap.finance/#/swap?outputCurrency=${tokenAddress}`);
  } else {
    console.log(`Not valid input data`);
  }
})();