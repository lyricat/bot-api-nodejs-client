import { ethers } from 'ethers';
import axios, { AxiosResponse } from 'axios';
import { MVMMainnet } from '../constant';
import ResponseError from '../../client/error';
import { GenerateExtraRequest, RegisteredUser, RegisterRequest } from '../types/bridge';

export const BridgeApi = (uri: string = 'https://bridge.mvm.dev') => {
  const instance = axios.create({ baseURL: uri });
  instance.interceptors.response.use(async (res: AxiosResponse) => {
    const { error } = res.data;
    if (error) throw new ResponseError(error.code, error.description, error.status, error.extra, res.headers['X-Request-Id'], error);
    return res.data;
  });
  return {
    /**
     * signature: signature of the user.
     * example: wallet.signMessage(keccak256(toUtf8Bytes(`MVM:Bridge:Proxy:${server_public_key_base64}:${address}`))).slice(2)
     */
    register: async (params: RegisterRequest) => (await instance.post<undefined, { user: RegisteredUser }>('/users', params)).user,
    generateExtra: async (params: GenerateExtraRequest) => {
      const action = JSON.stringify(params);
      const value = Buffer.from(action).toString('hex');
      const hash = ethers.utils.keccak256(`0x${value}`).slice(2);
      return `0x${MVMMainnet.Registry.PID.replaceAll('-', '')}${MVMMainnet.Storage.Contract.toLocaleLowerCase().slice(2)}${hash}${value}`;
    },
  };
};

export default BridgeApi;
