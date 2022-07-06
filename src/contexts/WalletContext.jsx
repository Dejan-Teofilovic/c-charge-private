import React, { createContext, useContext, useReducer } from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import {
  CHAIN_ID,
  CODE_SWITCH_ERROR,
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  ERROR,
  MESSAGE_SWITCH_NETWORK,
  MESSAGE_WALLET_CONNECT_ERROR,
  WALLET_CONNECT_INFURA_ID,
} from '../utils/constants';
import { AlertMessageContext } from './AlertMessageContext';
import { LoadingContext } from './LoadingContext';

// ----------------------------------------------------------------------

const initialState = {
  currentAccount: '',
  balance: 0,
  provider: null,
  signer: null,
  contract: null
};

const handlers = {
  SET_CURRENT_ACCOUNT: (state, action) => {
    return {
      ...state,
      currentAccount: action.payload
    };
  },
  SET_PROVIDER: (state, action) => {
    return {
      ...state,
      provider: action.payload
    };
  },
  SET_CONTRACT: (state, action) => {
    return {
      ...state,
      contract: action.payload
    };
  }
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

//  Context
const WalletContext = createContext({
  ...initialState,
  connectWallet: () => Promise.resolve(),
  disconnectWallet: () => Promise.resolve(),
  getBalanceOfRewardPool: () => Promise.resolve(),
  getProviderAndContract: () => Promise.resolve()
});

//  Provider
function WalletProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { openAlert } = useContext(AlertMessageContext);
  const { openLoading, closeLoading } = useContext(LoadingContext);

  const getWeb3Modal = async () => {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: WALLET_CONNECT_INFURA_ID
          },
        },
      }
    });
    return web3Modal;
  };

  /** Connect wallet */
  const connectWallet = async () => {
    try {
      openLoading();
      let accounts = null;
      const { chainId } = await state.provider.getNetwork();

      /* --------------- Switch network --------------- */
      if (chainId === CHAIN_ID) {
        accounts = await state.provider.listAccounts();

        dispatch({
          type: 'SET_CURRENT_ACCOUNT',
          payload: accounts[0]
        });

        await closeLoading();
      } else {
        if (window.ethereum) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
            });

            accounts = await state.provider.listAccounts();

            dispatch({
              type: 'SET_CURRENT_ACCOUNT',
              payload: accounts[0]
            });

            closeLoading();

          } catch (error) {
            if (error.code === CODE_SWITCH_ERROR) {
              /* ------------ Add new chain ------------- */
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: `0x${CHAIN_ID.toString(16)}`,
                    chainName: CHAIN_NAME,
                    rpcUrls: RPC_URLS,
                    blockExplorerUrls: BLOCK_EXPLORER_URLS,
                    nativeCurrency: {
                      name: NATIVE_CURRENCY_NAME,
                      symbol: NATIVE_CURRENCY_SYMBOL, // 2-6 characters length
                      decimals: DECIMALS,
                    }
                  },
                ],
              });

              accounts = await state.provider.listAccounts();

              dispatch({
                type: 'SET_CURRENT_ACCOUNT',
                payload: accounts[0]
              });

              closeLoading();
              /* ---------------------------------------- */
            } else {
              throw error;
              closeLoading();
            }
          }
        } else {
          openAlert({
            severity: ERROR,
            message: MESSAGE_SWITCH_NETWORK
          });
          closeLoading();
        }
      }
      /* ---------------------------------------------- */
    } catch (error) {
      console.log('# wallet connect error', error);

      dispatch({
        type: 'SET_CURRENT_ACCOUNT',
        payload: ''
      });

      dispatch({
        type: 'SET_PROVIDER',
        payload: null
      });

      dispatch({
        type: 'SET_CONTRACT',
        payload: null
      });

      openAlert({
        severity: ERROR,
        message: MESSAGE_WALLET_CONNECT_ERROR
      });

      closeLoading();
    }
  };

  /** Disconnect wallet */
  const disconnectWallet = async () => {
    dispatch({
      type: 'SET_CURRENT_ACCOUNT',
      payload: ''
    });

    dispatch({
      type: 'SET_PROVIDER',
      payload: null
    });

    dispatch({
      type: 'SET_CONTRACT',
      payload: null
    });
  };

  const getProviderAndContract = async () => {
    const web3Modal = await getWeb3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    dispatch({
      type: 'SET_PROVIDER',
      payload: provider
    });

    dispatch({
      type: 'SET_CONTRACT',
      payload: contract
    });
  };

  const getBalanceOfRewardPool = async () => {
    const { result } = await (await fetch(`https://api.bscscan.com/api?module=account&action=balance&address=${ADDRESS_OF_REWARD_POOL}&tag=latest&apikey=${SCAN_API_KEY}`)).json();

    let balance = Number(result) * 10 ** -18;
    dispatch({
      type: 'SET_BALANCE_OF_REWARD_POOL',
      payload: Number(balance.toFixed(2))
    });
  };
  return (
    <WalletContext.Provider
      value={{
        ...state,
        connectWallet,
        disconnectWallet,
        getBalanceOfRewardPool,
        getProviderAndContract
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export { WalletContext, WalletProvider };