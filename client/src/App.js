import React, { useEffect, useRef, useState } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'


const App = () => {
  const [account, setAccount] = useState("0x0")
  useEffect(async () => {
    // connect with web3
    var dappTokenJson = require('./contracts/DappToken.json')
    var dappTokenSaleJson = require('./contracts/DappTokenSale.json')
    var web3 = new Web3("http://localhost:7545")
    var networkID = await web3.eth.net.getId()
    var DTnetworkData = dappTokenJson.networks[networkID]
    var DTSnetworkData = dappTokenSaleJson.networks[networkID]
    if (DTnetworkData && DTSnetworkData) {
      var DT = new web3.eth.Contract(dappTokenJson.abi, DTnetworkData.address)
      var DTS = new web3.eth.Contract(dappTokenSaleJson.abi, DTSnetworkData.address)
      web3.eth.getCoinbase((err, account) => {
        if (err) {
          console.log(err)
        } else {
          setAccount(account)
        }
      })
    }
  }, [])


  return (
    <div>
      <div className="container mt-5 pt-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="card p-3">
              <h3 className="text-center text-warning  "> Dapp Token Sale</h3>
              <hr />
              <p className="alert alert-success p-2" >Introducing  "DApp Token " (DAPP)!
                Token Price is
                <span>Ether. You currently have
                  <span className="text-warning"> 0-DAPP </span>
                </span>
              </p>
              <div class="progress mt-3">
                <div class="progress-bar bb-warning " role="progressbar" style={{ width: '45%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">30,054/75,000</div>
              </div>
              <div className="form">
                <form className="mt-1">
                  <div className="text-right">
                    <input required className="form-control" type="number" placeholder="Enter Amount of Token" />
                    <button className="btn btn-success btn-sm mt-2">Buy DAPP Tokens</button>
                  </div>
                </form>
              </div>
              <p className="mt-4 text-center"> >Your Account is :  {account} </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default App
