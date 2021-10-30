const DappTokenSale = artifacts.require('DappTokenSale')


contract("DappTokenSale", async (accounts) => {
    let tokenSaleContract;
    let myTokenPrice = 1000000000000000000;// in wai 
    it("initializez the contract with the correct values", async () => {
        tokenSaleContract = await DappTokenSale.deployed()
        tsAddress = tokenSaleContract.address
        assert.notEqual(tsAddress, 0x0, "has contract address ")

        let tokenContract = await tokenSaleContract.tokenContract
        assert.notEqual(tokenContract, 0x0, "has tokenContract address ")

        let tokenPrice = await tokenSaleContract.tokenPrice()
        assert.equal(tokenPrice, myTokenPrice, "token price  is correct")


    })


})