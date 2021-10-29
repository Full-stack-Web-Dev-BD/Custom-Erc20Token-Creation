var DappToken = artifacts.require('./DappToken.sol')

contract("DappToken", async (accounts) => {
    it('Initializes the contract with the correct values', async () => {
        let dappTokenInstance = await DappToken.deployed()
        let tokenName = await dappTokenInstance.name()
        let tokenSymbol = await dappTokenInstance.symbol()
        let standerd = await dappTokenInstance.standerd()
        assert.equal(tokenName, "BDTC", "Set the token name !")
        assert.equal(tokenSymbol, "BDTCSymbol", "Set the token symbol !");
        assert.equal(standerd, "DApp Token v1.0", "Has the correct version !");
    })
    it("Sets the total suppley upon deployment ", async () => {
        let dappTokenInstance = await DappToken.deployed()
        let totalSupply = (await dappTokenInstance.totalSupply()).toNumber()
        let adminBalance = (await dappTokenInstance.balanceOf(accounts[0])).toNumber()
        assert.equal(totalSupply, 1000000, 'Sets the total supply to 1M')
        assert.equal(adminBalance, 1000000, 'It allocated as initial supply to the admin account')
    })
    it("transfer token ownership", async () => {
        let dappTokenInstance = await DappToken.deployed()
        let success = (await dappTokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] }))
        assert.equal(success, true, "it should return true");
        let log = (await dappTokenInstance.transfer(accounts[1], 250000, { from: accounts[0] })).receipt.logs
        assert.equal(log.length, 1, "triggers one event ");
        assert.equal(log[0].event, "Transfer", 'should be "Transfer" event')
        assert.equal(log[0].args._from, accounts[0], 'logs the account  the tokens are  fransferred from ')
        assert.equal(log[0].args._to, accounts[1], 'logs the account  the tokens are  fransferred to')
        let balance = (await dappTokenInstance.balanceOf(accounts[1])).toNumber()
        let senderBalance = (await dappTokenInstance.balanceOf(accounts[0])).toNumber()
        assert.equal(balance, 250000, "adds the amount to the receiving account")
        assert.equal(senderBalance, 750000, "deducts amount to the sending account")
    })
    it("approve tokens for delegated transfer ", async () => {
        let dappTokenInstance = await DappToken.deployed()
        let approveResult = await dappTokenInstance.approve.call(accounts[0], 100)
        assert.equal(approveResult, true, "it returns true")
        let approveEvent = (await dappTokenInstance.approve(accounts[1], 100)).receipt.logs
        assert.equal(approveEvent.length, 1, "triggers one event ");
        assert.equal(approveEvent[0].event, "Approve", 'should be "Approve " event')
        assert.equal(approveEvent[0].args._owner, accounts[0], 'logs the account  the tokens are  owner ')
        assert.equal(approveEvent[0].args._spender, accounts[1], 'logs the account  the tokens are  spender')
        assert.equal(approveEvent[0].args._value, 100, 'logs the transfer amount')


    })
})