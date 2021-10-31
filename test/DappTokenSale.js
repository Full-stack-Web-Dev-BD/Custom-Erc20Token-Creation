const DappToken = artifacts.require('DappToken')
const DappTokenSale = artifacts.require('DappTokenSale')


contract("DappTokenSale", async (accounts) => {
    var dtsc;//tokdn sale contract
    var dtc;//dapp token contract
    var myTokenPrice = 10000000000000000;// in wai 
    var admin = accounts[0]
    var buyer = accounts[1]
    var tokenAvailable = 750000

    it("initializez the contract with the correct values", async () => {
        dtsc = await DappTokenSale.deployed()
        tsAddress = dtsc.address
        assert.notEqual(tsAddress, 0x0, "has contract address ")

        let tokenContract = await dtsc.tokenContract
        assert.notEqual(tokenContract, 0x0, "has tokenContract address ")

        let tokenPrice = await dtsc.tokenPrice()
        assert.equal(tokenPrice, myTokenPrice, "token price  is correct")
    })

    it('facilitates token buying ', async () => {
        var numberOfToken = 10
        var value = numberOfToken * myTokenPrice
        dtsc = await DappTokenSale.deployed()
        dtc = await DappToken.deployed()
        await dtc.transfer(dtsc.address, tokenAvailable, { from: admin })
        var receipt = (await dtsc.buyTokens(numberOfToken, { from: buyer, value: value })).receipt.logs
        assert.equal(receipt.length, 1, "triggers one event")
        assert.equal(receipt[0].event, "Sell", "should be call 'Sell' event ")
        assert.equal(receipt[0].args._buyer, buyer, "log the account purchased token")
        assert.equal((await receipt[0].args._amount).toNumber(), numberOfToken, "log the amount of token sold ")
        var soldToken = await dtsc.tokenSold()
        assert.equal(soldToken, numberOfToken, "increment the number of tokens sold")
        let buyerBalance = await dtc.balanceOf(buyer)
        assert.equal(buyerBalance.toNumber(), numberOfToken, "should be match with purchased amount")
    })
    // it('end token sale ', async () => {
    //     var dtsc = await DappTokenSale.deployed()
    //     var dtc = await DappToken.deployed()
    //     // try to end sale from account other then the admin
    //     var endsaleReceipt = (await dtsc.endSale({ from: admin, gas: 30000 })).receipt.logs
    //     var adminBalance = (await dtc.balanceOf(admin))
    //     assert.equal(adminBalance.toNumber(), 1000, 'return all unsold dapp token to admin')
    //     // check that token price was reset when selfDestruct was called 
    //     let tokenPrice = await dtsc.tokenPrice()
    //     assert.equal(tokenPrice, 0, "token price was reset ")
    // })

})