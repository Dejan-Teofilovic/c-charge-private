import React, { createContext, useContext, useReducer } from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import {
  CHAIN_ID,
  CODE_SWITCH_ERROR,
  ERROR,
  MESSAGE_SWITCH_NETWORK,
  MESSAGE_WALLET_CONNECT_ERROR,
  WALLET_CONNECT_INFURA_ID,
} from '../utils/constants';
import { AlertMessageContext } from './AlertMessageContext';

// ----------------------------------------------------------------------

const initialState = {
  currentAccount: '',
  balance: 0,
  provider: null,
};

const handlers = {
  SET_CURRENT_ACCOUNT: (state, action) => {
    return {
      ...state,
      currentAccount: action.payload
    };
  },
  SET_BALANCE: (state, action) => {
    return {
      ...state,
      balance: action.payload
    };
  },
  SET_PROVIDER: (state, action) => {
    return {
      ...state,
      provider: action.payload
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
  setBalance: () => Promise.resolve(),
  getBalanceOfRewardPool: () => Promise.resolve()
});

//  Provider
function WalletProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { openAlert } = useContext(AlertMessageContext);

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
      const web3Modal = await getWeb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      let accounts = null;
      console.log('# provider => ', provider);

      const { chainId } = await provider.getNetwork();
      console.log('# chainId => ', chainId);

      /* --------------- Switch network --------------- */
      if (chainId === CHAIN_ID) {
        accounts = await provider.listAccounts();

        dispatch({
          type: 'SET_CURRENT_ACCOUNT',
          payload: accounts[0]
        });

        dispatch({
          type: 'SET_PROVIDER',
          payload: provider
        });
      } else {
        if (window.ethereum) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
            });

            accounts = await provider.listAccounts();

            dispatch({
              type: 'SET_CURRENT_ACCOUNT',
              payload: accounts[0]
            });

            dispatch({
              type: 'SET_PROVIDER',
              payload: provider
            });
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

              accounts = await provider.listAccounts();

              dispatch({
                type: 'SET_CURRENT_ACCOUNT',
                payload: accounts[0]
              });

              dispatch({
                type: 'SET_PROVIDER',
                payload: provider
              });
              /* ---------------------------------------- */
            } else {
              throw error;
            }
          }
        } else {
          openAlert({
            severity: ERROR,
            message: MESSAGE_SWITCH_NETWORK
          });
        }
      }
      /* ---------------------------------------------- */
    } catch (error) {
      console.log('# wallet connect error', error);
      openAlert({
        severity: ERROR,
        message: MESSAGE_WALLET_CONNECT_ERROR
      });
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
      type: 'SET_BALANCE',
      payload: 0
    });
  };

  /**
   * Set balance
   * @param {number} balance The current balance of connected wallet
   */
  const setBalance = (balance) => {
    dispatch({
      type: 'SET_BALANCE',
      payload: balance
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
        setBalance,
        getBalanceOfRewardPool
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export { WalletContext, WalletProvider };