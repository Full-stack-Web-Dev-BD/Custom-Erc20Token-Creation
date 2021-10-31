const DappToken = artifacts.require("DappToken");
const DappTokenSale = artifacts.require("DappTokenSale");

module.exports = async function (deployer) {
  let tokenPrice = BigInt(10000000000000000);// in wai  --need to devine bigint  otherwise getting error for this big number in js

  await deployer.deploy(DappToken, 1000000, "BDTC", "BDTCSymbol");
  await deployer.deploy(DappTokenSale, DappToken.address, tokenPrice);

};
