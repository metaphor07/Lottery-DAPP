import React, { useEffect, useState } from "react";

const Players = ({ state, address }) => {
  const [account, setAccount] = useState("no account connected");
  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [reload, setReload] = useState(false);

//   this is used to do the reload functionalty of this page properly...
  const reloadEffect = () => {
    setReload(!reload); //this statement, is toggle the "setReload"
    // means, if it is {true} it change it {false}
  };

  // this is used to solve the update problem, means, when we change "account" or something we need to "refresh" the page all time
  // so, we use this functonality. And it is probided by the "metamask wallet"
  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (accounts) => {
      setAccount(accounts[0]);
    });
  };

  useEffect(() => {
    const getAccounts = async () => {
      const { web3 } = state;
      const accounts = await web3.eth.getAccounts();

      setAccountListener(web3.givenProvider);

      setAccount(accounts[0]);
    };
    state.web3 && getAccounts();
  }, [state, state.web3]);


  useEffect(() => {
    const getPlayers = async () => {
      const { contract } = state;
      const participents = await contract.methods.allParticipents().call();
      console.log("participents are: ", participents);

      const allPlayers = await Promise.all(
        participents.map((player) => {
          return player;
        })
      );

      setRegisteredPlayers(allPlayers);
      console.log("all players: ", allPlayers);
      reloadEffect();
    };

    state.web3 && getPlayers();
  }, [state, state.contract, reload]);


  return (
    <div>
      <h1>All Players List is Here</h1>
      <h3>
        Pay 1 Ether{" "}
        <span style={{ fontWeight: "bold", color: "green" }}>{address}</span> in
        this address to participate
      </h3>
      <hr />
      <p>
        {" "}
        <span style={{ fontWeight: "bold", fontSize: "1.3rem" }}>
          {" "}
          Your account is:
        </span>{" "}
        <span style={{ fontSize: "1.3rem", color: "orange" }}>{account}</span>
      </p>
      <br /> <hr />
      {registeredPlayers.length !== 0 &&
        registeredPlayers.map((player, index) => {
          return (
            <p key={index}>
              {" "}
              <span style={{ fontWeight: "bold", color: "green" }}>
                Player-{index + 1} :
              </span>{" "}
              {player}
            </p>
          );
        })}
    </div>
  );
};

export default Players;
