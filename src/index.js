import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { EtherspotTransactionKit } from '@etherspot/transaction-kit';
import { ethers } from 'ethers';


const root = ReactDOM.createRoot(document.getElementById('root'));
const randomWallet = ethers.Wallet.createRandom();
const providerWallet = new ethers.Wallet(randomWallet.privateKey);
root.render(
  <React.StrictMode>
  <EtherspotTransactionKit
    provider={providerWallet} /* The random wallet we created above */
    chainId={80001} /* Polygon Testnet - Mumbai */
  >
    <App />
  </EtherspotTransactionKit>
</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
