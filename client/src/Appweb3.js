import React, { useEffect, useRef, useState } from 'react'
import Web3 from 'web3'
require('./app.css')

const App = () => {
  const w3 = useRef(null)
  const dts = useRef(null)
  const dt = useRef(null)
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState("0x0")
  const [token, setToken] = useState(1)
  const [myBalance, setMyBalance] = useState()
  const [dtsBalance, setDtsBalance] = useState(0)

  const [dtsState, setDtsState] = useState({
    tokenPriceETH: null,
    tokenPrice: null,
    soldToken: null,
    totalSupply: null,
    availableToken: null,
  })



  useEffect(async () => {
    window.ethereum.enable()
    var dappTokenJson = require('./contracts/DappToken.json')
    var dappTokenSaleJson = require('./contracts/DappTokenSale.json')
    var web3 = new Web3("http://localhost:7545")
    w3.current = web3
    var networkID = await web3.eth.net.getId()
    var DTnetworkData = dappTokenJson.networks[networkID]
    var DTSnetworkData = dappTokenSaleJson.networks[networkID]
    if (DTnetworkData && DTSnetworkData) {
      var DT = new web3.eth.Contract(dappTokenJson.abi, DTnetworkData.address)
      dt.current = DT
      var DTS = new web3.eth.Contract(dappTokenSaleJson.abi, DTSnetworkData.address)
      dts.current = DTS
      web3.eth.getCoinbase(async (err, account) => {
        if (err) {
        } else {
          setAccount(account)
          console.log('aasdf', await DT.methods.balanceOf(DTS._address).call())
          setMyBalance(await DT.methods.balanceOf(account).call())
          setDtsBalance(await DT.methods.balanceOf(DTS._address).call())
          return


        }
      })
      setDtsState({
        ...dtsState,
        tokenPriceETH: web3.utils.fromWei(await DTS.methods.tokenPrice().call()),
        tokenPrice: await DTS.methods.tokenPrice().call(),
        soldToken: await DTS.methods.tokenSold().call(),
        totalSupply: await DT.methods.totalSupply().call(),
        availableToken: (await DT.methods.balanceOf(DTS._address).call())
      })
      setLoading(false)
    }
  }, [])
  const depositDts = () => {
    let amount = window.prompt("Enter Amount")
    dt.current.methods.transfer(dts.current._address, amount).send({ from: account })
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash)
        window.location.reload()
      })
      .on("confirmation", (confirmation, receipt) => {
        console.log("confirmation", confirmation, receipt)
      })
      .on("receipt", (receipt) => {
        console.log(receipt)
      })
      .on('error', (err) => {
        console.log('err', err)
      })
  }
  const buyToken = async (e) => {
    e.preventDefault()
    if (token == 0) {
      alert('Cant buy 0 token')
    }
    var tokenvalue = token * dtsState.tokenPrice
    dts.current.methods.buyTokens(token).send({ from: account, value: tokenvalue })
      .on('transactionHash', (hash) => {
        window.location.reload()
      })
      .on("confirmation", (confirmation, receipt) => {
        console.log("confirmation", confirmation, receipt)
      })
      .on("receipt", (receipt) => {
        console.log(receipt)
      })
      .on('error', (err) => {
        console.log('err', err)
      })

  }
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
                    <span className="badge badge-success badge-sm m-1 "> Admin Balance :<i className="fab fa-ethereum m-1" >   </i> {myBalance}  </span>
                    <span className="badge badge-success badge-sm m-1 "> DTS   Balance :<i className="fab fa-ethereum m-1" >   </i> {dtsBalance}  </span>
                    <p className="alert alert-success p-2" >Introducing  "DApp Token " (DAPP)!
                      <span className="mr-2">Token Price is</span>
                      <span className="text-success bext-bold"><i className="fab fa-ethereum"></i>{(dtsState.tokenPriceETH)} </span>
                      <span> Ether. You currently have</span>
                      <span className="text-warning"> {myBalance} -DAPP </span>
                    </p>
                    <div className="form">
                      <form onSubmit={e => { buyToken(e) }} className="mt-1">
                        <div className="text-right">
                          <input value={token} onChange={e => setToken(e.target.value)} required className="form-control" type="number" placeholder="Enter Amount of Token" />
                          <button className="btn btn-success btn-sm mt-2">Buy DAPP Tokens</button>
                        </div>
                      </form>
                      <button className="btn btn-success btn-sm mt-2" onClick={e => depositDts()}> Deposit to DTS </button>
                    </div>

                    <div class="progress mt-2">
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
                    <p className=" text-center">{dtsState.soldToken} / {dtsState.availableToken} </p>
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
