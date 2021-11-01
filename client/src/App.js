import React, { useEffect, useRef, useState } from 'react'
import "./app.css"
import Web3 from 'web3'
const App = () => {

  const dtRef = useRef(null)
  const dtsRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState("0x0")
  const [token, setToken] = useState(1)
  const [myBalance, setMyBalance] = useState()
  const [dtsBalance, setDtsBalance] = useState(0)

  const [dtsState, setDtsState] = useState({
    tokenPriceETH: null,
    tokenPrice: null,
    tokenSold: null,
    totalSupply: null,
    tokenAvailable: 750000,
  })
  useEffect(() => {
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider)
    } else {
      var web3Provider = new Web3.providers.HttpProvider("http://localhost:7545")
      window.web3 = new Web3(web3Provider)
    }
    initContracts()
    setLoading(false)
  }, [])

  const initContracts = async () => {
    var dappToken = require("./contracts/DappToken.json")
    var dappTokenSale = require("./contracts/DappTokenSale.json")

    var DT = TruffleContract(dappToken)
    var DTS = TruffleContract(dappTokenSale)

    DT.setProvider(web3.currentProvider)
    DTS.setProvider(web3.currentProvider)

    var DTContracts = await DT.deployed()
    dtRef.current = DTContracts
    var DTSContracts = await DTS.deployed()
    dtsRef.current = DTSContracts


    var tokenPrice = await DTSContracts.tokenPrice()
    var tokenSold = await DTSContracts.tokenSold()

    web3.eth.getCoinbase(async (err, account) => {
      if (err) {
        console.log(err)
      } else {
        setAccount(account)
        var myBalance = await DTContracts.balanceOf(account)
        setMyBalance(myBalance.toNumber())
        setDtsState({
          ...dtsState,
          tokenPrice: tokenPrice.toNumber(),
          tokenSold: tokenSold.toNumber(),
          tokenPriceETH: web3.utils.fromWei(`${tokenPrice}`),
        })
      }
    })
  }

  const buyToken = async (e) => {
    e.preventDefault()
    if (token == 0) {
      alert('Cant buy 0 token')
    }
    var tokenvalue = token * dtsState.tokenPrice
    dtsRef.current.buyTokens(token, {
      from: account,
      value: tokenvalue,
    })
      .then((result) => {
        console.log('result ', result)
      })
  }
  return (
    <div className="app  pt-5">
      <div className="container  ">
        <div className="card p-4">
          <h3 className="text-center text-warning  "> Dapp Token Sale</h3>
          <hr />
          {
            loading ?
              <h3 className="text-center ">Loading ... </h3>
              :
              <div>
                <span className="badge badge-success badge-sm m-1 "> My Balance :<i className="fab fa-ethereum m-1" >   </i> {myBalance}  </span>
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
                      width: `${((dtsState.tokenSOld / dtsState.tokenAvailable) * 100)}%`
                    }}
                  >
                  </div>
                </div>
                <p className=" text-center">{dtsState.tokenSold} / {dtsState.tokenAvailable} </p>
                <p className="mt-4 text-center"> Your Account is :  {account} </p>
              </div>
          }
        </div>      </div>
    </div>
  )
}

export default App
