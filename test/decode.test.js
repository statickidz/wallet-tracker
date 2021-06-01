import {
  isAddress,
  getPancakeInputToken,
} from '../helpers';

const normalTxInput = `0xa9059cbb0000000000000000000000004695471820b70f2309f87df9936cbda08b764aab0000000000000000000000000000000000000000000000056bc75e2d63100000`;
const pancakeInput = `0x7ff36ab5000000000000000000000000000000000000000000000016d1bafc4efa4d12120000000000000000000000000000000000000000000000000000000000000080000000000000000000000000462c4b17eab238e07d04f9776470517cf7eed6f30000000000000000000000000000000000000000000000000000000060a7e8d10000000000000000000000000000000000000000000000000000000000000002000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c0000000000000000000000000a4dc3ac9426e1c85db6b618de48a2bbdd596c4e`;

test('should decode pancakeswap input', () => {
  const tokenAddress = getPancakeInputToken(pancakeInput);
  expect(isAddress(tokenAddress)).toBe(true);
});

test('should not decode normal TX input', () => {
  const tokenAddress = getPancakeInputToken(normalTxInput);
  expect(isAddress(tokenAddress)).toBe(false);
});