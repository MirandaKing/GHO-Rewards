// components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import CustomConnectButton from "./CustomConnectButton";
import { Link as ScrollLink } from "react-scroll";
import { useNavigate } from "react-router-dom";

const navigation = [
  { name: "Home", to: "/", current: false },
  { name: "Transfer GHO", to: "/transfer", current: false },
  { name: "Get GHONFT", to: "/getNFT", current: false },
  // { name: "ViewNFT", to: "/transfer", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <Disclosure
      as="nav"
      id="myNavbar"
      className="bg-black fixed top-0 w-full z-50"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex items-center lg:hidden">
                <Disclosure.Button className="text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:flex lg:items-center lg:justify-start">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => navigate(item.to)}
                      className={classNames(
                        "text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer",
                        "rounded-md px-3 py-2 text-base font-medium"
                      )}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex lg:hidden absolute inset-y-0 right-0 items-center pr-2">
                <CustomConnectButton />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.to)}
                  offset={-64}
                  className={classNames(
                    "text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer",
                    "block rounded-md px-3 py-2 text-lg font-medium"
                  )}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
