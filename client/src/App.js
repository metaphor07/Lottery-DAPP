import React, { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import Lottery from "./contracts/Lottery.json";
import Manager from "./components/Manager";
import "./App.css";
import Players from "./components/Players";

const App = () => {
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });
  const [address, setAddress] = useState("No contract available");

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        // console.log("line-16 : ", web3);
        const networkId = await web3.eth.net.getId();
        // console.log("network Id : ",networkId)

        // console.log("Lottery Network json is: ",Lottery.networks);
        // console.log("Lottery Network json is: ",Lottery.networks);
        const deployedNetwork = Lottery.networks[networkId];
        // const deployedNetwork = Lottery.networks[5];
        console.log("Contract Address:", deployedNetwork.address);
        const instance = new web3.eth.Contract(
          Lottery.abi,
          deployedNetwork && deployedNetwork.address
        );
        setAddress(deployedNetwork.address)
        setState({ web3, contract: instance });
      } catch (error) {
        alert("Falied to load web3 or contract.");
        console.log(error);
      }
    };
    init();
  }, []);

  return (
    <div className="App">
      <h1>Manager Accessable Page......</h1>
      <hr />
      <Manager state={state}/>
      <br />
      <hr />
      <div style={{backgroundColor:'red'}}> <hr /> </div>
      <hr />
      <br />
      <h1>Participents Accessable page....</h1><hr />
      <Players state={state} address={address}/>
    </div>
  );
};
export default App;
