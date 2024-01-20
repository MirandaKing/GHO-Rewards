import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import TransferForm from "./components/TransferFrom";
import GetGHONFT from "./components/GetGHONFT";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transfer" element={<TransferForm />} />
            <Route path="/getNFT" element={<GetGHONFT />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
