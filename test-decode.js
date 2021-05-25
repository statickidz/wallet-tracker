const InputDataDecoder = require('ethereum-input-data-decoder');
const decoder = new InputDataDecoder(`${__dirname}/abi.json`);
const open = require('open');

(async () => {
  const psInput = `0x8803dbee0000000000000000000000000000000000000000000000008d159909bf2e4a0000000000000000000000000000000000000000000000005a42575534b75d76e900000000000000000000000000000000000000000000000000000000000000a00000000000000000000000006660e0aac73c495d49ded3934132c405c4615e010000000000000000000000000000000000000000000000000000000060ab4ecc000000000000000000000000000000000000000000000000000000000000000300000000000000000000000055d398326f99059ff775485246999027b3197955000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c0000000000000000000000005e90253fbae4dab78aa351f4e6fed08a64ab5590`;
  const txInput = `0xa9059cbb0000000000000000000000004695471820b70f2309f87df9936cbda08b764aab0000000000000000000000000000000000000000000000056bc75e2d63100000`;

  const result = decoder.decodeData(psInput);
  if (result && result.inputs && result.inputs[2]) {
    const routes = result.inputs[2];
    const tokenAddress = `0x${routes[routes.length - 1]}`;

    console.log(`Token Address: ${tokenAddress}`);

    await open(`https://poocoin.app/tokens/${tokenAddress}`);
    await open(`https://exchange.pancakeswap.finance/#/swap?outputCurrency=${tokenAddress}`);
  } else {
    console.log(`Not valid input data`);
  }
})();