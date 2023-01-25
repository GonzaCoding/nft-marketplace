const NftMarket = artifacts.require("NftMarket");
const truffleAssert = require("truffle-assertions");
const { ethers } = require("ethers");

contract("NftMarket", accounts => {
  let _contract = null;
  let _nftPrice = ethers.utils.parseEther("0.3").toString();
  let _listingPrice = ethers.utils.parseEther("0.025").toString();

  before(async () => {
    _contract = await NftMarket.deployed();
  });

  describe("Mint token", () => {
    const tokenURI = "https://test.com";

    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
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

    it("should not be possible to create a NFT with used tokenURI", async () => {
      await truffleAssert.fails(
        _contract.mintToken(tokenURI, _nftPrice, {
          from: accounts[0]
        }),
        truffleAssert.ErrorType.REVERT,
        "Token URI already exists"
      )
    });

    it("should have one listed item", async () => {
      const listedItems = await _contract.listedItemsCount();
      assert.equal(listedItems.toNumber(), 1, "Listed items count is not 1");
    });

    it("should have create NFT item", async () => {
      const nftItem = await _contract.getNftItem(1);
      assert.equal(nftItem.tokenId, 1, "Token id is not 1");
      assert.equal(nftItem.price, _nftPrice, "Token price is not correct");
      assert.equal(nftItem.creator, accounts[0], "Creator is not account[0");
      assert.equal(nftItem.isListed, true, "Token is not listed");
    });

  });

  describe("Buy NFT", () => {
    const tokenURI = "https://test.com";

    before(async () => {
      await _contract.buyNft(1, {
        from: accounts[1],
        value: _nftPrice,
      });
    });
    
    it("should unlist the item", async () => {
      const listedItem = await _contract.getNftItem(1);
      assert.equal(listedItem.isListed, false, "Item is still listed");
    });

    it("should decrese listed items count", async () => {
      const listedItemsCount = await _contract.listedItemsCount();
      assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decremented");
    });

    it("should change the owner", async () => {
      const currentOwner = await _contract.ownerOf(1);
      assert.equal(currentOwner, accounts[1], "Owner has not changed");
    });

  });

  describe("Token transfers", () => {
    const tokenURI = "https://test-json-2.com";

    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });
    
    it("should have 2 NFTs created", async () => {
      const totalSupply = await _contract.totalSupply();
      assert.equal(totalSupply.toNumber(), 2, "Total supply of token is not correct");
    });

    it("should be able to retrieve nft by index", async () => {
      const nftId1 = await _contract.tokenByIndex(0);
      const nftId2 = await _contract.tokenByIndex(1);
      
      assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
      assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
    });

    it("should have 1 listed NFT", async () => {
      const allNfts = await _contract.getAllNftsOnSale();
      assert.equal(allNfts[0].tokenId, 2, "Nft has a wrong id");
    });

    it("account[0] should have 1 owned NFT", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
      assert.equal(ownedNfts[0].tokenId, 2, "Nft has a wrong id");
    });

    it("account[1] should have 1 owned NFT", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
      assert.equal(ownedNfts[0].tokenId, 1, "Nft has a wrong id");
    });

  });
});