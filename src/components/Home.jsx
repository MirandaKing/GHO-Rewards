// src/Home.jsx
import React from "react";

const Home = () => {
  return (
    <div className="pt-16">
      {" "}
      {/* Add padding equal to the Navbar height */}
      <h2>Welcome to GHO Token Transfer App</h2>
      <p>
        This is a decentralized application (DApp) that allows you to transfer
        GHO tokens seamlessly on the Ethereum blockchain.
      </p>
      <p>
        Explore the app by navigating to the "Transfer" page and use the
        Transfer Form to send GHO tokens to other addresses.
      </p>
      <p>
        Please make sure you have a compatible Ethereum wallet (like MetaMask)
        installed and connected to this DApp.
      </p>
    </div>
  );
};

export default Home;
