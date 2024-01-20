// TransferForm.jsx

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../styles/GetGHONFT.css"; // Import the CSS file
import ERC20 from "../../ABI/ERC20.json";
import GHORewardsABI from "../../ABI/GHORewards.json";
import { useAccount } from "wagmi";
import ContractAddresses from "../Helper/contractAddresses.json";
import ghoTokenImage from "/gho.png"; // Import the GHO token image

const GetGHONFT = () => {
  const [totalAmountTransferred, setTotalAmountTransferred] = useState(0);
  const [totalRecipients, setTotalRecipients] = useState(0);
  const { address } = useAccount();

  useEffect(() => {
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
        console.log(events);
        let totalAmount = 0;
        let recipientCount = 0;

        events.forEach((event) => {
          const amountInHex = event.args[2];
          recipientCount++;
          totalAmount += parseInt(ethers.utils.formatUnits(amountInHex, 18));
        });
        console.log(totalAmount);
        // Update state with the total amount and recipient count
        setTotalAmountTransferred(totalAmount);
        setTotalRecipients(recipientCount);
      } catch (error) {
        console.error("Error fetching transfer events:", error.message);
      }
    };

    fetchTransferEvents();
  }, []);

  return (
    <>
      <div className="certificate-container">
        <div className="certificate-header">
          <img src={ghoTokenImage} alt="GHO Token" className="token-image" />

          <h2 className="certificate-title">GHO Certificate</h2>

          <p>Total Amount Transferred: {totalAmountTransferred} GHO</p>
          <p>Total Recipients: {totalRecipients}</p>
        </div>

        <div className="certificate-content">
          <p>
            This certificate is issued by GHO Rewards to acknowledge your
            significant contributions to the community. Your dedication and
            support have played a crucial role in the success of our project.
          </p>
          <p>
            In recognition of your commitment, GHO Rewards presents you with
            this NFT as a symbol of appreciation.
          </p>
        </div>

        <p className="issued-by-line">Issued by GHO Rewards</p>

        {/* Select chain dropdown */}
        <select className="select-chain">
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
          {/* Add more chain options as needed */}
        </select>

        {/* Mint NFT button */}
        <div className="mint-nft-button-container">
          <button className="mint-nft-button">Mint NFT</button>
        </div>
      </div>
    </>
  );
};

export default GetGHONFT;
