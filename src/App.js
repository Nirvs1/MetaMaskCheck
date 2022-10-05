import MetaMaskOnboarding from '@metamask/onboarding';
import React from 'react';
import swap64 from "./images/swap.png";
import { ethers } from "ethers";
import tokenSwapAbi from './tokenSwapAbi.json';



const ONBOARD_TEXT = 'Click here to install MetaMask!';
const CONNECT_TEXT = 'Connect';
const CONNECTED_TEXT = 'Connected';

const SWAP_TEXT = 'SWAP';
const SWAPPED_TEXT = 'SWAPPED';

export default function App() {
    //sets initial state for buttonText
    const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
    //sets the boolean value for isDisabled
    const [isDisabled, setDisabled] = React.useState(false);
    //initializes the accounts with an empty array
    const [accounts, setAccounts] = React.useState([]);
    const onboarding = React.useRef();

    //sets initial state for swap button text
    const [swapBtnText, setSwapBtnText] = React.useState(SWAP_TEXT);
    //sets initial state for transaction status
    const [trxStatus, setTrxStatus] = React.useState(false);

    //This checks if the webpage has metamask installed or the user is currently onboarded
    React.useEffect(() => {
      //if user is not onboarded then a new instance of MetaMaskOnboarding is created
      if (!onboarding.current) {
        onboarding.current = new MetaMaskOnboarding();
      }
    }, []);
 
    React.useEffect(() => {
      //This checks if MetaMask is installed
      if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        if (accounts.length > 0) {
          //text is changed to connected
          setButtonText(CONNECTED_TEXT);
          //button is disabled
          setDisabled(true);
          //stops the onboarding process
          onboarding.current.stopOnboarding();
        } else {
          //Connect text is shown
          setButtonText(CONNECT_TEXT);
          //Button is enabled
          setDisabled(false);
        }
      }
    }, [accounts]);

    React.useEffect(() => {
      function handleNewAccounts(newAccounts) {
        setAccounts(newAccounts);
      }
      if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(handleNewAccounts);
        window.ethereum.on('accountsChanged', handleNewAccounts);
        return () => {
          window.ethereum.removeListener('accountsChanged', handleNewAccounts);
        };
      }
    }, []);

    const onClick = () => {
      //once button is clicked, the browser is checked to see if MetaMask is installed
      if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        window.ethereum
        //the accounts are requested
          .request({ method: 'eth_requestAccounts' })
          //the accounts retrieved are the set to newAccounts
          .then((newAccounts) => setAccounts(newAccounts));
      } else {
        //if MetaMask is not installed, then onboarding is initialized
        onboarding.current.startOnboarding();
      }
    };
    

    const onSwap = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const tokenSwap = new ethers.Contract(process.env.TOKENSWAPADDR,
        tokenSwapAbi,
        provider);
      await tokenSwap.name();
    }
  
  
 return(
    <form>
      <div className="text-white">
        <div className="text-white text-center text-4xl m-5 font-semibold w-full">
          Nirvan's token Swap DApp
          <div className="w-60 mx-auto mt-10">
            <button className="bg-blue-500 text-xl font-bold text-white px-5 py-1 my-1 rounded-md" onClick={onClick}>
              {buttonText}
            </button>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-20 bg-gray-200 rounded-2xl">
            <div className="h-96">
              <div className="p-5">
                <div className="text-center text-slate-800 font-medium text-xl">
                  Swap Tokens
                </div>
                <div className=" mt-5 w-full flex">
                  <div className="mx-auto">
                  <input
                  type="text"
                  name="token1"
                  className="text-slate-800 input ml-10 mr-8 border-1 border-slate-50 text-base w-96 p-2 rounded-md my-3 "
                  placeholder="Enter token address"
                  />
                  </div>
                  <div className="mx-auto">
                  <input
                  type="text"
                  name="token1"
                  className="text-slate-800 input mr-10 border-1 border-slate-50 text-base w-32 p-2 rounded-md my-3 "
                  placeholder="Enter Amount"
                  />
                  </div>
                </div>
                
                <div>
                  <img src={swap64} alt="Swap" className="mx-auto my-6"/>
                </div>

                <div className="w-full flex">
                  <div className="mx-auto">
                  <input
                  type="text"
                  name="token1"
                  className="text-slate-800 input ml-10 mr-8 border-1 border-slate-50 text-base w-96 p-2 rounded-md my-3 "
                  placeholder="Enter token address"
                  />
                  </div>
                  <div className="mx-auto">
                  <input
                  type="text"
                  name="token1"
                  className="text-slate-800 input mr-10 border-1 border-slate-50 text-base w-32 p-2 rounded-md my-3 "
                  placeholder="Enter Amount"
                  />
                  </div>
                </div>
                <div className="max-w-xl mx-auto">
                    <div className="w-60 mx-auto">
                      <button className="bg-blue-500 text-2xl font-bold text-white ml-10 px-10 py-2 my-2 rounded-md"  disabled={isDisabled} onClick={onSwap}>
                          {swapBtnText}
                      </button>
                    </div>
                </div>
              </div>
              <div className="text-xs text-white text-center py-32">
                <p>
                  This DApp was created to check if your browser has MetaMAsk installed.
                </p>
                <p>
                  In the instance you don't, you will be redirected to download the MetaMask extension.
                </p>
              </div>
            </div>
        </div>
      </div>
    </form>
  );
}