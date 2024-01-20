// TransferForm.jsx

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../styles/TransferFrom.css"; // Import the CSS file
import ghoTokenImage from "/gho.png"; // Import the GHO token image
import ERC20 from "../../ABI/ERC20.json";
import { useAccount } from "wagmi";

const TransferFrom = ({ contract, account }) => {
  const { address } = useAccount();

  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [addMax, setMax] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [isAmountExceedingBalance, setIsAmountExceedingBalance] =
    useState(false);

  const [GHOBalance, setGHOBalance] = useState();

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        try {
          const erc20 = new ethers.Contract(
            "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60",
            ERC20.abi,
            signer
          );

          const balance = await erc20.balanceOf(address);
          const decimals = await erc20.decimals();
          const totalGhobalance = ethers.utils.formatUnits(balance, decimals);
          setGHOBalance(totalGhobalance);
        } catch (error) {
          console.log("Loading token error", error);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserBalance();
  }, [contract, account]);

  useEffect(() => {
    if (amount !== "") {
      const parsedAmount = ethers.utils.parseUnits(amount);
      const totalGhobalance = ethers.utils.parseUnits(GHOBalance);

      // Check if parsedAmount is greater than GHOBalance
      if (parsedAmount.gt(totalGhobalance)) {
        setIsAmountExceedingBalance(true);
        return;
      }
      setIsAmountExceedingBalance(false);
    }
  }, [amount]);

  const handleTransfer = async () => {
    console.log(amount);
    if (!toAddress || !amount) {
      console.error("Please fill in all required fields.");
      return;
    }
    try {
      const parsedAmount = ethers.utils.parseUnits(amount);
      console.log(parsedAmount);

      const tx = await contract.transferGHOToken(toAddress, parsedAmount);
      await tx.wait();
      console.log("Transfer successful!");
      setAmount(""); // Clear the input after a successful transfer
      setIsAmountExceedingBalance(false); // Reset the error state
    } catch (error) {
      console.error("Error transferring tokens:", error.message);
    }
  };

  const handleMaxButtonClick = () => {
    setAmount(GHOBalance);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="header-container">
          <img src={ghoTokenImage} alt="GHO Token" className="token-image" />
          <h2 className="title">Transfer GHO Tokens</h2>
        </div>
        <label className="form-label">To Address:</label>
        <input
          type="text"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          className="form-input"
        />
        <label className="form-label">Amount:</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={
            isAmountExceedingBalance ? "form-input error" : "form-input"
          }
        />
        <button
          onClick={handleTransfer}
          className="form-button"
          disabled={isAmountExceedingBalance}
        >
          Transfer
        </button>
        <button
          onClick={handleMaxButtonClick}
          className="form-button max-button"
        >
          Max
        </button>
        {isAmountExceedingBalance && (
          <p className="error-message">Amount exceeds available balance</p>
        )}
        <p className="balance-text">Current GHO Balance: {GHOBalance} GHO</p>
      </div>
    </div>
  );
};

export default TransferFrom;
