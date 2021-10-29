var DappToken = artifacts.require('./DappToken.sol')

contract("DappToken", async (accounts) => {
    it("Sets the total suppley upon deployment ", async () => {
        let dappTokenInstance = await DappToken.deployed()
        let totalSupplyBN = await dappTokenInstance.totalSupply()
        let totalSupply = totalSupplyBN.toNumber()
        return assert.equal(totalSupply, 1000000, 'Sets the total supply to 1M')
    })

})