import { ethers } from 'ethers';
import { ContractRequest } from './types';
import { MixinAssetID } from '../constant';
import { MVMMainnet } from './constant';
import { base64RawURLEncode } from '../client/utils/base64';
import Encoder from './encoder';

// const OperationPurposeUnknown = 0
const OperationPurposeGroupEvent = 1;
// const OperationPurposeAddProcess = 11
// const OperationPurposeCreditProcess = 12

// TODO: writeBytes twice why?
export const encodeMemo = (extra: string, process: string): string => {
  const pureExtra = extra.slice(0, 2) === '0x' ? extra.slice(2) : extra;

  const enc = new Encoder(Buffer.from([]));
  enc.writeInt(OperationPurposeGroupEvent);
  enc.writeUUID(process);
  enc.writeBytes(Buffer.from([]));
  enc.writeBytes(Buffer.from([]));
  enc.writeBytes(Buffer.from(pureExtra, 'hex'));
  return base64RawURLEncode(enc.buf);
};

export const getMethodIdByAbi = (func: string, params: string[]): string => {
  const paramStr = params.map(i => i.trim()).join(',');
  return ethers.utils.id(`${func}(${paramStr})`).slice(2, 10);
};

/**
 * Get extra for one contract, consists of
 * 1 contract address without '0x'
 * 2 contract input length
 * 3 contract input:
 *     top 8 characters(without '0x') of KECCAK256 hash for contract function name and function parameter types
 *       e.g., addLiquidity(address,uint256) with
 *     abi code(without '0x') of contract function arguments, if arguments exist
 */
const getSingleExtra = ({ address, method, types = [], values = [] }: ContractRequest) => {
  if (types.length !== values.length) return '';

  const addr = address.toLocaleLowerCase();
  const contractAddress = `${addr.slice(0, 2) === '0x' ? addr.slice(2) : addr}`;

  const methodId = getMethodIdByAbi(method, types);
  let contractInput = `${methodId}`;
  if (values.length > 0) {
    const abiCoder = new ethers.utils.AbiCoder();
    contractInput += abiCoder.encode(types, values).slice(2);
  }

  const inputByteLength = Buffer.from(contractInput, 'hex').byteLength;
  const inputLengthBuffer = inputByteLength > 256 ? [Math.floor(inputByteLength / 256), inputByteLength % 256] : [0, inputByteLength];
  const inputLength = Buffer.from(inputLengthBuffer).toString('hex');

  return `${contractAddress}${inputLength}${contractInput}`;
};

/**  Get extra for multiple contracts calling, started with number of contracts to be called */
export const getExtra = (contracts: ContractRequest[]) => {
  if (contracts.length === 0) return '';
  let extra = Buffer.from([0, contracts.length]).toString('hex');

  for (let i = 0; i < contracts.length; i++) {
    const singleExtra = Buffer.from(getSingleExtra(contracts[i]));
    extra += singleExtra;
  }

  return `0x${extra}`;
};

/** Get extra when extra > 200 and save its hash to Storage Contract */
export const getExtraWithStorageKey = (key: string, process: string = MVMMainnet.Registry.PID, storage: string = MVMMainnet.Storage.Contract) =>
  `${process.replaceAll('-', '')}${storage.slice(2)}${key.slice(2)}`;

export const parseValueForBridge = (assetId: string, amount: string) => {
  if (assetId === MixinAssetID) {
    return ethers.utils.parseEther(Number(amount).toFixed(8));
  }
  return Math.round(ethers.utils.parseUnits(amount, 8).toNumber());
};
