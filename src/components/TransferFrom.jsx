// TransferForm.jsx

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../styles/TransferFrom.css"; // Import the CSS file
import ghoTokenImage from "/gho.png"; // Import the GHO token image
import ERC20 from "../../ABI/ERC20.json";
import GHORewardsABI from "../../ABI/GHORewards.json";
import { useAccount } from "wagmi";
import ContractAddresses from "../Helper/contractAddresses.json";

const TransferFrom = () => {
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
  }, []);

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

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      try {
        const erc20 = new ethers.Contract(
          "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60",
          ERC20.abi,
          signer
        );
        const tx = await erc20.approve(
          ContractAddresses["GHORewards"],
          parsedAmount
        );
        await tx.wait();
        console.log(`${amount} tokens Approved`);
      } catch (error) {
        console.log(error);
      }

      const GhoRewards = new ethers.Contract(
        ContractAddresses["GHORewards"],
        GHORewardsABI,
        signer
      );

      const tx = await GhoRewards.transferGHOToken(
        ContractAddresses["GHOToken"],
        toAddress,
        parsedAmount
      );
      await tx.wait();
      console.log("Transfer successful!");
      setAmount(""); // Clear the input after a successful transfer
      setIsAmountExceedingBalance(false); // Reset the error state
    } catch (error) {
      console.error("Error transferring tokens:", error.message);
    }
  };

  const fetchTransferEvents = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const GhoRewards = new ethers.Contract(
        ContractAddresses["GHORewards"],
        GHORewardsABI,
        signer
      );
      const filter = GhoRewards.filters.GHOTransferred(address, null, null);

      // Query for events with the specified filter
      const events = await GhoRewards.queryFilter(filter, 0, "latest");

      let totalAmount = 0;
      let recipient = 0;
      events.forEach((event) => {
        const amountInHex = event.args[2];
        recipient++;
        totalAmount += parseInt(ethers.utils.formatUnits(amountInHex, 18));
        console.log(parseInt(ethers.utils.formatUnits(amountInHex, 18)));
      });

      // Update the state with the total amount
      console.log("Total Amount Transferred:", totalAmount);
      console.log("Total Recipients:", recipient);

      // Update the state with the fetched events
      // console.log(events[0]["args"]["amount"]);
    } catch (error) {
      console.error("Error fetching transfer events:", error.message);
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
