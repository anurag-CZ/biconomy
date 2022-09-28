import { useEffect, useState } from "react";
import Greeter from "./Greeter.json";
import { Biconomy } from "@biconomy/mexa";
import { ethers } from "ethers";
import "./App.css";

const App = () => {
  const [greetingValue, setGreetingValue] = useState("");
  const [greetingMsg,setGreetingMsg] = useState("")

  const greeterAddress = "0x294d4a9a4aa397f2e51fe39b74a6ce142e626b34";

  const requestAccounts = async () => {
    return await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
        setGreetingMsg(data)
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  };

  const setGreeting = async () => {
    console.log(process.env.REACT_APP_BICONOMY_API);
    if (!greetingValue) return;
    if (typeof window.ethereum !== "undefined") {
      const accounts = await requestAccounts();
      const biconomy = new Biconomy(window.ethereum, {
        apiKey: process.env.REACT_APP_BICONOMY_API,
        debug: true,
        contractAddresses: [greeterAddress],
      });
      const provider = await biconomy.provider;

      const contractInstance = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        biconomy.ethersProvider
      );
      await biconomy.init();

      const { data } = await contractInstance.populateTransaction.setGreeting(
        greetingValue
      );

      let txParams = {
        data: data,
        to: greeterAddress,
        from: accounts[0],
        signatureType: "EIP712_SIGN",
      };

      await provider.send("eth_sendTransaction", [txParams]);
    }
  };

  return (
    <div className="App">
      <h3>Biconomy Gassless Transaction</h3>
      <div className="setGreeter">
        <input
          placeholder="EnterMessage"
          value ={greetingValue}
          onChange={(e) => setGreetingValue(e.target.value)}
        />
        <button onClick={setGreeting}>Set Greeting</button>
      </div>
      <div className="getGreeter">
        <button onClick={fetchGreeting}>Get Greeting</button>
        <label>Greeting Message: {greetingMsg}</label>
      </div>
    </div>
  );
};

export default App;
