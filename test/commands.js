const instance = await NftMarket.deployed();

instance.mintToken("https://gateway.pinata.cloud/ipfs/QmZoBvJZqoVU64nXza1omA3sMHhiNGQ1cckL6rsTnv5ea8?_gl=1*1muurdx*_ga*MTAyMTkzMzY4OC4xNjc0Njc5Mzkz*_ga_5RMPXG14TE*MTY3NDczOTMwMy4zLjEuMTY3NDczOTM4NC41Ny4wLjA.","500000000000000000",{value: "25000000000000000",from: accounts[0]});
instance.mintToken("https://gateway.pinata.cloud/ipfs/Qmayrzq2KJSWhbyZVgSUNMZNt5sjpiTrbMeRYdcu1gP7qQ?_gl=1*ackwyj*_ga*MTAyMTkzMzY4OC4xNjc0Njc5Mzkz*_ga_5RMPXG14TE*MTY3NDczOTMwMy4zLjEuMTY3NDczOTM4NC41Ny4wLjA.","500000000000000000",{value: "25000000000000000",from: accounts[0]});
