const NftMarket = artifacts.require("NftMarket");

contract("NftMarket", accounts => {
  let _contract = null;

  before(async () => {
    _contract = await NftMarket.deployed();
  });

  describe("Mint token", () => {
    const tokenURI = "https://test.com";

    before(async () => {
      await _contract.mintToken(tokenURI, {
        from: accounts[0]
      });
    });
    
    it("owner of the first token should be address[0]", async () => {
      const owner = await _contract.ownerOf(1);
      assert(owner === accounts[0], "Owner of token is not matching address[0]");
    });

    it("first token should point to the correct tokenURI", async () => {
      const actualTokenURI = await _contract.tokenURI(1);
      assert(actualTokenURI === tokenURI, "TokenURI is not correctly set");
    });


  });
});