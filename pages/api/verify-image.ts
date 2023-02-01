import { v4 as uuidv4 } from "uuid";
import { Session } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { addressCheckMiddleware, withSession, pinataJwt } from './utils';
import { contractAddress } from "./utils";
import { FileRequest, NftMeta } from '@_types/nft';
import axios from "axios";
import FormData from "form-data";

export default withSession(async (request: NextApiRequest & { session: Session }, response: NextApiResponse) => {
  if (request.method === "POST") {
    try {
      const { bytes, fileName, contentType } = request.body as FileRequest;
      
      if (!bytes || !fileName || !contentType) {
        return response.status(422).send({ message: "Image data are missing!"});
      }

      await addressCheckMiddleware(request, response);

      const buffer = Buffer.from(Object.values(bytes));
      const formData = new FormData();
      formData.append(
        "file",
        buffer, {
          contentType,
          filename: fileName + "-" + uuidv4()
        }
      );
      
      const fileResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
          'Authorization': 'Bearer ' + pinataJwt
        }
      });

      return response.status(200).send(fileResponse.data);

    } catch (error: any) {
      return response.status(422).send({ message: "Cannot create JSON"});
    }
  } else {
    return response.status(422).send({ message: "Invalid endpoint"});
  } 
});
