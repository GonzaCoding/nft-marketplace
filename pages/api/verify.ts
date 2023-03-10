import { v4 as uuidv4 } from "uuid";
import { Session } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { addressCheckMiddleware, withSession, pinataJwt } from './utils';
import { contractAddress } from "./utils";
import { NftMeta } from '@_types/nft';
import axios from "axios";

export default withSession(async (request: NextApiRequest & { session: Session }, response: NextApiResponse) => {
  if (request.method === "POST") {
    try {
      const { body } = request;
      const nft = body.nft as NftMeta;

      if (!nft.name || !nft.description || !nft.attributes) {
        return response.status(422).send({ message: "Some of the form data are missing!"});
      }

      await addressCheckMiddleware(request, response);

      const jsonResponse = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        pinataMetadata: {
          name: uuidv4()
        },
        pinataContent: nft,
      }, {
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer ' + pinataJwt
        }
      });

      return response.status(200).send(jsonResponse.data);

    } catch (error: any) {
      return response.status(422).send({ message: "Cannot create JSON"});
    }
  } else if (request.method === "GET") {
    try {
      const message = {
        contractAddress,
        id: uuidv4(),
      }
      
      request.session.set("message-session", message);
      await request.session.save();
      return response.json(message);

    } catch (error) {
      return response.status(422).send({ message: "Cannot generate a message!"});
    }
  } else {
    return response.status(200).json({ message: "Invalid api route"});
  } 
});
