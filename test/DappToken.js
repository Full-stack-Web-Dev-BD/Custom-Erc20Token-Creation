var DappToken = artifacts.require('./DappToken.sol')

contract("DappToken", async (accounts) => {
    it('Initializes the contract with the correct values', async () => {
        let dappTokenInstance = await DappToken.deployed()
        let tokenName = await dappTokenInstance.name()
        let tokenSymbol = await dappTokenInstance.symbol()
        let standard = await dappTokenInstance.standard()
        assert.equal(tokenName, "BDTC", "Set the token name !")
        assert.equal(tokenSymbol, "BDTCSymbol", "Set the token symbol !");
        assert.equal(standard, "DApp Token v1.0", "Has the correct version !");
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
        assert.equal(approveResult, true, "it should returns true")
        let approveEvent = (await dappTokenInstance.approve(accounts[1], 100)).receipt.logs
        assert.equal(approveEvent.length, 1, "triggers one event ");
        assert.equal(approveEvent[0].event, "Approve", 'should be "Approve " event')
        assert.equal(approveEvent[0].args._owner, accounts[0], 'logs the account  the tokens are  owner ')
        assert.equal(approveEvent[0].args._spender, accounts[1], 'logs the account  the tokens are  spender')
        assert.equal(approveEvent[0].args._value, 100, 'logs the transfer amount')

        await dappTokenInstance.approve(accounts[1], 100), { from: accounts[0] }
        let allowance = (await dappTokenInstance.allowance(accounts[0], accounts[1])).toNumber()
        assert.equal(allowance, 100, "should  be store the allowance for delegated transfer ")
    })
    it('should handles delegated token transfers ', async () => {
        let dappTokenInstance = await DappToken.deployed()
        let fromAccount = accounts[2]
        let toAccount = accounts[3]
        let spendingAccount = accounts[4]
        //transfer some token  to fromAccount
        await dappTokenInstance.transfer(fromAccount, 100, { from: accounts[0] })
        await dappTokenInstance.approve(spendingAccount, 10, { from: fromAccount })
        let transferFromReceipt = (await dappTokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount })).receipt.logs
        assert.equal(transferFromReceipt.length, 1, "triggers one event ");
        assert.equal(transferFromReceipt[0].event, "Transfer", 'should be "Transfer " event')
        assert.equal(transferFromReceipt[0].args._from, accounts[2], 'logs the account  the tokens are  owner ')
        assert.equal(transferFromReceipt[0].args._to, accounts[3], 'logs the account  the tokens are  spender')
        assert.equal(transferFromReceipt[0].args._value, 10, 'logs the transfer amount')
        let success = await dappTokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount })
        let = await dappTokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount })
        assert.equal(success, true, "should return true for delegated transfer")

        let fromAccountBalance = (await dappTokenInstance.balanceOf(fromAccount)).toNumber()
        assert.equal(fromAccountBalance, 90, "balance should be  90 after sending  10 token")

        let toAccountBalance = (await dappTokenInstance.balanceOf(toAccount)).toNumber()
        assert.equal(toAccountBalance, 10, "balance should be  10 after getting  10 token")

        let allowance = (await dappTokenInstance.allowance(fromAccount, spendingAccount)).toNumber()
        assert.equal(allowance, 0, "deducts the amount  from allowance ")

    })
})