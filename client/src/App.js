import React, { useEffect, useRef, useState } from 'react'
import Web3 from 'web3'
require('./app.css')

const App = () => {
  const w3 = useRef(null)
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState("0x0")

  const [dtsState, setDtsState] = useState({
    tokenPrice: null,
    soldToken: null,
    totalSupply: null,
  })



  useEffect(async () => {
    var dappTokenJson = require('./contracts/DappToken.json')
    var dappTokenSaleJson = require('./contracts/DappTokenSale.json')
    var web3 = new Web3("http://localhost:7545")
    w3.current = web3
    var networkID = await web3.eth.net.getId()
    var DTnetworkData = dappTokenJson.networks[networkID]
    var DTSnetworkData = dappTokenSaleJson.networks[networkID]
    if (DTnetworkData && DTSnetworkData) {
      var DT = new web3.eth.Contract(dappTokenJson.abi, DTnetworkData.address)
      var DTS = new web3.eth.Contract(dappTokenSaleJson.abi, DTSnetworkData.address)
      web3.eth.getCoinbase((err, account) => {
        if (err) {
        } else {
          setAccount(account)
        }
      })
      setDtsState({
        ...dtsState,
        tokenPrice: web3.utils.fromWei(await DTS.methods.tokenPrice().call()),
        soldToken: 600000,
        totalSupply: await DT.methods.totalSupply().call()
      })
      setLoading(false)
    }
  }, [])


  return (
    <div className="app" >
      <div className="container   pt-5">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card p-4">
              <h3 className="text-center text-warning  "> Dapp Token Sale</h3>
              <hr />
              {
                loading ?
                  <h3 className="text-center ">Loading ... </h3>
                  :
                  <div>
                    <p className="alert alert-success p-2" >Introducing  "DApp Token " (DAPP)!
                      <span className="mr-2">Token Price is</span>
                      <span className="text-success bext-bold"><i class="fab fa-ethereum"></i>{(dtsState.tokenPrice)} </span>
                      <span> Ether. You currently have</span>
                      <span className="text-warning"> 0-DAPP </span>
                    </p>
                    <div class="progress">
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{
                          width: `${((dtsState.soldToken / dtsState.totalSupply) * 100)}%`
                        }}
                      >
                        {dtsState.soldToken}/{dtsState.totalSupply - dtsState.soldToken}
                      </div>
                    </div>
                    <div className="form">
                      <form className="mt-1">
                        <div className="text-right">
                          <input required className="form-control" type="number" placeholder="Enter Amount of Token" />
                          <button className="btn btn-success btn-sm mt-2">Buy DAPP Tokens</button>
                        </div>
                      </form>
                    </div>
                    <p className="mt-4 text-center">{dtsState.soldToken} / {dtsState.totalSupply} </p>
                    <p className="mt-4 text-center"> Your Account is :  {account} </p>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>

    </div >
  )
}

export default App
