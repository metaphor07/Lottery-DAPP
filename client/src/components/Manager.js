import React, { useEffect, useState } from "react";
import "./manager.css";

const Manager = ({ state }) => {
  const [account, setAccount] = useState("");
  const [contractBal, setContractBal] = useState(0);
  const [lwinner, setLwinner] = useState("No winner Yet");

// this is used to solve the update problem, means, when we change "account" or something we need to "refresh" the page all time
// so, we use this functonality. And it is probided by the "metamask wallet"
const setAccountListener = (provider) =>{
  provider.on("accountsChanged", (accounts)=>{
    setAccount(accounts[0])
  })
}

  useEffect(() => {
    // we are assign "manager" address by the bellow func
    const getAccount = async () => {
      try {
        const { web3 } = state;
        const managerAccount = await web3.eth.getAccounts();
        //this will return the accounts

        setAccountListener(web3.givenProvider);

        setAccount(managerAccount[0]);
        // console.log("all accounts are: ", managerAccount[0]);
      } catch (err) {
        console.log("Error is: ", err);
      }
    };
    // the bellow means, if "state.web3" is available, only then run the "getAccount()"
    state.web3 && getAccount();
  }, [state, state.web3]);



  const contractBalance = async () => {
    const { contract } = state; //it is dis-structure form the prop

    try {
     
      // and, here, we are calling the "methods{function name getBalance}" of the created smart contract
      // anc, "call({from: account})" -> here, "account" holds the "manager" address
      const balance = await contract.methods
        .getBalance()
        .call({ from: account }); //and the accout is the "useState" account

      setContractBal(balance); // now the "balance" is stored the contract balance, we are store it in a hook
    } catch (error) {
      if(error.message.includes("You are not the manager")){
        setContractBal("You are not the manager");
      } else{
        console.log("Get Balance error is: ", error)
        setContractBal("Error");
      }
    }
  };



  const pickWinner = async () => {
    const { contract } = state;

    try {
      // "contract.methods.getWinner()" -> is used to call the "contract" function
      // and this function is only can called by the "manager" that's why
      /* ** when ever we are change the state of the contract we need to use "send" **
       ** in this case we are change the state variable (winner) of our smart contract **
       ** means we are assign value by the running this bellow function ** */
      await contract.methods.getWinner().send({ from: account }); //it's not return any thing

      const lotteryWinner = await contract.methods.winner().call(); //after the above func call the "global variable" name "winner" has store the "winner" address, so, we are calling it
      setLwinner(lotteryWinner);
    } catch (error) {
      // this "error" is send by the contract, in this case we have to "require" statement in our "contract"
      if (error.message.includes("Only manager can access this function")) {
        setLwinner("Only manager can access this function");
      } else if (
        error.message.includes("Minimum 3 Participents is required to process")
      ) {
        setLwinner("Minimum 3 Participents is required to process");
      } else {
        console.log(error)
        setLwinner("No winner yet..");
      }
    }
  };

  return (
    <>
      <h1>Account is: {account}</h1>
      <br />
      <hr />
      <div>
        <h3>Winner is: {lwinner}</h3>
      <button onClick={()=>pickWinner()}>Pick Winner</button>
      </div>
      <br />
      <br />
      <div>
        <h3>Contract Balance is: {contractBal}</h3>
        <button onClick={()=>contractBalance()}>Get Balance</button>
      </div>
    </>
  );
};

export default Manager;
