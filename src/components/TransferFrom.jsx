// TransferFrom.jsx

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../styles/TransferFrom.css"; // Import the CSS file
import ghoTokenImage from "/gho.png"; // Import the GHO token image

const TransferForm = ({ contract, account }) => {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [isAmountExceedingBalance, setIsAmountExceedingBalance] =
    useState(false);

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const balance = await contract.getGHOBalance(account);
        setUserBalance(balance);
      } catch (error) {
        console.error("Error fetching user balance:", error.message);
      }
    };

    fetchUserBalance();
  }, [contract, account]);

  const handleTransfer = async () => {
    try {
      const parsedAmount = ethers.utils.parseUnits(amount, 18);

      if (parsedAmount.gt(userBalance)) {
        setIsAmountExceedingBalance(true);
        return;
      }

      const tx = await contract.transferGHOToken(toAddress, parsedAmount);
      await tx.wait();
      console.log("Transfer successful!");
      setAmount(""); // Clear the input after successful transfer
    } catch (error) {
      console.error("Error transferring tokens:", error.message);
    }
  };

  const handleMaxButtonClick = () => {
    setAmount(ethers.utils.formatUnits(userBalance, 18));
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="flex items-center mb-4">
          <img src={ghoTokenImage} alt="GHO Token" className="w-8 h-8 mr-2" />
          <h2 className="text-2xl font-semibold">Transfer GHO Tokens</h2>
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
        <button onClick={handleTransfer} className="form-button">
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
        <p className="balance-text">Current GHO Balance: {userBalance} GHO</p>
      </div>
    </div>
  );
};

export default TransferForm;
