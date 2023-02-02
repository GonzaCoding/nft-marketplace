import { Session, withIronSession } from "next-iron-session";
import * as util from "ethereumjs-util";
import contract from "../../public/contracts/NftMarket.json";
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from "ethers";
import { NftMarketContract } from "@_types/nftMarketContract";

const NETWORKS = {
  "5777": "Ganache"
};

type NETWORK = typeof NETWORKS;

const abi = contract.abi;
const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

export const contractAddress = contract["networks"][targetNetwork]["address"];
export const pinataJwt = process.env.PINATA_JWT;
export const pinataImageBaseUrl = process.env.NEXT_PUBLIC_PINATA_IMAGE_BASE_URL;

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "nft-auth-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
    }
  });
};

export const addressCheckMiddleware = async (request: NextApiRequest & { session: Session }, response: NextApiResponse) => {
  return new Promise(async (resolve, reject) => {
    const message = request.session.get("message-session");
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
    const contract = new ethers.Contract(
      contractAddress,
      abi,
      provider,
    ) as unknown as NftMarketContract;

    let nonce: string | Buffer = "\x19Ethereum Signed Message:\n" + JSON.stringify(message).length + JSON.stringify(message);
    nonce = util.keccak(Buffer.from(nonce, "utf-8"));
    const { v, r, s} = util.fromRpcSig(request.body.signature);
    const publicKey = util.ecrecover(util.toBuffer(nonce), v, r, s);
    const addressBuffer = util.pubToAddress(publicKey);
    const address = util.bufferToHex(addressBuffer);

    if (address === request.body.address) {
      resolve("Correct Address");
    } else {
      reject("Wrong address");
    }
  })
}