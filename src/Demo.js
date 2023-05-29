import "@rainbow-me/rainbowkit/styles.css";
import { ethers } from "ethers";
import { useSigner, useProvider, useAccount } from "wagmi";
import { useState, useEffect } from "react";
import "./App.css";
const NFT_ABI = require("./constants/NFTAbi.json");

const Demo = () => {
  const { isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const [consoleMsg, setConsoleMsg] = useState(null);
  const [consoleLoading, setConsoleLoading] = useState(false);
  const [output, setOutput] = useState("");

  const appendConsoleLine = (message) => {
    return setConsoleMsg((prevState) => {
      return `${prevState}\n\n${message}`;
    });
  };

  const resetConsole = () => {
    setConsoleMsg(null);
    setConsoleLoading(true);
  };

  const addNewConsoleLine = (message) => {
    setConsoleMsg(() => {
      return message;
    });
  };

  const consoleWelcomeMessage = () => {
    setConsoleLoading(false);
    setConsoleMsg("Status: Wallet not connected. Please connect wallet to use Methods");
  };

  const consoleErrorMesssage = () => {
    setConsoleLoading(false);
    setConsoleMsg("An error occurred");
  };

  useEffect(() => {
    if (isConnected) {
      setConsoleMsg("Wallet connected!");
    } else {
      consoleWelcomeMessage();
    }
  }, [isConnected]);

  const getChainID = async () => {
    try {
      resetConsole();
      //@ts-ignore
      const chainId = await signer.getChainId();
      console.log("signer.getChainId()", chainId);
      addNewConsoleLine(`signer.getChainId(): ${chainId}`);
      setConsoleLoading(false);
      setOutput(JSON.stringify(chainId.toString()));
    } catch (e) {
      console.error(e);
      consoleErrorMesssage();
    }
  };

  const getBalance = async () => {
    try {
      resetConsole();
      //@ts-ignore
      const account = await signer.getAddress();

      console.log(" This is account ", account);
      const balanceChk1 = await provider.getBalance(account);
      console.log("balance check 1", balanceChk1.toString());
      addNewConsoleLine(`balance check 1: ${balanceChk1.toString()}`);

      setOutput(JSON.stringify(balanceChk1));

      //@ts-ignore
      const balanceChk2 = await signer.getBalance();
      console.log("balance check 2", balanceChk2.toString());
      appendConsoleLine(`balance check 2: ${balanceChk2.toString()}`);
      setConsoleLoading(false);
    } catch (e) {
      console.error(e);
      consoleErrorMesssage();
    }
  };

  const getNetworks = async () => {
    try {
      resetConsole();
      const network = await provider.getNetwork();
      console.log("networks:", network);
      setOutput(JSON.stringify(network));
      addNewConsoleLine(`networks: ${JSON.stringify(network)}`);
      setConsoleLoading(false);
    } catch (e) {
      console.error(e);
      consoleErrorMesssage();
    }
  };

  const signMessage = async () => {
    try {
      resetConsole();
      const message = `Two roads diverged in a yellow wood,
    Robert Frost poet
    
    And sorry I could not travel both
    And be one traveler, long I stood
    And looked down one as far as I could
    To where it bent in the undergrowth;
    
    Then took the other, as just as fair,
    And having perhaps the better claim,
    Because it was grassy and wanted wear;
    Though as for that the passing there
    Had worn them really about the same,
    
    And both that morning equally lay
    In leaves no step had trodden black.
    Oh, I kept the first for another day!
    Yet knowing how way leads on to way,
    I doubted if I should ever come back.
    
    I shall be telling this with a sigh
    Somewhere ages and ages hence:
    Two roads diverged in a wood, and I—
    I took the one less traveled by,
    And that has made all the difference.`;

      // sign
      console.log(" This is signer ", signer);
      //@ts-ignore
      const sig = await signer.signBananaMessage(message);
      console.log("signature:", sig);
      setOutput(JSON.stringify(sig));

      addNewConsoleLine(`signature: ${sig}`);

      // const isValid = await sequence.utils.isValidMessageSignature(await signer.getAddress(), message, sig, provider as ethers.providers.Web3Provider)
      // console.log('isValid?', isValid)

      // appendConsoleLine(`isValid? ${isValid}`)
      setConsoleLoading(false);
    } catch (e) {
      console.error(e);
      consoleErrorMesssage();
    }
  };

  const sendETH = async () => {
    try {
      resetConsole();

      //@ts-ignore
      console.log(`Transfer txn on ${signer.getChainId()}`);
      //@ts-ignore
      addNewConsoleLine(`Transfer txn on ${signer.getChainId()}`);

      const toAddress = ethers.Wallet.createRandom().address;

      const tx1 = {
        gasLimit: "0x55555",
        to: toAddress,
        value: ethers.utils.parseEther("0.000001"),
        data: "0x",
      };

      const balance1 = await provider.getBalance(toAddress);
      console.log(`balance of ${toAddress}, before:`, balance1);
      appendConsoleLine(`balance of ${toAddress}, before: ${balance1}`);
      //@ts-ignore
      const txnResp = await signer.sendTransaction(tx1);
      // await txnResp.wait()
      setOutput(JSON.stringify(txnResp));

      const balance2 = await provider.getBalance(toAddress);
      console.log(`balance of ${toAddress}, after:`, balance2);
      appendConsoleLine(`balance of ${toAddress}, after: ${balance2}`);
      setConsoleLoading(false);
    } catch (e) {
      console.error(e);
      consoleErrorMesssage();
    }
  };

  const sendDAI = async () => {
    try {
      resetConsole();
      const toAddress = ethers.Wallet.createRandom().address;

      const amount = ethers.utils.parseUnits("5", 18);

      const daiContractAddress = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"; // (DAI address on Polygon)

      const tx = {
        gasLimit: "0x55555",
        to: daiContractAddress,
        value: 0,
        data: new ethers.utils.Interface(NFT_ABI).encodeFunctionData("transfer", [toAddress, amount.toHexString()]),
      };

      //@ts-ignore
      const txnResp = await signer.sendTransaction(tx);
      await txnResp.wait();

      console.log("transaction response", txnResp);
      addNewConsoleLine(`TX response ${JSON.stringify(txnResp)}`);
      setConsoleLoading(false);
    } catch (e) {
      console.error(e);
      consoleErrorMesssage();
    }
  };

  const getWalletActions = () => {
    if (!isConnected) {
      return null;
    }
    return (
      <>
        <button className="action-btn" onClick={() => getChainID()}>
          ChainID
        </button>
        <button className="action-btn" onClick={() => getNetworks()}>
          Networks
        </button>
        <button className="action-btn" onClick={() => getBalance()}>
          Get Balance
        </button>
        <button className="action-btn" onClick={() => signMessage()}>
          Sign Message
        </button>
        <button className="action-btn" onClick={() => sendETH()}>
          Send ETH
        </button>
      </>
    );
  };

  return (
    <div className="connect-div">
      <h1> Banana Rainbow Kit Plugin Example </h1>
      {getWalletActions()}
      <h1> Output </h1>
      <div className="output-div">
        <p>{output}</p>
      </div>
    </div>
  );
};

export default Demo;
